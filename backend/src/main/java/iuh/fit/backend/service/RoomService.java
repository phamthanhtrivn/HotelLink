package iuh.fit.backend.service;

import iuh.fit.backend.dto.APIResponse;
import iuh.fit.backend.entity.Room;
import iuh.fit.backend.repository.RoomRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {
    private final RoomRepo roomRepo;

    public List<Room> getAvailableRoomByRoomType(String roomTypeId, LocalDateTime checkIn, LocalDateTime checkOut) {
        return roomRepo.findAvailableRooms(roomTypeId, checkIn, checkOut);
    }

}
