package iuh.fit.backend.repository;

import iuh.fit.backend.entity.Room;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @Query("SELECT r " +
            "FROM Room r " +
            "WHERE (:roomNumber IS NULL OR r.roomNumber = :roomNumber) " +
            "AND (:floor IS NULL OR r.floor = :floor) " +
            "AND (:roomTypeName IS NULL OR LOWER(r.roomType.name) LIKE LOWER(CONCAT('%', :roomTypeName, '%'))) " +
            "AND (:status IS NULL OR r.status = :status)")
    Page<Room> searchAdvance(
            @Param("roomNumber") String roomNumber,
            @Param("floor") String floor,
            @Param("roomTypeName") String roomTypeName,
            @Param("status") Boolean status,
            Pageable pageable
    );

    Room findByRoomNumber(String roomNumber);

    @Query("SELECT COUNT(r) > 0 " +
            "FROM Room r " +
            "WHERE r.id = :roomId " +
            "AND r.status = true " +
            "AND r.id NOT IN ( " +
            "   SELECT b.room.id   " +
            "   FROM Booking b " +
            "   WHERE b.bookingStatus NOT IN (iuh.fit.backend.entity.BookingStatus.CANCELLED, iuh.fit.backend.entity.BookingStatus.NO_SHOW) " +
            "            AND b.checkIn < :checkOut " +
            "            AND b.checkOut > :checkIn " +
            ")")
    boolean isRoomAvailable(
            String roomId,
            LocalDateTime checkIn,
            LocalDateTime checkOut
    );
}
