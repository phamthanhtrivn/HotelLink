package iuh.fit.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RoomTypeUpdateRequest {
    @NotNull(message = "Giá phòng không được để trống")
    @DecimalMin(value = "300000", message = "Giá phòng phải lớn hơn hoặc bằng 300,000 VND")
    private Double price;
    @NotBlank(message = "Mô tả không được để trống")
    @Size(min = 20, max = 1000, message = "Mô tả phải từ 20 đến 1000 ký tự")
    private String description;
    private Boolean status;
    private List<AmenityRoomTypeUpdate> amenities;
    private List<BedRoomTypeUpdate> beds;

    private List<String> keepImages;
    private List<String> deleteImages;
}
