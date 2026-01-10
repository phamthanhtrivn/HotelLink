package iuh.fit.backend.service;

import com.nimbusds.oauth2.sdk.http.HTTPResponse;
import iuh.fit.backend.dto.APIResponse;
import iuh.fit.backend.entity.Bed;
import iuh.fit.backend.repository.BedRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BedService {
    private final BedRepo bedRepo;

    public APIResponse<List<Bed>> getAllBeds() {
        return new APIResponse<>(true, HTTPResponse.SC_OK, "Lấy danh sách giường thành công", bedRepo.findAll());
    }
}
