package iuh.fit.backend.service;

import com.nimbusds.oauth2.sdk.http.HTTPResponse;
import iuh.fit.backend.dto.*;
import iuh.fit.backend.entity.*;
import iuh.fit.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomTypeService {
    private final RoomTypeRepo roomTypeRepo;
    private final BedDetailRepo bedDetailRepo;
    private final AmenityDetailRepo amenityDetailRepo;
    private final AmenityRepo amenityRepo;
    private final BedRepo bedRepo;
    private final CloudinaryService cloudinaryService;

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

    public APIResponse<List<RoomType>> findAllActiveRoomTypes() {
        List<RoomType> result = roomTypeRepo.findRoomTypeByStatusTrue(true);

        return new APIResponse<>(true, HTTPResponse.SC_OK, "Lấy danh sách loại phòng thành công", result);
    }

    public APIResponse<Page<RoomTypeAdminResponse>> searchAdvance(
            String name,
            Double minPrice,
            Double maxPrice,
            Integer minCapacity,
            Integer maxCapacity,
            Double minArea,
            Double maxArea,
            Boolean status,
            int page,
            int size
    ) {
        Page<RoomType> result = roomTypeRepo.searchAdvance(
                name,
                minPrice,
                maxPrice,
                minCapacity,
                maxCapacity,
                minArea,
                maxArea,
                status,
                PageRequest.of(page, size)
        );

        List<String> ids = result.getContent().stream().map(RoomType::getId).toList();

        List<BedDetail> bedDetails = bedDetailRepo.findByRoomTypeIds(ids);
        List<AmenityDetail> amenityDetails = amenityDetailRepo.findByRoomTypeIds(ids);

        Map<String, List<BedDetail>> bedMap =
                bedDetails.stream()
                        .collect(Collectors.groupingBy(
                                bd -> bd.getRoomType().getId()
                        ));

        Map<String, List<AmenityDetail>> amenityMap =
                amenityDetails.stream()
                        .collect(Collectors.groupingBy(
                                ad -> ad.getRoomType().getId()
                        ));

        Page<RoomTypeAdminResponse> dtoPage = result.map(rt ->
                new RoomTypeAdminResponse(
                        rt.getId(),
                        rt.getName(),
                        rt.getPrice(),
                        rt.getGuestCapacity(),
                        rt.getArea(),
                        rt.getPictures(),
                        rt.getDescription(),
                        rt.getCreatedAt(),
                        rt.getUpdatedAt(),
                        rt.isStatus(),

                        bedMap.getOrDefault(rt.getId(), List.of())
                                .stream()
                                .map(bd -> new BedResponse(
                                        bd.getBed().getId(),
                                        bd.getBed().getName(),
                                        bd.getBed().getDescription(),
                                        bd.getBedQuantity()
                                ))
                                .toList(),

                        amenityMap.getOrDefault(rt.getId(), List.of())
                                .stream()
                                .map(ad -> new AmenityResponse(
                                        ad.getAmenity().getId(),
                                        ad.getAmenity().getName(),
                                        ad.getAmenity().getAmenityType().getName()
                                ))
                                .toList()
                )
        );

        return new APIResponse<>(true, HTTPResponse.SC_OK, "Lấy danh sách loại phòng thành công", dtoPage);
    }

    public APIResponse<RoomType> updateStatus(String roomTypeId, Boolean status) {
        APIResponse<RoomType> response = new APIResponse<>();

        Optional<RoomType> roomTypeOpt = roomTypeRepo.findById(roomTypeId);
        if (roomTypeOpt.isEmpty()) {
            response.setSuccess(false);
            response.setStatus(HTTPResponse.SC_NOT_FOUND);
            response.setMessage("Loại phòng không tồn tại");
            response.setData(null);
            return response;
        }

        RoomType roomType = roomTypeOpt.get();
        roomType.setStatus(status);
        roomType.setUpdatedAt(LocalDateTime.now());

        RoomType savedRoomType = roomTypeRepo.save(roomType);

        response.setSuccess(true);
        response.setStatus(HTTPResponse.SC_OK);
        response.setMessage("Cập nhật trạng thái loại phòng thành công");
        response.setData(savedRoomType);

        return response;
    }

    @Transactional
    public APIResponse<RoomType> updateRoomTypeInfo(String roomTypeId, RoomTypeUpdateRequest request, List<MultipartFile> newImages) {
        APIResponse<RoomType> response = new APIResponse<>();
        response.setSuccess(false);
        response.setData(null);

        Optional<RoomType> roomTypeOpt = roomTypeRepo.findById(roomTypeId);
        if (roomTypeOpt.isEmpty()) {
            response.setStatus(HTTPResponse.SC_NOT_FOUND);
            response.setMessage("Loại phòng không tồn tại");
            return response;
        }

        RoomType roomType = roomTypeOpt.get();

        updateBasicInfo(roomType, request);
        updateImages(roomType, request, newImages);
        updateAmenities(roomType, request.getAmenities());
        updateBeds(roomType, request.getBeds());
        roomType.setUpdatedAt(LocalDateTime.now());

        RoomType savedRoomType = roomTypeRepo.save(roomType);
        response.setSuccess(true);
        response.setStatus(HTTPResponse.SC_OK);
        response.setMessage("Cập nhật thông tin loại phòng thành công");
        response.setData(savedRoomType);

        return response;
    }

    private void updateBasicInfo(
            RoomType roomType,
            RoomTypeUpdateRequest request
    ) {
        roomType.setPrice(request.getPrice());
        roomType.setDescription(request.getDescription());
        roomType.setStatus(request.getStatus());
    }


    private void updateImages(
            RoomType roomType,
            RoomTypeUpdateRequest request,
            List<MultipartFile> newImages
    ) {
        if (request.getDeleteImages() != null) {
            request.getDeleteImages().forEach(cloudinaryService::deleteByUrl);
        }

        List<String> uploadedUrls = new ArrayList<>();
        if (newImages != null) {
            for (MultipartFile file : newImages) {
                uploadedUrls.add(
                        cloudinaryService.uploadImage(file)
                );
            }
        }

        List<String> finalImages = new ArrayList<>();

        if (request.getKeepImages() != null)
            finalImages.addAll(request.getKeepImages());

        finalImages.addAll(uploadedUrls);

        roomType.setPictures(finalImages);
    }

    private void updateAmenities(
            RoomType roomType,
            List<AmenityRoomTypeUpdate> amenities
    ) {
        amenityDetailRepo.deleteByRoomType(roomType);

        if (amenities == null) return;

        for (AmenityRoomTypeUpdate dto : amenities) {
            Amenity amenity = amenityRepo.findById(dto.getAmenityId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy tiện nghi: " + dto.getAmenityId()));

            AmenityDetail detail = new AmenityDetail();
            detail.setAmenityDetailId(
                    new AmenityDetailId(roomType.getId(), amenity.getId())
            );
            detail.setRoomType(roomType);
            detail.setAmenity(amenity);

            amenityDetailRepo.save(detail);
        }
    }

    private void updateBeds(
            RoomType roomType,
            List<BedRoomTypeUpdate> beds
    ) {
        bedDetailRepo.deleteByRoomType(roomType);

        if (beds == null) return;

        for (BedRoomTypeUpdate dto : beds) {
            Bed bed = bedRepo.findById(dto.getBedId())
                    .orElseThrow(() -> new RuntimeException("Bed not found"));

            BedDetail detail = new BedDetail();
            detail.setBedDetailId(
                    new BedDetailId(roomType.getId(), bed.getId())
            );
            detail.setRoomType(roomType);
            detail.setBed(bed);
            detail.setBedQuantity(dto.getQuantity());

            bedDetailRepo.save(detail);
        }
    }


}
