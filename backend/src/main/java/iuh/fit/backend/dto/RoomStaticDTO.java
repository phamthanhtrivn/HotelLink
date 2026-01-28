package iuh.fit.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RoomStaticDTO {
    private String maLoaiPhong;
    private String tenLoaiPhong;
    private Double gia;
    private long deals;
    private long occupied;
    private long total;
}
