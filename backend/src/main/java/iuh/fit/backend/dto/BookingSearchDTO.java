package iuh.fit.backend.dto;

import iuh.fit.backend.entity.Booking;
import iuh.fit.backend.entity.BookingServiceEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BookingSearchDTO {
    private Booking booking;
    private List<BookingServiceEntity> bookingServices;
}
