package iuh.fit.backend.controller.admin;

import iuh.fit.backend.dto.APIResponse;
import iuh.fit.backend.service.BedService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/beds")
public class Admin_BedController {
    private final BedService bedService;

    @GetMapping
    public ResponseEntity<APIResponse<?>> getAllBeds() {
        APIResponse<?> response = bedService.getAllBeds();
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
