package iuh.fit.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "room_types")
public class RoomType {
    @Id
    @Column(name = "room_type_id")
    private String id;
    @NotBlank(message = "Tên loại phòng không được để trống")
    @Pattern(
            message = "Tên loại phòng phải bắt đầu bằng HotelLink; chứa Standard, Deluxe, Suite hoặc Family; có từ 3 từ trở lên",
            regexp = "^HotelLink(?=.*\\b(Standard|Deluxe|Suite|Family)\\b)(?:\\s+[A-Za-zÀ-ỹ]+)+$"
    )
    private String name;
    @DecimalMin(value = "300000", message = "Giá phòng phải lớn hơn hoặc bằng 300,000 VND")
    private double price;
    @Min(value = 1, message = "Sức chứa phải ít nhất 1 người")
    @Max(value = 10, message = "Sức chứa không vượt quá 10 người")
    private int guestCapacity;
    @DecimalMin(value = "10", message = "Diện tích phòng phải lớn hơn 10m2")
    private double area;

    @NotEmpty(message = "Loại phòng phải có ít nhất 1 hình ảnh")
    @ElementCollection
    @CollectionTable(
            name = "room_type_pictures",
            joinColumns = @JoinColumn(name = "room_type_id")
    )
    @Column(name = "picture_url", unique = true)
    private List<String> pictures;
    @NotBlank(message = "Mô tả không được để trống")
    @Size(min = 20, max = 1000, message = "Mô tả phải từ 20 đến 1000 ký tự")
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean status;
}
