package iuh.fit.backend.dto;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MoMoRequest {
    private String partnerCode;
    private String requestType;
    private String ipnUrl; // return backend url to receive payment result
    private String orderId;
    private long amount;
    private String orderInfo;
    private String requestId;
    private String redirectUrl;
    private String lang;
    private String extraData;
    private String signature;
}
