package iuh.fit.backend.dto;

import iuh.fit.backend.entity.ServiceEntity;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AddBookingServiceRequest {
    private String userId;
    @NotEmpty(message = "Danh sách dịch vụ không được để trống")
    private List<ServiceItem> services;

    @Getter
    @Setter
    public static class ServiceItem {
        @NotBlank(message = "Mã dịch vụ không được để trống")
        private String serviceId;
        @Min(value = 1)
        private int quantity;
    }
}
