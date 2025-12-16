package iuh.fit.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class BookingServiceId implements Serializable {
    @Column(name = "booking_id")
    private String bookingId;
    @Column(name = "service_id")
    private String serviceId;
}
