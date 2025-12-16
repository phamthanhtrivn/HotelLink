package iuh.fit.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AmenityDetailId implements Serializable {
    @Column(name = "room_type_id")
    private String roomTypeId;
    @Column(name = "amenity_id")
    private String amenityId;
}
