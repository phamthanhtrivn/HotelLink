package iuh.fit.backend.controller;

import iuh.fit.backend.dto.RoomTypeAvailabilityDTO;
import iuh.fit.backend.service.RoomTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/public/room-types")
public class RoomTypeController {
    private final RoomTypeService roomTypeService;

    @GetMapping("/search")
    public ResponseEntity<Page<RoomTypeAvailabilityDTO>> searchRoomTypes(
            @RequestParam int adults,
            @RequestParam int children,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime checkOut,
            @RequestParam(required = false) String roomType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(
                roomTypeService.searchRoomTypes(
                        adults,
                        children,
                        checkIn,
                        checkOut,
                        roomType,
                        pageable
                )
        );
    }
}
