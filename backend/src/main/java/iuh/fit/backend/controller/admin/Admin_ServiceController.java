package iuh.fit.backend.controller.admin;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import iuh.fit.backend.dto.APIResponse;
import iuh.fit.backend.entity.ServiceEntity;
import iuh.fit.backend.entity.ServiceType;
import iuh.fit.backend.service.Service_Service;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/services")
public class Admin_ServiceController {
  private final Service_Service service;

  @GetMapping
  public ResponseEntity<APIResponse<?>> searchSerices(
      @RequestParam(required = false) String name,
      @RequestParam(required = false) ServiceType type,
      @RequestParam(required = false) Boolean status,
      @RequestParam(required = false) Double minPrice,
      @RequestParam(required = false) Double maxPrice,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size
  ) {
      APIResponse<?> response = service.search(name, type, status, minPrice, maxPrice, PageRequest.of(page, size));
      return ResponseEntity.status(response.getStatus()).body(response);
  }

  @PostMapping
  public ResponseEntity<APIResponse<?>> createService(@RequestBody @Valid ServiceEntity serviceEntity) {
      APIResponse<?> response = service.createService(serviceEntity);
      return ResponseEntity.status(response.getStatus()).body(response);
  }
  
  @PutMapping("/{serviceId}")
  public ResponseEntity<APIResponse<?>> updateService(@PathVariable String serviceId, @RequestBody @Valid ServiceEntity serviceEntity) {
      APIResponse<?> response = service.updateService(serviceId, serviceEntity);
      return ResponseEntity.status(response.getStatus()).body(response);
  }

    @GetMapping("/active-services")
    public ResponseEntity<APIResponse<?>> getAllActiveServices() {
        APIResponse<?> response = service.getAllServices();
        return ResponseEntity.status(response.getStatus()).body(response);
    }
  
}
