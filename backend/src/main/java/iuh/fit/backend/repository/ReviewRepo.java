package iuh.fit.backend.repository;

import iuh.fit.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

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
    List<Review> findTop3ByLoaiPhongOrderByRatingDesc();

}
