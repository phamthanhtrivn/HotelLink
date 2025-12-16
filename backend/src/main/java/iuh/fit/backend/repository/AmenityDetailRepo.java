package iuh.fit.backend.repository;

import iuh.fit.backend.entity.AmenityDetail;
import iuh.fit.backend.entity.AmenityDetailId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AmenityDetailRepo extends JpaRepository<AmenityDetail, AmenityDetailId> {
}
