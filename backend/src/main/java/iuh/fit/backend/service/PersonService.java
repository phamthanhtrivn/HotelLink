package iuh.fit.backend.service;

import iuh.fit.backend.entity.Person;
import iuh.fit.backend.repository.PersonRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PersonService {
    private final PersonRepo personRepo;
}
