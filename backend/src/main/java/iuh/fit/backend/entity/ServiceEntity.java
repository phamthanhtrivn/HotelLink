package iuh.fit.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "services")
public class ServiceEntity {
    @Id
    @Column(name = "service_id")
    private String id;
    @NotBlank
    @Pattern(
            message = "Viết hoa mỗi chữ cái đầu, ít nhất 1 từ",
            regexp = "^[A-ZÀ-Ỹ][a-zà-ỹ]*(?:\\s+[A-ZÀ-Ỹ][a-zà-ỹ]*)*$"
    )
    private String name;
    @DecimalMin(value = "10000", message = "Đơn giá phải lớn hơn hoặc bằng 10,000")
    private double unitPrice;
    @Enumerated(EnumType.STRING)
    private ServiceType serviceType;
    private boolean status;
}
