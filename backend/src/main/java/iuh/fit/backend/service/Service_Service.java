package iuh.fit.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.nimbusds.oauth2.sdk.http.HTTPResponse;

import iuh.fit.backend.dto.APIResponse;
import iuh.fit.backend.entity.ServiceEntity;
import iuh.fit.backend.entity.ServiceType;
import iuh.fit.backend.repository.ServiceRepo;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class Service_Service {
  private final ServiceRepo serviceRepo;

  public APIResponse<Page<ServiceEntity>> search(String name, ServiceType type, Boolean status, Double minPrice, Double maxPrice, Pageable pageable) {
    APIResponse<Page<ServiceEntity>> response = new APIResponse<>();

    Page<ServiceEntity> services = serviceRepo.search(name, type, status, minPrice, maxPrice, pageable);
      response.setSuccess(true);
      response.setStatus(HTTPResponse.SC_OK);
      response.setData(services);
      
    if (services.isEmpty()) {
      response.setMessage("Không có dịch vụ nào");
      return response;
    }
    else {
      response.setMessage("Lấy danh sách dịch vụ thành công");
      return response;
    }

  } 
}
