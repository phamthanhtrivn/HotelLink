package iuh.fit.backend.service;

import iuh.fit.backend.client.MoMoApi;
import iuh.fit.backend.config.MoMoConfig;
import iuh.fit.backend.config.VNPayConfig;
import iuh.fit.backend.dto.APIResponse;
import iuh.fit.backend.dto.MoMoRequest;
import iuh.fit.backend.dto.MoMoResponse;
import iuh.fit.backend.dto.PaymentRequest;
import iuh.fit.backend.entity.Booking;
import iuh.fit.backend.repository.BookingRepo;
import iuh.fit.backend.util.PaymentUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final VNPayConfig vnPayConfig;
    private final MoMoConfig momoConfig;
    private final MoMoApi moMoApi;
    private final BookingRepo bookingRepo;
    private final BookingService bookingService;

    @Value("${app.frontend.url}")
    private String frontendUrl;
    @Value("${app.backend.url}")
    private String backendUrl;

    public APIResponse<Object> createVnPayPayment(HttpServletRequest request, PaymentRequest paymentRequest) {
        APIResponse<Object> response = new APIResponse<>();
        response.setSuccess(false);

        long amount = paymentRequest.getAmount() * 100L;
        String bankCode = paymentRequest.getBankCode();
        Map<String, String> vnpParamsMap = vnPayConfig.getVNPayConfig(paymentRequest.getBookingId());
        vnpParamsMap.put("vnp_Amount", String.valueOf(amount));
        if (bankCode != null && !bankCode.isEmpty()) {
            vnpParamsMap.put("vnp_BankCode", bankCode);
        }
        vnpParamsMap.put("vnp_IpAddr", PaymentUtil.getIpAddress(request));

        String queryUrl = PaymentUtil.getPaymentURL(vnpParamsMap, true);
        String hashData = PaymentUtil.getPaymentURL(vnpParamsMap, false);
        String vnpSecureHash = PaymentUtil.hmacSHA512(vnPayConfig.getSecretKey(), hashData);
        queryUrl += "&vnp_SecureHash=" + vnpSecureHash;
        String paymentUrl = vnPayConfig.getVnp_PayUrl() + "?" + queryUrl;

        response.setSuccess(true);
        response.setMessage("Tạo URL thanh toán VNPay thành công");
        response.setData(paymentUrl);
        return response;
    }

    public void payCallbackHandler(HttpServletRequest request, HttpServletResponse response) {
        String responseCode = request.getParameter("vnp_ResponseCode");
        String bookingId = request.getParameter("vnp_TxnRef");
        try {
            if ("00".equals(responseCode)) {
                Optional<Booking> bookingOpt = bookingRepo.findById(bookingId);
                if (bookingOpt.isPresent()) {
                    bookingService.updateBookingStatusConfirmedByCustomer(bookingId);
                    response.sendRedirect(frontendUrl + "/payment/success?bookingId=" + bookingId);
                }
                
            } else {
                response.sendRedirect(frontendUrl + "/payment/failed?bookingId=" + bookingId);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public MoMoResponse createMoMoPayment(PaymentRequest paymentRequest) {
        String bookingId = paymentRequest.getBookingId();
        String bookingInfo = "Thanh toán đơn đặt phòng: " + bookingId;
        long amount = paymentRequest.getAmount();
        String requestId = UUID.randomUUID().toString();

        String ipnUrl = backendUrl + "/api/payments/momo-pay-callback";
        String redirectUrl = backendUrl + "/api/payments/momo-return";

        String rawSignature = String.format(
                "accessKey=%s&amount=%s&extraData=%s&ipnUrl=%s&orderId=%s&orderInfo=%s&partnerCode=%s&redirectUrl=%s&requestId=%s&requestType=%s",
                momoConfig.getAccessKey(),
                amount,
                "",
                ipnUrl,
                bookingId,
                bookingInfo,
                momoConfig.getPartnerCode(),
                redirectUrl,
                requestId,
                momoConfig.getRequestType()
        );
        String signature = PaymentUtil.hmacSHA256(momoConfig.getSecretKey(), rawSignature);

        MoMoRequest momoRequest = MoMoRequest.builder()
                .partnerCode(momoConfig.getPartnerCode())
                .requestType(momoConfig.getRequestType())
                .ipnUrl(ipnUrl)
                .redirectUrl(redirectUrl)
                .orderId(bookingId)
                .orderInfo(bookingInfo)
                .amount(amount)
                .requestId(requestId)
                .lang("vi")
                .extraData("")
                .signature(signature)
                .build();

        return moMoApi.createMoMoQR(momoRequest);
    }

    public void handleMoMoReturn(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String resultCode = request.getParameter("resultCode");
        String bookingId = request.getParameter("orderId");

        if ("0".equals(resultCode)) {
            Optional<Booking> bookingOpt = bookingRepo.findById(bookingId);
            if (bookingOpt.isPresent()) {
                bookingService.updateBookingStatusConfirmedByCustomer(bookingId);
                response.sendRedirect(frontendUrl + "/payment/success?bookingId=" + bookingId);
            }
        } else {
            response.sendRedirect(frontendUrl + "/payment/failed?bookingId=" + bookingId);
        }
    }


}
