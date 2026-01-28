package iuh.fit.backend.service;

import com.nimbusds.oauth2.sdk.http.HTTPResponse;
import iuh.fit.backend.dto.APIResponse;
import iuh.fit.backend.dto.CustomerUpdateRequest;
import iuh.fit.backend.dto.StaffRequest;
import iuh.fit.backend.dto.StaffUpdateRequest;
import iuh.fit.backend.entity.*;
import iuh.fit.backend.repository.PersonRepo;
import iuh.fit.backend.repository.StaffRepo;
import iuh.fit.backend.repository.UserRepo;
import iuh.fit.backend.util.IdUtil;
import iuh.fit.backend.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StaffService {
    private final IdUtil idUtil;
    private final PasswordEncoder passwordEncoder;
    private final StaffRepo staffRepo;
    private final UserRepo userRepo;

    public APIResponse<Page<Staff>> searchAdvance(String fullName, String email, String phone, String identificationId, Gender gender, Boolean status, int page, int size) {
        Page<Staff> result = staffRepo.searchAdvance(fullName, email, phone, identificationId, gender, status, PageRequest.of(page, size));
        return new APIResponse<>(true, HTTPResponse.SC_OK, "Lấy danh sách nhân viên thành công", result);
    }

    public APIResponse<Staff> createStaff(StaffRequest request) {
        APIResponse<Staff> response = new APIResponse<>();

        Staff staff = null;

        staff = staffRepo.findByUser_Email(request.getEmail());
        if (staff != null) {
            response.setSuccess(false);
            response.setStatus(HTTPResponse.SC_BAD_REQUEST);
            response.setMessage("Email đã tồn tại");
            return response;
        }

        staff = staffRepo.findByPhone(request.getPhone());
        if (staff != null) {
            response.setSuccess(false);
            response.setStatus(HTTPResponse.SC_BAD_REQUEST);
            response.setMessage("Số điện thoại đã tồn tại");
            return response;
        }

        staff = staffRepo.findByIdentificationId(request.getIdentificationId());
        if (staff != null) {
            response.setSuccess(false);
            response.setStatus(HTTPResponse.SC_BAD_REQUEST);
            response.setMessage("Số CCCD đã tồn tại");
            return response;
        }

        User user = new User();
        user.setId(idUtil.generateUniqueCodeForUser());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.STAFF);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(null);
        user.setStatus(true);

        user = userRepo.save(user);

        staff = new Staff();
        staff.setUser(user);
        staff.setPhone(request.getPhone());
        staff.setFullName(request.getFullName());
        staff.setGender(request.getGender());
        staff.setDateOfBirth(request.getDateOfBirth());
        staff.setIdentificationId(request.getIdentificationId());

        Staff savedStaff = staffRepo.save(staff);

        response.setSuccess(true);
        response.setStatus(HTTPResponse.SC_OK);
        response.setMessage("Tạo nhân viên thành công");
        response.setData(savedStaff);

        return response;
    }

    public APIResponse<Staff> updateStaff(String staffId, StaffUpdateRequest request) {
        APIResponse<Staff> response = new APIResponse<>();

        Optional<Staff> staff = staffRepo.findById(staffId);
        if (staff.isEmpty()) {
            response.setSuccess(false);
            response.setStatus(HTTPResponse.SC_NOT_FOUND);
            response.setMessage("Không tìm thấy nhân viên");
            return response;
        }

        Staff existingStaff = staff.get();

        User existingUser = existingStaff.getUser();
        existingUser.setUpdatedAt(LocalDateTime.now());

        existingUser = userRepo.save(existingUser);

        existingStaff.setUser(existingUser);
        existingStaff.setFullName(request.getFullName());
        existingStaff.setPhone(request.getPhone());
        existingStaff.setGender(request.getGender());
        existingStaff.setDateOfBirth(request.getDateOfBirth());
        existingStaff.setIdentificationId(request.getIdentificationId());

        Staff savedStaff = staffRepo.save(existingStaff);

        response.setSuccess(true);
        response.setStatus(HTTPResponse.SC_OK);
        response.setMessage("Cập nhật nhân viên thành công");
        response.setData(savedStaff);

        return response;
    }

    public APIResponse<Staff> updateStaffStatus(String staffId, Boolean status) {
        APIResponse<Staff> response = new APIResponse<>();

        Optional<Staff> staff = staffRepo.findById(staffId);
        if (staff.isEmpty()) {
            response.setSuccess(false);
            response.setStatus(HTTPResponse.SC_NOT_FOUND);
            response.setMessage("Không tìm thấy nhân viên");
            return response;
        }

        Staff existingStaff = staff.get();
        existingStaff.getUser().setUpdatedAt(LocalDateTime.now());
        existingStaff.getUser().setStatus(status);

        Staff savedStaff = staffRepo.save(existingStaff);

        response.setSuccess(true);
        response.setStatus(HTTPResponse.SC_OK);
        response.setMessage("Cập nhật trạng thái nhân viên thành công");
        response.setData(savedStaff);

        return response;
    }

    public APIResponse<Person> getStaffInfoById(String userId) throws AccessDeniedException {
        APIResponse<Person> response = new APIResponse<>();
        response.setSuccess(false);
        response.setData(null);

        String currentId = SecurityUtil.getCurrentUserId();
        if (!currentId.equals(userId)) {
            response.setStatus(HTTPResponse.SC_FORBIDDEN);
            response.setMessage("Chưa đăng nhập");
            return response;
        }

        Optional<Staff> staffOpt = staffRepo.findById(userId);
        if (staffOpt.isEmpty()) {
            response.setStatus(HTTPResponse.SC_NOT_FOUND);
            response.setMessage("Không tìm thấy thông tin nhân viên");
            return response;
        }

        response.setSuccess(true);
        response.setStatus(HTTPResponse.SC_OK);
        response.setMessage("Lấy thông tin nhân viên thành công!");
        response.setData(staffOpt.get());

        return response;
    }

}
