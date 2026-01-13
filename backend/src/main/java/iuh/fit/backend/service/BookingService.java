package iuh.fit.backend.service;

import com.nimbusds.oauth2.sdk.http.HTTPResponse;
import iuh.fit.backend.dto.APIResponse;
import iuh.fit.backend.dto.BookingRequest;
import iuh.fit.backend.dto.StaffBookingRequest;
import iuh.fit.backend.entity.*;
import iuh.fit.backend.repository.BookingRepo;
import iuh.fit.backend.repository.CustomerRepo;
import iuh.fit.backend.repository.RoomRepo;
import iuh.fit.backend.repository.UserRepo;
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

}
