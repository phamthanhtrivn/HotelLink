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

    List<RoomType> findRoomTypeByStatusTrue(boolean status);

    @Query("SELECT rt " +
            "FROM RoomType rt " +
            "WHERE (:name IS NULL OR LOWER(rt.name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
            "AND (:minPrice IS NULL OR rt.price >= :minPrice) " +
            "AND (:maxPrice IS NULL OR rt.price <= :maxPrice) " +
            "AND (:minCapacity IS NULL OR rt.guestCapacity >= :minCapacity) "+
            "AND (:maxCapacity IS NULL OR rt.guestCapacity <= :maxCapacity) "+
            "AND (:minArea IS NULL OR rt.area >= :minArea) " +
            "AND (:maxArea IS NULL OR rt.area <= :maxArea) " +
            "AND (:status IS NULL OR rt.status = :status)"
    )
    Page<RoomType> searchAdvance(
            @Param("name") String name,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("minCapacity") Integer minCapacity,
            @Param("maxCapacity") Integer maxCapacity,
            @Param("minArea") Double minArea,
            @Param("maxArea") Double maxArea,
            @Param("status") Boolean status,
            Pageable pageable
    );

    // Lấy tổng số phòng theo từng loại phòng
    @Query("SELECT r.roomType.id, COUNT(r) FROM Room r GROUP BY r.roomType.id")
    List<Object[]> countTotalByRoomType();

}
