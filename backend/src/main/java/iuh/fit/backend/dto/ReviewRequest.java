package iuh.fit.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReviewRequest {
  private int cleanlinessScore;
    @NotNull(message = "Vui lòng chấm điểm dịch vụ")
    @Min(value = 1, message = "Điểm từ 1 - 10")
    @Max(value = 10, message = "Điểm từ 1 - 10")
    private int serviceScore;
    @NotNull(message = "Vui lòng chấm điểm cơ sở vật chất")
    @Min(value = 1, message = "Điểm từ 1 - 10")
    @Max(value = 10, message = "Điểm từ 1 - 10")
    private int facilitiesScore;
    @NotBlank(message = "Vui lòng để lại bình luận")
    private String comments; 
}
