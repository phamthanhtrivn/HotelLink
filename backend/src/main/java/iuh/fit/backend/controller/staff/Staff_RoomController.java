package iuh.fit.backend.controller.staff;

import iuh.fit.backend.dto.APIResponse;
import iuh.fit.backend.entity.RoomStatus;
import iuh.fit.backend.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/staff/rooms")
public class Staff_RoomController {
    private final RoomService roomService;

    @PatchMapping("/{roomId}/room-status")
    public ResponseEntity<APIResponse<?>> updateRoomStatus(@PathVariable String roomId,@RequestParam RoomStatus roomStatus) {
        APIResponse<?> response = roomService.updateRoomStatus(roomId, roomStatus);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
