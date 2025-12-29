package iuh.fit.backend.service;

import com.nimbusds.oauth2.sdk.http.HTTPResponse;
import iuh.fit.backend.dto.APIResponse;
import iuh.fit.backend.dto.BookingRequest;
import iuh.fit.backend.entity.*;
import iuh.fit.backend.repository.BookingRepo;
import iuh.fit.backend.repository.CustomerRepo;
import iuh.fit.backend.repository.UserRepo;
import iuh.fit.backend.util.IdUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepo bookingRepo;
    private final RoomService roomService;
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

        if (request.getUserId() != null) {
            Optional<Customer> customerOpt = customerRepo.findById(request.getUserId());
            Optional<User> userOpt = userRepo.findById(request.getUserId());
            if (customerOpt.isPresent() && userOpt.isPresent()) {
                booking.setCustomer(customerOpt.get());
                booking.setCreatedBy(userOpt.get());
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

    public void updatePointsForPointsDiscountBooking(String bookingId) {
        Optional<Booking> bookingOpt = bookingRepo.findById(bookingId);
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            Customer customer = booking.getCustomer();
            int points = customer.getPoints();
            if (booking.getPointDiscount() > 0) {
                customer.setPoints(points - 10);
            }

            customerRepo.save(customer);
        }
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

}
