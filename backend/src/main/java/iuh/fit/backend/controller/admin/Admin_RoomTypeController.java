package iuh.fit.backend.controller.admin;

import iuh.fit.backend.dto.APIResponse;
import iuh.fit.backend.service.RoomTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
