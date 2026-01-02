package iuh.fit.backend.repository;

import iuh.fit.backend.entity.ServiceEntity;
import iuh.fit.backend.entity.ServiceType;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceRepo extends JpaRepository<ServiceEntity, String> {
  @Query("""
        SELECT s FROM ServiceEntity s
        WHERE (:name IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :name, '%')))
          AND (:type IS NULL OR s.serviceType = :type)
          AND (:status IS NULL OR s.status = :status)
          AND (:minPrice IS NULL OR s.unitPrice >= :minPrice)
          AND (:maxPrice IS NULL OR s.unitPrice <= :maxPrice)
    """)
  Page<ServiceEntity> search(@Param("name") String name, @Param("type") ServiceType type, @Param("status") Boolean status,  @Param("minPrice") Double minPrice,  @Param("maxPrice") Double maxPrice, Pageable pageable);

  boolean existsServicesById(String id);
}
