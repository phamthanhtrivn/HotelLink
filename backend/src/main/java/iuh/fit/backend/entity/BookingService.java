package iuh.fit.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "booking_services")
public class BookingService {

    @EmbeddedId
    private BookingServiceId bookingServiceId;

    @ManyToOne
    @MapsId("bookingId")
    @JoinColumn(name = "booking_id")
    private Booking booking;
    @ManyToOne
    @MapsId("serviceId")
    @JoinColumn(name = "service_id")
    private Service service;
    @Min(value = 1, message = "Số lượng phải lớn hơn hoặc bằng 1")
    private int quantity;
    @DecimalMin(value = "10000", message = "Giá dịch vụ phải lớn hơn hoặc bằng 10,000 VND")
    private double price;
    private LocalDateTime usedAt;
}
