package iuh.fit.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomUpdateRequest {
    @NotBlank(message = "Số phòng không được để trống")
    @Pattern(
            message = "Số phòng phải là 101, 102, 201...",
            regexp = "^[1-9][0-9]{2}$"
    )
    private String roomNumber;
    @NotBlank
    @Pattern(
            message = "Tầng phải là Tầng 1, Tầng 2, Tầng 3...",
            regexp = "^Tầng\\s[1-9][0-9]*$"
    )
    private String floor;
    private String roomTypeId;
}
