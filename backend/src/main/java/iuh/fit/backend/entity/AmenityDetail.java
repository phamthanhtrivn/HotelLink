package iuh.fit.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "amenity_details")
public class AmenityDetail {
    @EmbeddedId
    private AmenityDetailId amenityDetailId;

    @ManyToOne
    @MapsId("roomTypeId")
    @JoinColumn(name = "room_type_id")
    private RoomType roomType;

    @ManyToOne
    @MapsId("amenityId")
    @JoinColumn(name = "amenity_id")
    private Amenity amenity;
}
