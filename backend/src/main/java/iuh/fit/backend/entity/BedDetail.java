package iuh.fit.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "bed_details")
public class BedDetail {
    @EmbeddedId
    private BedDetailId bedDetailId;

    @ManyToOne
    @MapsId("roomTypeId")
    @JoinColumn(name = "room_type_id")
    private RoomType roomType;

    @ManyToOne
    @MapsId("bedId")
    @JoinColumn(name = "bed_id")
    private Bed bed;

    @Min(value = 1, message = "Số lượng giường phải ít nhất là 1")
    private int bedQuantity;
}
