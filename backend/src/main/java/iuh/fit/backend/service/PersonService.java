package iuh.fit.backend.service;

import java.nio.file.AccessDeniedException;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.nimbusds.oauth2.sdk.http.HTTPResponse;

import iuh.fit.backend.dto.APIResponse;
import iuh.fit.backend.dto.CustomerUpdateRequest;
import iuh.fit.backend.entity.Person;
import iuh.fit.backend.repository.PersonRepo;
import iuh.fit.backend.util.SecurityUtil;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PersonService {
  private final PersonRepo personRepo;

  public APIResponse<Person> getPersonInfoById(String userId) throws AccessDeniedException {
    APIResponse<Person> response = new APIResponse<>();
    response.setSuccess(false);
    response.setData(null);

    String currentId = SecurityUtil.getCurrentUserId();
    if (!currentId.equals(userId)) {
      response.setStatus(HTTPResponse.SC_FORBIDDEN);
      response.setMessage("Chưa đăng nhập");
      return response;
    }

    Optional<Person> personOpt = personRepo.findById(userId);
    if (personOpt.isEmpty()) {
      response.setStatus(HTTPResponse.SC_NOT_FOUND);
      response.setMessage("Không tìm thấy thông tin người dùng");
      return response;
    }

    response.setSuccess(true);
    response.setStatus(HTTPResponse.SC_OK);
    response.setMessage("Lấy thông tin người dùng thành công!");
    response.setData(personOpt.get());
    
    return response;
  }

  public APIResponse<Person> updateInfor(String userId, CustomerUpdateRequest request) throws AccessDeniedException {
    APIResponse<Person> response = new APIResponse<>();

    String currentId = SecurityUtil.getCurrentUserId();
    if (!currentId.equals(userId)) {
      response.setStatus(HTTPResponse.SC_FORBIDDEN);
      response.setMessage("Chưa đăng nhập");
      return response;
    }

    Optional<Person> personOpt = personRepo.findById(userId);
    if (personOpt.isEmpty()) {
      response.setStatus(HTTPResponse.SC_NOT_FOUND);
      response.setMessage("Không tìm thấy thông tin người dùng");
      return response;
    }

    Person person = personOpt.get();
    person.setFullName(request.getFullName());
    person.setPhone(request.getPhone());

    Person savedPerson = personRepo.save(person);

    response.setSuccess(true);
    response.setStatus(HTTPResponse.SC_OK);
    response.setMessage("Cập nhật thông tin thành công!");
    response.setData(savedPerson);

    return response;
  }
}
