package iuh.fit.backend.repository;

import iuh.fit.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepo extends JpaRepository<Booking, String> {
    boolean existsBookingsById(String id);
    @Query("SELECT b " +
            "FROM Booking b " +
            "WHERE b.bookingStatus = iuh.fit.backend.entity.BookingStatus.PENDING " +
            "AND b.createdAt < :expiredTime")
    List<Booking> findExpiredPendingBookings(@Param("expiredTime")LocalDateTime expiredTime);

    @Query("SELECT COUNT(b) " + 
            "FROM Booking b " +
            "WHERE b.customer.id = :customerId " + 
            "AND b.bookingStatus NOT IN (iuh.fit.backend.entity.BookingStatus.CANCELLED)")
    Integer countTotalBookingByCustomerId(@Param("customerId") String customerId);
}
