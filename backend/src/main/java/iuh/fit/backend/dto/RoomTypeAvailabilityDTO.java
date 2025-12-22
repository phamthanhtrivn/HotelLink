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
public class RoomTypeAvailabilityDTO {
    private String id;
    private String name;
    private double price;
    private int guestCapacity;
    private double area;
    private List<String> pictures;
    private String description;
    private long availableRooms;
}
