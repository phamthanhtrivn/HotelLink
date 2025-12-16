package iuh.fit.backend.repository;

import iuh.fit.backend.entity.BedDetail;
import iuh.fit.backend.entity.BedDetailId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BedDetailRepo extends JpaRepository<BedDetail, BedDetailId> {
}
