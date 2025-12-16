package iuh.fit.backend.repository;

import iuh.fit.backend.entity.User;
import jakarta.validation.constraints.Email;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<User, String> {
    User findUserByEmail(String email);
    boolean existsUserById(String id);
}
