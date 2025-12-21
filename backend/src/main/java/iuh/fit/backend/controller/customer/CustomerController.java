package iuh.fit.backend.controller.customer;

import iuh.fit.backend.dto.APIResponse;
import iuh.fit.backend.dto.CustomerResponse;
import iuh.fit.backend.dto.CustomerUpdateRequest;
import iuh.fit.backend.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@PreAuthorize("hasRole('MEMBER')")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member/customer")
public class CustomerController {
    private final CustomerService customerService;

    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<?>> getCustomerInfo(@PathVariable String id) {
        APIResponse<CustomerResponse> apiResponse = customerService.getCustomerInfoById(id);
        return ResponseEntity.status(apiResponse.getStatus()).body(apiResponse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<APIResponse<?>> updateCustomerInfo(@PathVariable String id, @RequestBody @Valid CustomerUpdateRequest customerRequest) {
        APIResponse<CustomerResponse> apiResponse = customerService.updateCustomerInfoById(id, customerRequest);
        return ResponseEntity.status(apiResponse.getStatus()).body(apiResponse);
    }
}
