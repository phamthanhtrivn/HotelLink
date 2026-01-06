package iuh.fit.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "staffs")
public class Staff extends Person {
    @Enumerated(EnumType.STRING)
    private Gender gender;
    @NotNull(message = "Ngày sinh không được để trống")
    @Past(message = "Ngày sinh phải là ngày trong quá khứ")
    private LocalDate dateOfBirth;
    @NotBlank(message = "Số CCCD không được để trống")
    @Pattern(
            regexp = "^\\d{12}$",
            message = "Số CCCD phải gồm đúng 12 chữ số"
    )
    @Column(unique = true)
    private String identificationId;
}
