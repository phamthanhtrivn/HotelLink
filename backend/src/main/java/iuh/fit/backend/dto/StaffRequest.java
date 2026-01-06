package iuh.fit.backend.dto;

import iuh.fit.backend.entity.Gender;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StaffRequest {
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;
    @NotBlank(message = "Mật khẩu không được để trống")
    private String password;
    @NotBlank(message = "Tên đầy đủ không được để trống")
    @Pattern(
            regexp = "^(?:[A-ZÀ-Ỹ][a-zà-ỹ]*)(?:\\s+[A-ZÀ-Ỹ][a-zà-ỹ]*)+$",
            message = "Viết hoa mỗi chữ cái đầu, ít nhất 2 từ gồm họ và tên"
    )
    private String fullName;
    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(
            regexp = "^(03|05|07|08|09|01)+([0-9]{8})$",
            message = "Số điện thoại không hợp lệ"
    )
    private String phone;
    @NotBlank(message = "Số CCCD không được để trống")
    @Pattern(
            regexp = "^\\d{12}$",
            message = "Số CCCD phải gồm đúng 12 chữ số"
    )
    private String identificationId;
    @Enumerated(EnumType.STRING)
    private Gender gender;
    @NotNull(message = "Ngày sinh không được để trống")
    @Past(message = "Ngày sinh phải là ngày trong quá khứ")
    private LocalDate dateOfBirth;
}
