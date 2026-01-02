package iuh.fit.backend.controller.admin;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import iuh.fit.backend.dto.APIResponse;
import iuh.fit.backend.service.CustomerService;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/customers")
public class Admin_CustomerController {
  private final CustomerService customerService;

  @GetMapping
  public ResponseEntity<APIResponse<?>> searchAdvance(
    @RequestParam(required = false) String fullName,
    @RequestParam(required = false) String email,
    @RequestParam(required = false) String phone,
    @RequestParam(required = false) Double minPoint,
    @RequestParam(required = false) Double maxPoint,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size
  ) {
      APIResponse<?> response = customerService.searchAdvance(email, fullName, phone, minPoint, maxPoint, PageRequest.of(page, size));
      return ResponseEntity.status(response.getStatus()).body(response);
  }

  @PatchMapping("/{id}/status")
  public ResponseEntity<APIResponse<?>> updateReviewStatus(
      @PathVariable String id,
      @RequestParam Boolean status) {
    APIResponse<?> response = customerService.updateStatus(id, status);
    return ResponseEntity.status(response.getStatus()).body(response);
  }
  
}
