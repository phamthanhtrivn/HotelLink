package iuh.fit.backend.controller.admin;

import iuh.fit.backend.dto.APIResponse;
import iuh.fit.backend.service.AmenityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/amenities")
public class Admin_AmenityController {
    private final AmenityService amenityService;

    @GetMapping
    public ResponseEntity<APIResponse<?>> getAllAmenities() {
        APIResponse<?> response = amenityService.getAllAmenities();
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
