package iuh.fit.backend.repository;

import iuh.fit.backend.entity.BedDetail;
import iuh.fit.backend.entity.BedDetailId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BedDetailRepo extends JpaRepository<BedDetail, BedDetailId> {
    @Query("SELECT bd " +
            "FROM BedDetail bd " +
            "JOIN FETCH bd.bed " +
            "WHERE bd.roomType.id = :roomTypeId")
    List<BedDetail> findByRoomTypeId(String roomTypeId);
}
