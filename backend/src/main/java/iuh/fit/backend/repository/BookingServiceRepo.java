package iuh.fit.backend.repository;

import iuh.fit.backend.entity.BookingServiceEntity;
import iuh.fit.backend.entity.BookingServiceId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingServiceRepo extends JpaRepository<BookingServiceEntity, BookingServiceId> {
    boolean existsByBooking_IdAndService_Id(String bookingId, String serviceId);

    void deleteByBooking_Id(String bookingId);
}
