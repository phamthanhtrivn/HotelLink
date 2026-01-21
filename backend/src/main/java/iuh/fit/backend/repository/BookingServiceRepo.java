package iuh.fit.backend.repository;

import iuh.fit.backend.entity.BookingServiceEntity;
import iuh.fit.backend.entity.BookingServiceId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingServiceRepo extends JpaRepository<BookingServiceEntity, BookingServiceId> {
    void deleteByBooking_Id(String bookingId);
    List<BookingServiceEntity> findByBooking_Id(String bookingId);
}
