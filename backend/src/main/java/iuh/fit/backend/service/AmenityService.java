package iuh.fit.backend.service;

import com.nimbusds.oauth2.sdk.http.HTTPResponse;
import iuh.fit.backend.dto.APIResponse;
import iuh.fit.backend.entity.Amenity;
import iuh.fit.backend.repository.AmenityRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AmenityService {
    private final AmenityRepo amenityRepo;

    public APIResponse<List<Amenity>> getAllAmenities() {
        return new APIResponse<>(true, HTTPResponse.SC_OK, "Lấy danh sách tiện ích thành công", amenityRepo.findAll());
    }
}
