package iuh.fit.backend.service;

import iuh.fit.backend.dto.RoomTypeAvailabilityDTO;
import iuh.fit.backend.repository.RoomTypeRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RoomTypeService {
    private final RoomTypeRepo roomTypeRepo;

    public Page<RoomTypeAvailabilityDTO> searchRoomTypes(
            int adults,
            int children,
            LocalDateTime checkIn,
            LocalDateTime checkOut,
            String roomTypeName,
            Pageable pageable
    ) {
        int convertedChildren = (int) Math.ceil(children / 3.0);
        int effectiveGuestCount = adults + convertedChildren;

        Page<RoomTypeAvailabilityDTO> page = roomTypeRepo.searchAvailableRoomTypes(
                effectiveGuestCount,
                checkIn,
                checkOut,
                roomTypeName,
                pageable
        );

        List<String> roomTypeIds = page.getContent()
                .stream()
                .map(RoomTypeAvailabilityDTO::getId)
                .toList();

        List<Object[]> rows = roomTypeRepo.findPicturesByRoomTypeIds(roomTypeIds);

        Map<String, List<String>> pictureMap = new HashMap<>();
        for (Object[] row : rows) {
            String roomTypeId = (String) row[0];
            String picture = (String) row[1];
            pictureMap
                    .computeIfAbsent(roomTypeId, k -> new ArrayList<>())
                    .add(picture);
        }

        page.getContent().forEach(dto ->
                dto.setPictures(
                        pictureMap.getOrDefault(dto.getId(), List.of())
                )
        );

        return page;
    }
}
