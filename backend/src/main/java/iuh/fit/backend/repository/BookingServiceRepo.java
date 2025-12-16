package iuh.fit.backend.repository;

import iuh.fit.backend.entity.BookingService;
import iuh.fit.backend.entity.BookingServiceId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingServiceRepo extends JpaRepository<BookingService, BookingServiceId> {
}
