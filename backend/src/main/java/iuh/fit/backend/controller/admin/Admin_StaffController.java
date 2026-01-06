package iuh.fit.backend.controller.admin;

import iuh.fit.backend.dto.APIResponse;
import iuh.fit.backend.dto.StaffRequest;
import iuh.fit.backend.dto.StaffUpdateRequest;
import iuh.fit.backend.entity.Gender;
import iuh.fit.backend.service.StaffService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/staffs")
public class Admin_StaffController {
    private final StaffService staffService;

    @GetMapping
    public ResponseEntity<APIResponse<?>> searchAdvance(
            @RequestParam(required = false) String fullName,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) String identificationId,
            @RequestParam(required = false) Gender gender,
            @RequestParam(required = false) Boolean status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        System.out.println(page);
        APIResponse<?> response = staffService.searchAdvance(fullName, email, phone, identificationId, gender, status, page, size);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PostMapping
    public ResponseEntity<APIResponse<?>> createStaff(@RequestBody @Valid StaffRequest request) {
        System.out.println(request);
        APIResponse<?> response = staffService.createStaff(request);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PutMapping("/{staffId}")
    public ResponseEntity<APIResponse<?>> updateStaff(@PathVariable String staffId, @RequestBody @Valid StaffUpdateRequest request) {
        APIResponse<?> response = staffService.updateStaff(staffId, request);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PatchMapping("/{staffId}/status")
    public ResponseEntity<APIResponse<?>> updateStaffStatus(@PathVariable String staffId, @RequestParam Boolean status) {
        APIResponse<?> response = staffService.updateStaffStatus(staffId, status);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
