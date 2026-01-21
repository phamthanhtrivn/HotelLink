package iuh.fit.backend.dto;

import iuh.fit.backend.entity.BookingSource;
import iuh.fit.backend.entity.BookingStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class BookingSearchRequest {

    private String keyword;
    // search chung: id | contactName | phone | email

    private BookingStatus bookingStatus;

    private BookingSource bookingSource;

    private String roomNumber;

    private LocalDateTime checkInFrom;
    private LocalDateTime checkInTo;

    private LocalDateTime checkOutFrom;
    private LocalDateTime checkOutTo;

    private Boolean paid;
}

