package iuh.fit.backend.controller.admin;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import iuh.fit.backend.dto.APIResponse;
import iuh.fit.backend.dto.CustomerUpdateRequest;
import iuh.fit.backend.service.PersonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.nio.file.AccessDeniedException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/persons")
public class Admin_PersonController {
  private final PersonService personService;

  @GetMapping("/{personId}")
  public ResponseEntity<APIResponse<?>> getPersonInfoById(@PathVariable String personId) throws AccessDeniedException {
    APIResponse<?> response = personService.getPersonInfoById(personId);  
    return ResponseEntity.status(response.getStatus()).body(response);
  }

  @PutMapping("/{personId}")
  public ResponseEntity<APIResponse<?>> updatePerson(@PathVariable String personId, @RequestBody @Valid CustomerUpdateRequest request) throws AccessDeniedException {
    APIResponse<?> response = personService.updateInfor(personId, request);  
    return ResponseEntity.status(response.getStatus()).body(response);
  }
  
}
