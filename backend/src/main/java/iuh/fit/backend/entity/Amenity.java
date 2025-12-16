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
@Table(name = "amenities")
public class Amenity {
    @Id
    @Column(name = "amenity_id")
    private String id;
    private String name;
    private String icon;
    @ManyToOne
    @JoinColumn(name = "amenity_type_id")
    private AmenityType amenityType;
}
