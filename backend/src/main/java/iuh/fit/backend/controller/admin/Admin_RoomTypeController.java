package iuh.fit.backend.controller.admin;

import iuh.fit.backend.dto.APIResponse;
import iuh.fit.backend.service.RoomTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/room-types")
public class Admin_RoomTypeController {
    private final RoomTypeService roomTypeService;

    @GetMapping("/active")
    public ResponseEntity<APIResponse<?>> getActiveRoomTypes() {
        APIResponse<?> response = roomTypeService.findAllActiveRoomTypes();
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping
    public ResponseEntity<APIResponse<?>> searchAdvance(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) Integer maxCapacity,
            @RequestParam(required = false) Double minArea,
            @RequestParam(required = false) Double maxArea,
            @RequestParam(required = false) Boolean status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        APIResponse<?> response = roomTypeService.searchAdvance(name, minPrice, maxPrice, minCapacity, maxCapacity, minArea, maxArea, status, page, size);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PatchMapping("/{roomTypeId}/status")
    public ResponseEntity<APIResponse<?>> updateRoomTypeStatus(@PathVariable String roomTypeId, @RequestParam Boolean status) {
        APIResponse<?> response = roomTypeService.updateStatus(roomTypeId, status);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
