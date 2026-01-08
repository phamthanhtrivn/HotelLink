package iuh.fit.backend.repository;

import iuh.fit.backend.entity.Gender;
import iuh.fit.backend.entity.Staff;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface StaffRepo extends JpaRepository<Staff, String> {
    @Query("SELECT s " +
            "FROM Staff s " +
            "WHERE s.user.role = iuh.fit.backend.entity.UserRole.STAFF " +
            "AND (:fullName IS NULL OR LOWER(s.fullName) LIKE LOWER(CONCAT('%', :fullName, '%'))) " +
            "AND (:email IS NULL OR s.user.email = :email) " +
            "AND (:phone IS NULL OR s.phone = :phone) " +
            "AND (:identificationId IS NULL OR s.identificationId = :identificationId) " +
            "AND (:gender IS NULL OR s.gender = :gender) " +
            "AND (:status IS NULL OR s.user.status = :status) "
    )
    Page<Staff> searchAdvance(@Param("fullName") String fullName,
                              @Param("email") String email,
                              @Param("phone") String phone,
                              @Param("identificationId") String identificationId,
                              @Param("gender") Gender gender,
                              @Param("status") Boolean status,
                              Pageable pageable);

    Staff findByUser_Email(String userEmail);
    Staff findByPhone(String phone);
    Staff findByIdentificationId(String identificationId);
}
