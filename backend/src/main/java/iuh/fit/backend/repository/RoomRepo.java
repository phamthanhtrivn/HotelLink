package iuh.fit.backend.repository;

import iuh.fit.backend.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RoomRepo extends JpaRepository<Room, String> {
    @Query("SELECT r " +
            "FROM Room r " +
            "WHERE r.roomType.id = :roomTypeId " +
            "AND r.status = true " +
            "AND r.id NOT IN ( " +
            "   SELECT b.room.id   " +
            "   FROM Booking b " +
            "   WHERE b.bookingStatus NOT IN (iuh.fit.backend.entity.BookingStatus.CANCELLED, iuh.fit.backend.entity.BookingStatus.NO_SHOW)\n" +
            "            AND b.checkIn < :checkOut " +
            "            AND b.checkOut > :checkIn " +
            ")")
    List<Room> findAvailableRooms(@Param("roomTypeId") String roomTypeId, LocalDateTime checkIn, LocalDateTime checkOut);
}
