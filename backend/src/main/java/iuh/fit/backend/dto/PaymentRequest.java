package iuh.fit.backend.dto;

import lombok.Data;

@Data
public class PaymentRequest {
    private long amount;
    private String bankCode;
    private String bookingId;
}
