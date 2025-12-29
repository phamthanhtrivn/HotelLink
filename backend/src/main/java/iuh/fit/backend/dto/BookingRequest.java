package iuh.fit.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BookingRequest {
    private String roomTypeId;
    private LocalDateTime checkIn;
    private LocalDateTime checkOut;
    private String userId;
    @NotBlank(message = "Tên đầy đủ không được để trống")
    @Pattern(
            regexp = "^(?:[A-ZÀ-Ỹ][a-zà-ỹ]*)(?:\\s+[A-ZÀ-Ỹ][a-zà-ỹ]*)+$",
            message = "Viết hoa mỗi chữ cái đầu, ít nhất 2 từ gồm họ và tên"
    )
    private String name;
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;
    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(
            regexp = "^(03|05|07|08|09|01)+([0-9]{8})$",
            message = "Số điện thoại không hợp lệ"
    )
    private String phone;
    private Double roomPrice;
    private Integer nights;
    private String notes;
    private Double pointDiscount;
    private Double firstTimeDiscount;
    private Double total;
    private Double vatFee;
    private Double totalPayment;
}


