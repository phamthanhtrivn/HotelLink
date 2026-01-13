package iuh.fit.backend.dto;

import iuh.fit.backend.entity.BookingSource;
import iuh.fit.backend.entity.Room;
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
public class StaffBookingRequest {
    @NotBlank(message = "Tên đầy đủ không được để trống")
    @Pattern(
            regexp = "^(?:[A-ZÀ-Ỹ][a-zà-ỹ]*)(?:\\s+[A-ZÀ-Ỹ][a-zà-ỹ]*)+$",
            message = "Viết hoa mỗi chữ cái đầu, ít nhất 2 từ gồm họ và tên"
    )
    private String contactName;
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String contactEmail;
    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(
            regexp = "^(03|05|07|08|09|01)+([0-9]{8})$",
            message = "Số điện thoại không hợp lệ"
    )
    private String contactPhone;
    private String roomId;
    private LocalDateTime checkIn;
    private LocalDateTime checkOut;
    private Double roomPrice;
    private Integer nights;
    private String notes;
    private BookingSource bookingSource;
    private Boolean paid = false;
    private String userId;
    private Double vatFee;
    private Double total;
    private Double totalPayment;
}
