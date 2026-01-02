package iuh.fit.backend.service;

import com.nimbusds.oauth2.sdk.http.HTTPResponse;
import iuh.fit.backend.dto.*;
import iuh.fit.backend.entity.RoomType;
import iuh.fit.backend.repository.AmenityDetailRepo;
import iuh.fit.backend.repository.BedDetailRepo;
import iuh.fit.backend.repository.RoomTypeRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
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
    private final BedDetailRepo bedDetailRepo;
    private final AmenityDetailRepo amenityDetailRepo;

    public Page<RoomTypeAvailabilityDTO> searchRoomTypes(
            int adults,
            int children,
            LocalDateTime checkIn,
            LocalDateTime checkOut,
            String roomTypeName,
            Pageable pageable
    ) {
        int convertedChildren = (int) Math.round(children / 3.0);
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

    public APIResponse<RoomTypeDetailResponse> getRoomTypeDetail(String id) {
        RoomType roomType = roomTypeRepo.findById(id).orElse(null);
        if (roomType == null) {
            return new APIResponse<>(false, HTTPResponse.SC_NOT_FOUND, "Không tìm thấy loại phòng", null);
        }

        List<BedResponse> beds = bedDetailRepo.findByRoomTypeId(id)
                .stream()
                .map(bd -> new BedResponse(
                        bd.getBed().getId(),
                        bd.getBed().getName(),
                        bd.getBed().getDescription(),
                        bd.getBedQuantity()
                ))
                .toList();

        List<AmenityResponse> amenities = amenityDetailRepo.findByRoomTypeId(id)
                .stream()
                .map(ad -> new AmenityResponse(
                        ad.getAmenity().getId(),
                        ad.getAmenity().getName(),
                        ad.getAmenity().getIcon(),
                        ad.getAmenity().getAmenityType().getName()
                ))
                .toList();

        RoomTypeDetailResponse r = new RoomTypeDetailResponse();
        r.setId(roomType.getId());
        r.setName(roomType.getName());
        r.setPrice(roomType.getPrice());
        r.setGuestCapacity(roomType.getGuestCapacity());
        r.setArea(roomType.getArea());
        r.setDescription(roomType.getDescription());
        r.setPictures(roomType.getPictures());
        r.setBeds(beds);
        r.setAmenities(amenities);

        return new APIResponse<>(true, HTTPResponse.SC_OK, "Lấy chi tiết loại phòng thành công", r);
    }
}
