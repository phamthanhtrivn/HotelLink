package iuh.fit.backend.repository;

import iuh.fit.backend.dto.FeedbackDTO;
import iuh.fit.backend.entity.Booking;
import iuh.fit.backend.entity.Review;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReviewRepo extends JpaRepository<Review, String> {
    @Query("""
            SELECT r
            FROM Review r
            WHERE r.status = true
            ORDER BY
                (r.cleanlinessScore + r.serviceScore + r.facilitiesScore) DESC,
                r.createdAt DESC
            LIMIT 3
            """)
    List<Review> findTop3ByRoomTypeOrderByRatingDesc();

    @Query("SELECT r " +
            "FROM Review r " +
            "JOIN FETCH r.booking b " +
            "JOIN FETCH b.room ro " +
            "JOIN FETCH ro.roomType rt " +
            "WHERE rt.id = :roomTypeId " +
            "AND r.status = true " +
            "ORDER BY r.createdAt DESC")
    List<Review> findReviewsByRoomTypeOrderByCreatedAtDesc(String roomTypeId);

    boolean existsReviewsById(String id);

    Review findByBooking(Booking booking);

    @Query("SELECT r " +
            "FROM Review r " +
            "JOIN r.customer c " +
            "JOIN r.booking b " +
            "WHERE (:status IS NULL OR r.status = :status) " +
            "AND (:customerName IS NULL OR LOWER(c.fullName) LIKE LOWER(CONCAT('%', :customerName, '%'))) " +
            "AND (:bookingId IS NULL OR b.id = :bookingId) " +
            "AND (:keyword IS NULL OR LOWER(r.comments) LIKE LOWER(CONCAT('%', :keyword, '%')))" +
            "AND (:fromDate IS NULL OR r.createdAt >= :fromDate) " +
            "AND (:toDate IS NULL OR r.createdAt <= :toDate) " +
            "AND (:minScore IS NULL OR (r.cleanlinessScore + r.serviceScore + r.facilitiesScore) / 3.0 >= :minScore) " +
            "AND (:maxScore IS NULL OR (r.cleanlinessScore + r.serviceScore + r.facilitiesScore) / 3.0 <= :maxScore)")
    Page<Review> searchAdvance(
            @Param("status") Boolean status,
            @Param("customerName") String customerName,
            @Param("bookingId") String bookingId,
            @Param("keyword") String keyword,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            @Param("minScore") Double minScore,
            @Param("maxScore") Double maxScore,
            Pageable pageable);

    @Query("SELECT new iuh.fit.backend.dto.FeedbackDTO(" +
            "r.id, r.cleanlinessScore, r.serviceScore, r.facilitiesScore, " +
            "r.comments, r.booking.room.roomType.name, r.createdAt) " +
            "FROM Review r WHERE r.status = true ORDER BY r.createdAt DESC")
    List<FeedbackDTO> findRecentFeedbacks(Pageable pageable);

}
