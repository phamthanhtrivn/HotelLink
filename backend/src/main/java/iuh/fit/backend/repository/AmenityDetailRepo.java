package iuh.fit.backend.repository;

import iuh.fit.backend.entity.AmenityDetail;
import iuh.fit.backend.entity.AmenityDetailId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AmenityDetailRepo extends JpaRepository<AmenityDetail, AmenityDetailId> {

    @Query("SELECT ad " +
            "FROM AmenityDetail ad " +
            "JOIN FETCH ad.amenity a " +
            "JOIN FETCH a.amenityType at " +
            "WHERE ad.roomType.id = :roomTypeId")
    List<AmenityDetail> findByRoomTypeId(String roomTypeId);
}
