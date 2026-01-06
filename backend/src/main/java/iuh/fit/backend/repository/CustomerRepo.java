package iuh.fit.backend.repository;

import iuh.fit.backend.entity.Customer;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepo extends JpaRepository<Customer, String> {
    Customer findCustomersByPhone(String phone);

    @Query("SELECT c " + 
        "FROM Customer c " + 
        "WHERE c.user.role = iuh.fit.backend.entity.UserRole.MEMBER " +
        "AND (:fullName IS NULL OR LOWER(c.fullName) LIKE LOWER(CONCAT('%', :fullName, '%'))) " +
        "AND (:email IS NULL OR c.user.email = :email) " + 
        "AND (:phone IS NULL OR c.phone = :phone) " + 
        "AND (:minPoint IS NULL OR c.points >= :minPoint) " + 
        "AND (:maxPoint IS NULL OR c.points <= :maxPoint) " +
        "AND (:status IS NULL OR c.user.status = :status)"
    )
    Page<Customer> searchAdvance(@Param("fullName") String fullName, @Param("email") String email, @Param("phone") String phone, @Param("minPoint") Double minPoint, @Param("maxPoint") Double maxPoint, @Param("status") Boolean status, Pageable pageable);
}
