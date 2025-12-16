package iuh.fit.backend.repository;

import iuh.fit.backend.entity.AmenityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AmenityTypeRepo extends JpaRepository<AmenityType, String> {
}
