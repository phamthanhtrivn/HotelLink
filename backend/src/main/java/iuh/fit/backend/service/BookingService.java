package iuh.fit.backend.service;

import com.nimbusds.oauth2.sdk.http.HTTPResponse;
import iuh.fit.backend.dto.*;
import iuh.fit.backend.entity.*;
import iuh.fit.backend.repository.*;
import iuh.fit.backend.util.IdUtil;
import iuh.fit.backend.util.SecurityUtil;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepo bookingRepo;
    private final RoomService roomService;
    private final RoomRepo roomRepo;
    private final CustomerRepo customerRepo;
    private final UserRepo userRepo;
    private final IdUtil idUtil;
    private final EmailService emailService;
    private final BookingService_Service bookingServiceService;

    public APIResponse<Page<BookingSearchDTO>> searchAdvance(
            BookingSearchRequest request,
            Pageable pageable
    ) {
        APIResponse<Page<BookingSearchDTO>> response = new APIResponse<>();

        LocalDateTime checkInFrom = request.getCheckInFrom();
        LocalDateTime checkInTo = request.getCheckInTo();
        LocalDateTime checkOutFrom = request.getCheckOutFrom();
        LocalDateTime checkOutTo = request.getCheckOutTo();

        if (request.getCheckInFrom() != null && request.getCheckInTo() != null) {
            checkInFrom = request.getCheckInFrom().toLocalDate().atTime(14, 0);
            checkInTo = request.getCheckInTo().toLocalDate().atTime(14, 0);
        }

        if (request.getCheckOutFrom() != null && request.getCheckOutTo() != null) {
            checkOutFrom = request.getCheckOutFrom().toLocalDate().atTime(12, 0);
            checkOutTo = request.getCheckOutTo().toLocalDate().atTime(12, 0);
        }

        Page<Booking> result = bookingRepo.searchAdvance(
                normalize(request.getKeyword()),
                request.getBookingStatus(),
                request.getBookingSource(),
                request.getRoomNumber(),
                request.getPaid(),
                checkInFrom,
                checkInTo,
                checkOutFrom,
                checkOutTo,
                pageable
        );

        Page<BookingSearchDTO> dtoPage = result.map(booking -> {
            List<BookingServiceEntity> services =
                    bookingServiceService.getServicesByBookingId(booking.getId());

            BookingSearchDTO dto = new BookingSearchDTO();
            dto.setBooking(booking);
            dto.setBookingServices(services);

            return dto;
        });

        response.setSuccess(true);
        response.setStatus(HTTPResponse.SC_OK);
        response.setMessage("Tìm kiếm đơn đặt phòng thành công");
        response.setData(dtoPage);

        return response;
    }

    private String normalize(String keyword) {
        return (keyword == null || keyword.isBlank()) ? null : keyword.trim();
    }


    public APIResponse<Booking> createBookingByCustomer(BookingRequest request) {
        APIResponse<Booking> response = new APIResponse<>();
        List<Room> availableRooms = roomService.getAvailableRoomByRoomType(request.getRoomTypeId(), request.getCheckIn(), request.getCheckOut());
        Room assignedRoom = availableRooms.getFirst();
        
        if (assignedRoom == null) {
            response.setSuccess(false);
            response.setStatus(HTTPResponse.SC_BAD_REQUEST);
            response.setMessage("Không còn phòng trống cho loại phòng đã chọn trong khoảng thời gian này.");
            response.setData(null);
            return response;
        }

        Booking booking = new Booking();
        booking.setId(idUtil.generateUniqueCodeForBooking());
        booking.setBookingSource(BookingSource.ONLINE);
        booking.setBookingStatus(request.getTotalPayment() == 0 ? BookingStatus.CONFIRMED : BookingStatus.PENDING);
        booking.setCheckIn(request.getCheckIn());
        booking.setCheckOut(request.getCheckOut());
        booking.setContactEmail(request.getEmail());
        booking.setContactName(request.getName());
        booking.setContactPhone(request.getPhone());
        booking.setCreatedAt(LocalDateTime.now());
        booking.setExtraServices(0);
        booking.setFirstTimeDiscount(request.getFirstTimeDiscount());
        booking.setNights(request.getNights());
        booking.setNotes(request.getNotes());
        booking.setPaid(request.getTotalPayment() == 0);
        booking.setPointDiscount(request.getPointDiscount());
        booking.setRoomPrice(request.getRoomPrice());
        booking.setTotal(request.getTotal());
        booking.setTotalPayment(request.getTotalPayment());
        booking.setUpdatedAt(null);
        booking.setVatFee(request.getVatFee());
        booking.setActualCheckIn(null);
        booking.setActualCheckOut(null);

        if (request.getUserId() != null) {
            Optional<Customer> customerOpt = customerRepo.findById(request.getUserId());
            Optional<User> userOpt = userRepo.findById(request.getUserId());
            if (customerOpt.isPresent() && userOpt.isPresent()) {
                booking.setCustomer(customerOpt.get());
                booking.setCreatedBy(userOpt.get());
                if (request.getPointDiscount() > 0) {
                    Customer customer = customerOpt.get();
                    customer.setPoints(customer.getPoints() - 10);
                    customerRepo.save(customer);
                }
            } else {
                response.setSuccess(false);
                response.setStatus(HTTPResponse.SC_BAD_REQUEST);
                response.setMessage("Người dùng không tồn tại.");
                response.setData(null);
                return response;
            }
        }
        else {
            booking.setCustomer(null);
            booking.setCreatedBy(null);
        }
        booking.setUpdatedBy(null);
        booking.setRoom(assignedRoom);

        Booking saveBooking = bookingRepo.save(booking);
        if (request.getTotalPayment() == 0) {
            emailService.sendPaymentSuccessEmail(saveBooking.getContactEmail(), saveBooking.getId(), saveBooking.getCheckIn(), saveBooking.getCheckOut(), saveBooking.getTotalPayment());
        }
        else {
            emailService.sendPaymentReminderEmail(saveBooking.getContactEmail(), saveBooking.getId());
        }

        response.setSuccess(true);
        response.setMessage("Đặt phòng thành công.");
        response.setStatus(HTTPResponse.SC_OK);
        response.setData(saveBooking);

        return response;
    }

    @Transactional
    public void cancelExpiredPendingBookings() {
        LocalDateTime expiredTime = LocalDateTime.now().minusMinutes(15);

        List<Booking> expiredBookings = bookingRepo.findExpiredPendingBookings(expiredTime);

        for (Booking booking : expiredBookings) {
            booking.setBookingStatus(BookingStatus.CANCELLED);
            booking.setUpdatedAt(LocalDateTime.now());
            if (booking.getCustomer() != null) {
                updatePointsForCancelledBookings(booking.getId());
            }
        }

        bookingRepo.saveAll(expiredBookings);
    }

    public void updatePointsForCancelledBookings(String bookingId) {
        Optional<Booking> bookingOpt = bookingRepo.findById(bookingId);
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            Customer customer = booking.getCustomer();
            int points = customer.getPoints();
            if (booking.getPointDiscount() > 0) {
                customer.setPoints(points + 10);
            }

            customerRepo.save(customer);
        }
    }

    public APIResponse<Integer> getTotalBookingsByCustomerId(String customerId) {
        APIResponse<Integer> response = new APIResponse<>();
        Integer totalBookings = bookingRepo.countTotalBookingByCustomerId(customerId);

        response.setSuccess(true);
        response.setStatus(HTTPResponse.SC_OK);
        response.setMessage("Lấy tổng số lượt đặt phòng thành công.");
        response.setData(totalBookings);

        return response;
    }

    public APIResponse<Booking> getBookingById(String bookingId) {
        APIResponse<Booking> response = new APIResponse<>();
        Optional<Booking> bookingOpt = bookingRepo.findById(bookingId);

        if (bookingOpt.isPresent()) {
            response.setSuccess(true);
            response.setStatus(HTTPResponse.SC_OK);
            response.setMessage("Lấy thông tin đặt phòng thành công.");
            response.setData(bookingOpt.get());
        } else {
            response.setSuccess(false);
            response.setStatus(HTTPResponse.SC_NOT_FOUND);
            response.setMessage("Đặt phòng không tồn tại.");
            response.setData(null);
        }

        return response;
    }

    public void updateBookingStatusConfirmedByCustomer(String bookingId) {
        Optional<Booking> bookingOpt = bookingRepo.findById(bookingId);
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            if (booking.getBookingStatus() == BookingStatus.PENDING) {
                booking.setBookingStatus(BookingStatus.CONFIRMED);
                booking.setPaid(true);
                booking.setUpdatedAt(LocalDateTime.now());
                if (booking.getCreatedBy() != null) {
                    User user = booking.getCreatedBy();
                    booking.setUpdatedBy(user);
                }
                emailService.sendPaymentSuccessEmail(booking.getContactEmail(), bookingId, booking.getCheckIn(), booking.getCheckOut(), booking.getTotalPayment());
                bookingRepo.save(booking);
            }
            
        }
    }

    public APIResponse<Page<Booking>> getBookingByCustomer(
        String customerId,
        BookingStatus status,
        Pageable pageable
    ) throws AccessDeniedException {

        APIResponse<Page<Booking>> response = new APIResponse<>();
        response.setSuccess(false);
        response.setData(null);

        String currentUserId = SecurityUtil.getCurrentUserId();
        if (!currentUserId.equals(customerId)) {
            response.setStatus(HTTPResponse.SC_UNAUTHORIZED);
            response.setMessage("Chưa đăng nhập");
            return response;
        }

        Optional<Customer> customerOpt = customerRepo.findById(customerId);
        if (customerOpt.isEmpty()) {
            response.setStatus(HTTPResponse.SC_NOT_FOUND);
            response.setMessage("Không tồn tại người dùng này");
            return response;
        }

        Page<Booking> bookings;

        if (status == null) {
            // Không filter → lấy tất cả
            bookings = bookingRepo.findByCustomer(customerOpt.get(), pageable);
        } else {
            // Có filter theo trạng thái
            bookings = bookingRepo.findByCustomerAndBookingStatus(
                    customerOpt.get(),
                    status,
                    pageable
            );
        }

        response.setSuccess(true);
        response.setStatus(HTTPResponse.SC_OK);
        response.setMessage("Lấy danh sách đơn đặt phòng thành công!");
        response.setData(bookings);

        return response;
    }

    public APIResponse<Booking> cancelBookingByCustomer(String bookingId) {
        APIResponse<Booking> response = new APIResponse<>();
        response.setSuccess(false);
        response.setData(null);
        
        Optional<Booking> bookingOpt = bookingRepo.findById(bookingId);
        if (bookingOpt.isEmpty()) {
            response.setStatus(HTTPResponse.SC_NOT_FOUND);
            response.setMessage("Không tìm thấy đơn đặt phòng");
            return response;
        }

        Booking booking = bookingOpt.get();

        LocalDateTime now = LocalDateTime.now();
        long hoursUtilCheckIn = Duration.between(now, booking.getCheckIn()).toHours();

        if (hoursUtilCheckIn <= 24) {
            response.setStatus(HTTPResponse.SC_BAD_REQUEST);
            response.setMessage("Không thể hủy đặt phòng trong vòng 24 giờ trước giờ checkIn");
            return response;
        }

        booking.setBookingStatus(BookingStatus.CANCELLED);
        booking.setUpdatedAt(now);
        booking.setUpdatedBy(booking.getCreatedBy());
        Booking savedBooking = bookingRepo.save(booking);

        response.setSuccess(true);
        response.setMessage("Hủy đặt phòng thành công");
        response.setStatus(HTTPResponse.SC_OK);
        response.setData(savedBooking);

        return response;
    }

    public APIResponse<Booking> createBookingByStaff(StaffBookingRequest bookingRequest) {
        APIResponse<Booking> response = new APIResponse<>();
        response.setSuccess(false);
        response.setData(null);

        boolean isRoomAvailable = roomRepo.isRoomAvailable(bookingRequest.getRoomId(), bookingRequest.getCheckIn(), bookingRequest.getCheckOut());

        if (!isRoomAvailable) {
            response.setStatus(HTTPResponse.SC_BAD_REQUEST);
            response.setMessage("Không thể tạo đơn đặt phòng do phòng không khả dụng trong khoảng thời gian đã chọn");
            return response;
        }
        Room room = roomRepo.findById(bookingRequest.getRoomId()).orElse(null);

        Booking booking = new Booking();
        booking.setId(idUtil.generateUniqueCodeForBooking());
        booking.setContactName(bookingRequest.getContactName());
        booking.setContactEmail(bookingRequest.getContactEmail());
        booking.setContactPhone(bookingRequest.getContactPhone());
        booking.setRoom(room);
        booking.setCheckIn(bookingRequest.getCheckIn());
        booking.setCheckOut(bookingRequest.getCheckOut());
        booking.setRoomPrice(bookingRequest.getRoomPrice());
        booking.setNights(bookingRequest.getNights());
        booking.setNotes(bookingRequest.getNotes());
        booking.setBookingStatus(bookingRequest.getBookingSource() == BookingSource.FRONT_DESK ? BookingStatus.CHECKED_IN : BookingStatus.CONFIRMED);
        booking.setBookingSource(bookingRequest.getBookingSource());
        booking.setCreatedAt(LocalDateTime.now());
        booking.setActualCheckIn(bookingRequest.getBookingSource() == BookingSource.FRONT_DESK ? LocalDateTime.now() : null);
        booking.setActualCheckOut(null);
        booking.setUpdatedBy(null);
        booking.setUpdatedAt(null);
        booking.setExtraServices(0);
        booking.setFirstTimeDiscount(0);
        booking.setPointDiscount(0);

        Optional<User> userOpt = userRepo.findById(bookingRequest.getUserId());
        if (userOpt.isPresent()) {
            booking.setCreatedBy(userOpt.get());
        } else {
            response.setSuccess(false);
            response.setStatus(HTTPResponse.SC_BAD_REQUEST);
            response.setMessage("Người dùng không tồn tại.");
            response.setData(null);
            return response;
        }

        booking.setPaid(Boolean.TRUE.equals(bookingRequest.getPaid()));
        booking.setVatFee(bookingRequest.getVatFee());
        booking.setTotal(bookingRequest.getTotal());
        booking.setTotalPayment(bookingRequest.getTotalPayment());

        Booking savedBooking = bookingRepo.save(booking);

        response.setSuccess(true);
        response.setStatus(HTTPResponse.SC_OK);
        response.setMessage("Tạo đơn đặt phòng thành công");
        response.setData(savedBooking);

        return response;
    }

    public APIResponse<Booking> updateBookingStatusByStaff(String bookingId, UpdateBookingStatusRequest request) {
        APIResponse<Booking> response = new APIResponse<>();
        response.setSuccess(false);
        response.setData(null);

        Optional<User> userOpt = userRepo.findById(request.getUserId());
        if (userOpt.isEmpty()) {
            response.setStatus(HTTPResponse.SC_BAD_REQUEST);
            response.setMessage("Người dùng không tồn tại.");
            return response;
        }

        Optional<Booking> bookingOpt = bookingRepo.findById(bookingId);
        if (bookingOpt.isEmpty()) {
            response.setStatus(HTTPResponse.SC_BAD_REQUEST);
            response.setMessage("Đơn đặt phòng không tồn tại.");
            return response;
        }

        Booking booking = bookingOpt.get();
        BookingStatus currentStatus = booking.getBookingStatus();
        LocalDateTime now = LocalDateTime.now();

        if (request.getBookingStatus() == BookingStatus.CANCELLED) {
            if (currentStatus != BookingStatus.CONFIRMED) {
                response.setStatus(HTTPResponse.SC_BAD_REQUEST);
                response.setMessage("Chỉ có thể hủy đơn khi đơn đang ở trạng thái Xác Nhận.");
                return response;
            }

            if (now.isBefore(booking.getCheckIn().minusDays(1))) {
                response.setStatus(HTTPResponse.SC_BAD_REQUEST);
                response.setMessage("Chỉ có thể hủy đơn trước thời gian check-in ít nhất 1 ngày.");
                return response;
            }

            booking.setBookingStatus(BookingStatus.CANCELLED);
        }
        else if (request.getBookingStatus() == BookingStatus.NO_SHOW){
            if (currentStatus != BookingStatus.CONFIRMED) {
                response.setStatus(HTTPResponse.SC_BAD_REQUEST);
                response.setMessage("Chỉ có thể chuyển Không Đến khi đơn đang ở trạng thái Xác Nhận.");
                return response;
            }

            if (now.isAfter(booking.getCheckIn().plusHours(1))) {
                response.setStatus(HTTPResponse.SC_BAD_REQUEST);
                response.setMessage("Chỉ có thể đánh dấu Không Đến sau giờ check-in ít nhất 1 tiếng.");
                return response;
            }

            booking.setBookingStatus(BookingStatus.NO_SHOW);
        }
        else {
            response.setStatus(HTTPResponse.SC_BAD_REQUEST);
            response.setMessage("Trạng thái không hợp lệ.");
            return response;
        }

        booking.setUpdatedBy(userOpt.get());
        booking.setUpdatedAt(now);

        Booking savedBooking = bookingRepo.save(booking);

        response.setSuccess(true);
        response.setStatus(HTTPResponse.SC_OK);
        response.setMessage("Cập nhật trạng thái đơn đặt phòng thành công.");
        response.setData(savedBooking);

        return response;
    }

    @Transactional
    public APIResponse<Booking> checkInBookingByStaff(String bookingId, CheckInRequest request) {
        APIResponse<Booking> response = new APIResponse<>();
        response.setSuccess(false);
        response.setData(null);

        Optional<User> userOpt = userRepo.findById(request.getUserId());
        if (userOpt.isEmpty()) {
            response.setStatus(HTTPResponse.SC_BAD_REQUEST);
            response.setMessage("Người dùng không tồn tại.");
            return response;
        }

        Optional<Booking> bookingOpt = bookingRepo.findById(bookingId);
        if (bookingOpt.isEmpty()) {
            response.setStatus(HTTPResponse.SC_BAD_REQUEST);
            response.setMessage("Đơn đặt phòng không tồn tại.");
            return response;
        }

        Booking booking = bookingOpt.get();
        BookingStatus currentStatus = booking.getBookingStatus();
        LocalDateTime now = LocalDateTime.now();

        if (currentStatus != BookingStatus.CONFIRMED) {
            response.setStatus(HTTPResponse.SC_BAD_REQUEST);
            response.setMessage("Chỉ có thể check-in khi đơn đang ở trạng thái CONFIRMED.");
            return response;
        }

        if (now.isBefore(booking.getCheckIn().minusMinutes(30))) {
            bookingServiceService.earlyCheckIn(booking.getId());
        }

        booking.setBookingStatus(BookingStatus.CHECKED_IN);
        booking.setActualCheckIn(now);
        booking.setUpdatedBy(userOpt.get());
        booking.setUpdatedAt(now);

        Booking savedBooking = bookingRepo.save(booking);

        response.setSuccess(true);
        response.setStatus(HTTPResponse.SC_OK);
        response.setMessage("Check-in thành công.");
        response.setData(savedBooking);

        return response;
    }

    @Transactional
    public APIResponse<Booking> addServicesToBookingByStaff(String bookingId, AddBookingServiceRequest request) {
        APIResponse<Booking> response = new APIResponse<>();
        response.setSuccess(false);
        response.setData(null);

        Optional<User> userOpt = userRepo.findById(request.getUserId());
        if (userOpt.isEmpty()) {
            response.setStatus(HTTPResponse.SC_BAD_REQUEST);
            response.setMessage("Người dùng không tồn tại.");
            return response;
        }

        Optional<Booking> bookingOpt = bookingRepo.findById(bookingId);
        if (bookingOpt.isEmpty()) {
            response.setStatus(HTTPResponse.SC_BAD_REQUEST);
            response.setMessage("Đơn đặt phòng không tồn tại.");
            return response;
        }

        List<AddBookingServiceRequest.ServiceItem> serviceItems = request.getServices();
        bookingServiceService.addServicesToBooking(bookingId, serviceItems);

        Booking booking = bookingOpt.get();
        booking.setUpdatedBy(userOpt.get());
        booking.setUpdatedAt(LocalDateTime.now());

        Booking savedBooking = bookingRepo.save(booking);

        response.setSuccess(true);
        response.setStatus(HTTPResponse.SC_OK);
        response.setMessage("Thêm dịch vụ vào đơn đặt phòng thành công.");
        response.setData(savedBooking);

        return response;
    }

    public APIResponse<PreviewCheckOutDTO> previewCheckoutByStaff(String bookingId) {
        APIResponse<PreviewCheckOutDTO> response = new APIResponse<>();
        response.setSuccess(false);
        response.setData(null);

        Optional<Booking> bookingOpt = bookingRepo.findById(bookingId);
        if (bookingOpt.isEmpty()) {
            response.setStatus(HTTPResponse.SC_BAD_REQUEST);
            response.setMessage("Đơn đặt phòng không tồn tại.");
            return response;
        }

        Booking booking = bookingOpt.get();

        if (booking.getBookingStatus() != BookingStatus.CHECKED_IN) {
            response.setStatus(HTTPResponse.SC_BAD_REQUEST);
            response.setMessage("Chỉ có thể xem trước thanh toán khi đơn đang ở trạng thái CHECKED_IN.");
            return response;
        }

        PreviewCheckOutDTO previewCheckOutDTO = new PreviewCheckOutDTO();

        List<BookingServiceEntity> usedServices = bookingServiceService.getServicesByBookingId(bookingId);
        previewCheckOutDTO.setUsedServices(usedServices);

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime standardCheckout = booking.getCheckOut().plusMinutes(30);

        boolean isLate = now.isAfter(standardCheckout);
        if (isLate) {
            ServiceEntity lateCheckOutService = bookingServiceService.lateCheckOutService();
            System.out.println(lateCheckOutService.getName().isEmpty() ? "Late check-out service not found" : "Late check-out service found");
            previewCheckOutDTO.setLateCheckOutService(lateCheckOutService);
        }

        System.out.println(previewCheckOutDTO.getLateCheckOutService());

        response.setSuccess(true);
        response.setStatus(HTTPResponse.SC_OK);
        response.setMessage("Xem trước thanh toán thành công.");
        response.setData(previewCheckOutDTO);

        return response;
    }

    @Transactional
    public APIResponse<Booking> checkOutBookingByStaff(String bookingId, CheckOutRequest request) {
        APIResponse<Booking> response = new APIResponse<>();
        response.setSuccess(false);
        response.setData(null);

        Optional<User> userOpt = userRepo.findById(request.getUserId());
        if (userOpt.isEmpty()) {
            response.setStatus(HTTPResponse.SC_BAD_REQUEST);
            response.setMessage("Người dùng không tồn tại.");
            return response;
        }

        Optional<Booking> bookingOpt = bookingRepo.findById(bookingId);
        if (bookingOpt.isEmpty()) {
            response.setStatus(HTTPResponse.SC_BAD_REQUEST);
            response.setMessage("Đơn đặt phòng không tồn tại.");
            return response;
        }

        Booking booking = bookingOpt.get();

        if (booking.getBookingStatus() != BookingStatus.CHECKED_IN) {
            response.setStatus(HTTPResponse.SC_BAD_REQUEST);
            response.setMessage("Chỉ có thể check-out khi đơn đang ở trạng thái CHECKED_IN.");
            return response;
        }

        LocalDateTime now = LocalDateTime.now();

        LocalDateTime standardCheckout = booking.getCheckOut().plusMinutes(30);


        if (now.isAfter(standardCheckout)) {
            bookingServiceService.lateCheckOut(booking);
        }

        List<BookingServiceEntity> usedServices = bookingServiceService.getServicesByBookingId(bookingId);
        double servicesCharge = usedServices.stream().mapToDouble(bs -> bs.getPrice() * bs.getQuantity()).sum();

        booking.setPaid(true);
        booking.setExtraServices(servicesCharge);
        booking.setTotalPayment(booking.getTotalPayment() + servicesCharge);
        booking.setActualCheckOut(now);
        booking.setBookingStatus(BookingStatus.COMPLETED);
        booking.setUpdatedBy(userOpt.get());
        booking.setUpdatedAt(now);

        Booking savedBooking = bookingRepo.save(booking);

        response.setSuccess(true);
        response.setStatus(HTTPResponse.SC_OK);
        response.setMessage("Check-out thành công.");
        response.setData(savedBooking);

        return response;
    }
}
