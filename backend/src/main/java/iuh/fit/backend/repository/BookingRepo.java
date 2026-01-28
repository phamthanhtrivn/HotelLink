package iuh.fit.backend.repository;

import iuh.fit.backend.entity.Booking;
import iuh.fit.backend.entity.BookingSource;
import iuh.fit.backend.entity.BookingStatus;
import iuh.fit.backend.entity.Customer;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
            "WHERE b.customer.userId = :customerId " +
            "AND b.bookingStatus NOT IN (iuh.fit.backend.entity.BookingStatus.CANCELLED)")
    Integer countTotalBookingByCustomerId(@Param("customerId") String customerId);

    Page<Booking> findByCustomer(Customer customer, Pageable pageable);

    Page<Booking> findByCustomerAndBookingStatus(Customer customer, BookingStatus bookingStatus, Pageable pageable);

    @Query("""
        SELECT b FROM Booking b
        WHERE
            (:keyword IS NULL OR
                LOWER(b.id) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                LOWER(b.contactName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                b.contactPhone LIKE CONCAT('%', :keyword, '%') OR
                LOWER(b.contactEmail) LIKE LOWER(CONCAT('%', :keyword, '%'))
            )
        AND (:status IS NULL OR b.bookingStatus = :status)
        AND (:source IS NULL OR b.bookingSource = :source)
        AND (:roomNumber IS NULL OR b.room.roomNumber = :roomNumber)
        AND (:paid IS NULL OR b.paid = :paid)
        AND (:checkInFrom IS NULL OR b.checkIn >= :checkInFrom)
        AND (:checkInTo IS NULL OR b.checkIn <= :checkInTo)
        AND (:checkOutFrom IS NULL OR b.checkOut >= :checkOutFrom)
        AND (:checkOutTo IS NULL OR b.checkOut <= :checkOutTo)
    """)
    Page<Booking> searchAdvance(
            @Param("keyword") String keyword,
            @Param("status") BookingStatus status,
            @Param("source") BookingSource source,
            @Param("roomNumber") String roomNumber,
            @Param("paid") Boolean paid,
            @Param("checkInFrom") LocalDateTime checkInFrom,
            @Param("checkInTo") LocalDateTime checkInTo,
            @Param("checkOutFrom") LocalDateTime checkOutFrom,
            @Param("checkOutTo") LocalDateTime checkOutTo,
            Pageable pageable
    );

    //    Thống kê Overview
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.checkIn >= :startOfDay AND b.checkIn < :endOfDay and b.bookingStatus <> 'CANCELLED' and b.bookingStatus <> 'NO_SHOW'")
    long countCheckInToday(@Param("startOfDay") LocalDateTime start,  @Param("endOfDay") LocalDateTime end);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.checkOut >= :startOfDay AND b.checkOut < :endOfDay AND b.bookingStatus <> 'CANCELLED' and b.bookingStatus <> 'NO_SHOW'")
    long countCheckOutToday(@Param("startOfDay") LocalDateTime start, @Param("endOfDay") LocalDateTime end);

    //    Đang ở
    @Query("SELECT count(b) from Booking b where b.checkIn <= :now and b.checkOut >= :now and b.bookingStatus = 'CONFIRMED'")
    long countTotalInHotel(@Param("now") LocalDateTime now);

    //    Thống kê từng loại phòng:  đếm số phòng đang có khách của loại đó
    @Query("""
        select r.roomType.id, count(b) 
        from Booking b join b.room r 
        where b.checkIn <= :now and b.checkOut >= :now and b.bookingStatus <> 'CANCELLED' and b.bookingStatus <> 'NO_SHOW' 
        GROUP BY r.roomType.id 
        """)
    List<Object[]> countOccupiedByRoomType(@Param("now") LocalDateTime now);

    // Thống kê Doanh thu theo tháng trong năm (Dựa vào check_out hoặc ngay_tao)
    @Query("SELECT MONTH(b.checkOut) as thang, SUM(b.totalPayment) as doanhThu " +
            "FROM Booking b " +
            "WHERE YEAR(b.checkOut) = :year AND b.bookingStatus = 'COMPLETED' " +
            "GROUP BY MONTH(b.checkOut) " +
            "ORDER BY MONTH(b.checkOut) ASC")
    List<Object[]> getMonthlyRevenueByYear(@Param("year") int year);

    // Đếm số deal (đơn có giảm giá) theo loại phòng
    @Query("SELECT r.roomType.id, COUNT(b) FROM Booking b JOIN b.room r " +
            "WHERE b.pointDiscount > 0 GROUP BY r.roomType.id")
    List<Object[]> countDealsByRoomType();

    // Tìm tất cả đơn đặt phòng có khoảng thời gian giao thoa với [startDate, endDate]
    // Logic: CheckIn < EndDate VÀ CheckOut > StartDate (và phải Đã thanh toán)
    @Query("SELECT b FROM Booking b WHERE b.checkIn < :endDate AND b.checkOut > :startDate AND b.bookingStatus <> 'CANCELLED' AND b.bookingStatus <> 'NO_SHOW'")
    List<Booking> findBookingsInDateRange(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

}
