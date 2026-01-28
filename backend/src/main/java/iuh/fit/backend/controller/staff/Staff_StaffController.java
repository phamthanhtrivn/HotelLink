package iuh.fit.backend.controller.staff;

import iuh.fit.backend.dto.APIResponse;
import iuh.fit.backend.dto.CustomerUpdateRequest;
import iuh.fit.backend.dto.StaffUpdateRequest;
import iuh.fit.backend.service.StaffService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;

@RestController
@RequestMapping("/api/staff/staffs")
@RequiredArgsConstructor
public class Staff_StaffController {
    private final StaffService staffService;

    @GetMapping("/{staffId}")
    public ResponseEntity<APIResponse<?>> getStaffInfoById(@PathVariable String staffId) throws AccessDeniedException {
        APIResponse<?> response = staffService.getStaffInfoById(staffId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    
}
