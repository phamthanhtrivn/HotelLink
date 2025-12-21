package iuh.fit.backend.service;

import com.nimbusds.oauth2.sdk.http.HTTPResponse;
import iuh.fit.backend.dto.APIResponse;
import iuh.fit.backend.dto.CustomerResponse;
import iuh.fit.backend.dto.CustomerUpdateRequest;
import iuh.fit.backend.entity.Customer;
import iuh.fit.backend.entity.User;
import iuh.fit.backend.repository.CustomerRepo;
import iuh.fit.backend.repository.UserRepo;
import iuh.fit.backend.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomerService {
    private final UserRepo userRepo;
    private final CustomerRepo customerRepo;

    public APIResponse<CustomerResponse> getCustomerInfoById(String id) {
        APIResponse<CustomerResponse> response = new APIResponse<>();
        response.setSuccess(false);

        String currentUserId;
        try {
            currentUserId = SecurityUtil.getCurrentUserId();
        } catch (AccessDeniedException e) {
            response.setMessage("Chưa đăng nhập");
            response.setStatus(HTTPResponse.SC_UNAUTHORIZED);
            return response;
        }

        if (!currentUserId.equals(id)) {
            response.setMessage("Từ chối truy cập");
            response.setStatus(HTTPResponse.SC_FORBIDDEN);
            return response;
        }

        Optional<User> userOpt = userRepo.findById(id);
        if (userOpt.isEmpty()) {
            response.setMessage("Không tìm thấy người dùng");
            response.setStatus(HTTPResponse.SC_NOT_FOUND);
            return response;
        }
        User user = userOpt.get();

        Optional<Customer> customerOpt = customerRepo.findById(id);
        if (customerOpt.isEmpty()) {
            response.setMessage("Không tìm thấy khách hàng");
            response.setStatus(HTTPResponse.SC_NOT_FOUND);
            return response;
        }
        Customer customer = customerOpt.get();

        CustomerResponse cusResponse = new CustomerResponse();
        cusResponse.setUserId(user.getId());
        cusResponse.setFullName(customer.getFullName());
        cusResponse.setEmail(user.getEmail());
        cusResponse.setPhone(customer.getPhone());
        cusResponse.setRole(user.getRole().name());
        cusResponse.setPoints(customer.getPoints());

        response.setSuccess(true);
        response.setStatus(HTTPResponse.SC_OK);
        response.setMessage("Lấy thông tin khách hàng thành công");
        response.setData(cusResponse);

        return response;
    }

    @Transactional
    public APIResponse<CustomerResponse> updateCustomerInfoById(String id, CustomerUpdateRequest customerRequest) {
        APIResponse<CustomerResponse> response = new APIResponse<>();
        response.setSuccess(false);

        String currentUserId;
        try {
            currentUserId = SecurityUtil.getCurrentUserId();
        } catch (AccessDeniedException e) {
            response.setMessage("Chưa đăng nhập");
            response.setStatus(HTTPResponse.SC_UNAUTHORIZED);
            return response;
        }

        if (!currentUserId.equals(id)) {
            response.setMessage("Từ chối truy cập");
            response.setStatus(HTTPResponse.SC_FORBIDDEN);
            return response;
        }

        Optional<User> userOpt = userRepo.findById(id);
        if (userOpt.isEmpty()) {
            response.setMessage("Không tìm thấy người dùng");
            response.setStatus(HTTPResponse.SC_NOT_FOUND);
            return response;
        }
        User user = userOpt.get();

        user.setUpdatedAt(LocalDateTime.now());
        userRepo.save(user);

        Optional<Customer> customerOpt = customerRepo.findById(id);
        if (customerOpt.isEmpty()) {
            response.setMessage("Không tìm thấy khách hàng");
            response.setStatus(HTTPResponse.SC_NOT_FOUND);
            return response;
        }
        Customer customer = customerOpt.get();

        customer.setFullName(customerRequest.getFullName());
        customer.setPhone(customerRequest.getPhone());
        customerRepo.save(customer);

        CustomerResponse cusResponse = new CustomerResponse();
        cusResponse.setUserId(user.getId());
        cusResponse.setFullName(customer.getFullName());
        cusResponse.setPhone(customer.getPhone());
        cusResponse.setEmail(user.getEmail());
        cusResponse.setRole(user.getRole().name());
        cusResponse.setPoints(customer.getPoints());

        response.setSuccess(true);
        response.setStatus(HTTPResponse.SC_OK);
        response.setMessage("Cập nhật thông tin khách hàng thành công");
        response.setData(cusResponse);

        return response;
    }
}
