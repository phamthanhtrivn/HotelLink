package iuh.fit.backend.controller.staff;

import iuh.fit.backend.dto.APIResponse;
import iuh.fit.backend.dto.RoomTypeAvailabilityForStaff;
import iuh.fit.backend.service.RoomTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/staff/room-types")
public class Staff_RoomTypeController {
    private final RoomTypeService roomTypeService;

    @GetMapping("/available-rooms")
    public APIResponse<Page<RoomTypeAvailabilityForStaff>> searchAvailableRoomsForStaff(
            @RequestParam int adults,
            @RequestParam int children,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime checkOut,
            @RequestParam(required = false) String roomTypeName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return roomTypeService.searchRoomTypesForStaff(
                adults,
                children,
                checkIn,
                checkOut,
                roomTypeName,
                PageRequest.of(page, size)
        );
    }
}
