package iuh.fit.backend.repository;

import iuh.fit.backend.entity.Bed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BedRepo extends JpaRepository<Bed, String> {
}
