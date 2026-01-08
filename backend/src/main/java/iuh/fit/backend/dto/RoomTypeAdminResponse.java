package iuh.fit.backend.dto;

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
public class RoomTypeAdminResponse {
    private String id;
    private String name;
    private double price;
    private int guestCapacity;
    private double area;
    private List<String> pictures;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean status;

    private List<BedResponse> beds;
    private List<AmenityResponse> amenities;
}
