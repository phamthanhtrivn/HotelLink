package iuh.fit.backend.repository;

import iuh.fit.backend.dto.RoomTypeAvailabilityDTO;
import iuh.fit.backend.entity.RoomType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RoomTypeRepo extends JpaRepository<RoomType, String> {
    @Query("""
    SELECT new iuh.fit.backend.dto.RoomTypeAvailabilityDTO(
        rt.id,
        rt.name,
        rt.price,
        rt.guestCapacity,
        rt.area,
        NULL,
        rt.description,
        COUNT(r.id)
    )
    FROM RoomType rt
    JOIN Room r ON r.roomType = rt
    WHERE rt.guestCapacity >= :guestCount
      AND rt.status = true
      AND r.status = true
      AND r.roomStatus = iuh.fit.backend.entity.RoomStatus.AVAILABLE
      AND (:roomTypeName IS NULL OR rt.name LIKE CONCAT('%', :roomTypeName, '%'))
      AND r.id NOT IN (
          SELECT b.room.id
          FROM Booking b
          WHERE b.bookingStatus NOT IN (iuh.fit.backend.entity.BookingStatus.CANCELLED, iuh.fit.backend.entity.BookingStatus.NO_SHOW)
            AND b.checkIn < :checkOut
            AND b.checkOut > :checkIn
                )
    GROUP BY rt.id, rt.name, rt.price, rt.guestCapacity, rt.area, rt.description
    HAVING COUNT(r.id) > 0
    """)
    Page<RoomTypeAvailabilityDTO> searchAvailableRoomTypes(
            @Param("guestCount") int guestCount,
            @Param("checkIn") LocalDateTime checkIn,
            @Param("checkOut") LocalDateTime checkOut,
            @Param("roomTypeName") String roomTypeName,
            Pageable pageable
    );

    @Query("""
    SELECT rt.id, p
    FROM RoomType rt
    JOIN rt.pictures p
    WHERE rt.id IN :ids
    """)
    List<Object[]> findPicturesByRoomTypeIds(@Param("ids") List<String> ids);
}
