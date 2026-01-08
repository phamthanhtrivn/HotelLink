package iuh.fit.backend.controller.admin;

import iuh.fit.backend.dto.APIResponse;
import iuh.fit.backend.dto.RoomUpdateRequest;
import iuh.fit.backend.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/rooms")
public class Admin_RoomController {
    private final RoomService roomService;

    @GetMapping
    public ResponseEntity<APIResponse<?>> searchAdvance(
            @RequestParam(required = false) String roomNumber,
            @RequestParam(required = false) String floor,
            @RequestParam(required = false) String roomTypeName,
            @RequestParam(required = false) Boolean status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        APIResponse<?> response = roomService.searchAdvance(roomNumber, floor, roomTypeName, status, page, size);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PutMapping("/{roomId}")
    public ResponseEntity<APIResponse<?>> updateRoom(
            @PathVariable String roomId,
            @RequestBody @Valid RoomUpdateRequest request
    ) {
        APIResponse<?> response = roomService.updateRoom(roomId, request);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PatchMapping("/{roomId}/status")
    public ResponseEntity<APIResponse<?>> updateStatus(
            @PathVariable String roomId,
            @RequestParam Boolean status
    ) {
        APIResponse<?> response = roomService.updateStatus(roomId, status);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
