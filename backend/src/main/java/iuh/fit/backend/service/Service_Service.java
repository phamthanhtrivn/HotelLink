package iuh.fit.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.nimbusds.oauth2.sdk.http.HTTPResponse;

import iuh.fit.backend.dto.APIResponse;
import iuh.fit.backend.entity.ServiceEntity;
import iuh.fit.backend.entity.ServiceType;
import iuh.fit.backend.repository.ServiceRepo;
import iuh.fit.backend.util.IdUtil;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Service
@RequiredArgsConstructor
public class Service_Service {
  private final ServiceRepo serviceRepo;
  private final IdUtil idUtil;

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

  public APIResponse<ServiceEntity> createService(ServiceEntity serviceEntity) {
    APIResponse<ServiceEntity> response = new APIResponse<>();

    serviceEntity.setId(idUtil.generateUniqueCodeForService());
  
    ServiceEntity savedService = serviceRepo.save(serviceEntity);
    response.setSuccess(true);
    response.setStatus(HTTPResponse.SC_OK);
    response.setMessage("Tạo dịch vụ thành công");
    response.setData(savedService);

    return response;
  }

  public APIResponse<ServiceEntity> updateService(String serviceId, ServiceEntity serviceEntity) {
    APIResponse<ServiceEntity> response = new APIResponse<>();

    serviceEntity.setId(serviceId);
  
    ServiceEntity savedService = serviceRepo.save(serviceEntity);
    response.setSuccess(true);
    response.setStatus(HTTPResponse.SC_OK);
    response.setMessage("Cập nhật dịch vụ thành công");
    response.setData(savedService);

    return response;
  }

  public APIResponse<List<ServiceEntity>> getAllServices() {
    APIResponse<List<ServiceEntity>> response = new APIResponse<>();

    List<ServiceEntity> services = serviceRepo.findAllByServiceTypeNotAndStatusTrue(ServiceType.TIME_BASED, true);
    response.setSuccess(true);
    response.setStatus(HTTPResponse.SC_OK);
    response.setMessage("Lấy danh sách dịch vụ thành công");
    response.setData(services);

    return response;
  }
}
