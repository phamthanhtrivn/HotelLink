package iuh.fit.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RoomTypeAvailabilityForStaff {
    private String id;
    private String name;
    private double price;
    private int guestCapacity;
    private double area;
    private String description;
    private List<String> pictures;

    private long availableRoomCount;
    private List<RoomAvailabilityForStaff> rooms;

    private List<BedResponse> beds;
    private List<AmenityResponse> amenities;
}
