package iuh.fit.backend.dto;

import iuh.fit.backend.entity.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateBookingStatusRequest {
    private String userId;
    private BookingStatus bookingStatus;
}
