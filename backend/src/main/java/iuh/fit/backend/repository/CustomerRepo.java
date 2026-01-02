package iuh.fit.backend.repository;

import iuh.fit.backend.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepo extends JpaRepository<Customer, String> {
    Customer findCustomersByPhone(String phone);
}
