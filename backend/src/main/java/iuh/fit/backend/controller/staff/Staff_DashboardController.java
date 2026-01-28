package iuh.fit.backend.controller.staff;

import iuh.fit.backend.dto.DashboardDataDTO;
import iuh.fit.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/staff/dashboard")
@RequiredArgsConstructor
public class Staff_DashboardController {
    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardDataDTO> getDashboardStatistics() {
        DashboardDataDTO data = dashboardService.getDashboardData();
        return ResponseEntity.ok(data);
    }

}
