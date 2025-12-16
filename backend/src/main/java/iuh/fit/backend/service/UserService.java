package iuh.fit.backend.service;

import iuh.fit.backend.entity.User;
import iuh.fit.backend.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepo userRepo;

    public User getUserByEmail(String email) {
        return userRepo.findUserByEmail(email);
    }

}
