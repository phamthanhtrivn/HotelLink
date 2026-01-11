package iuh.fit.backend.dto;

import iuh.fit.backend.entity.RoomStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RoomAvailabilityForStaff {
    private String roomId;
    private String roomNumber;
    private String floor;
    private RoomStatus roomStatus;
}
