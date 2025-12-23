package iuh.fit.backend.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RoomTypeDetailResponse {
    private String id;
    private String name;
    private double price;
    private int guestCapacity;
    private double area;
    private String description;

    private List<String> pictures;
    private List<BedResponse> beds;
    private List<AmenityResponse> amenities;
}
