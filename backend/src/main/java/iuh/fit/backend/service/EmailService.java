package iuh.fit.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    @Value("${spring.mail.username}")
    private String fromEmail;

    private void sendHtmlEmail(String toEmail, String subject, String content) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, "utf-8");

            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(content, true);
            helper.setFrom(fromEmail);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Send email failed", e);
        }
    }

    public void sendResetPasswordEmail(String toEmail, String resetLink) {

        String subject = "Thay đổi mật khẩu";

        String content = """
            <div style="
                max-width:600px;
                margin:0 auto;
                font-family:Arial, Helvetica, sans-serif;
                background-color:#ffffff;
                border:1px solid #e5e7eb;
                border-radius:8px;
                overflow:hidden;
            ">
        
                <!-- Header -->
                <div style="
                    background-color:#1e2a38;
                    padding:20px;
                    text-align:center;
                    color:white;
                ">
                    <h1 style="margin:0; font-size:22px;">
                        HotelLink
                    </h1>
                    <p style="margin:4px 0 0; font-size:14px;">
                        Password Reset Request
                    </p>
                </div>
        
                <!-- Body -->
                <div style="padding:24px; color:#111827;">
                    <h2 style="margin-top:0; font-size:20px;">
                        Đặt lại mật khẩu
                    </h2>
        
                    <p style="font-size:14px; line-height:1.6;">
                        Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.
                        Nhấn vào nút bên dưới để tiếp tục.
                    </p>
        
                    <div style="text-align:center; margin:32px 0;">
                        <a href="%s"
                           style="
                               display:inline-block;
                               padding:12px 24px;
                               background-color:#1e2a38;
                               color:#ffffff;
                               text-decoration:none;
                               font-size:15px;
                               font-weight:bold;
                               border-radius:6px;
                           ">
                            Reset mật khẩu
                        </a>
                    </div>
        
                    <p style="font-size:13px; color:#374151;">
                        Link này sẽ hết hạn sau <b>15 phút</b>.
                    </p>
        
                    <p style="font-size:13px; color:#6b7280;">
                        Nếu bạn không yêu cầu đặt lại mật khẩu,
                        vui lòng bỏ qua email này. Không có thay đổi nào
                        được thực hiện.
                    </p>
        
                    <hr style="border:none; border-top:1px solid #e5e7eb; margin:24px 0;">
        
                    <p style="font-size:12px; color:#9ca3af;">
                        © 2025 HotelLink. All rights reserved.
                    </p>
                </div>
            </div>
            """.formatted(resetLink);

        sendHtmlEmail(toEmail, subject, content);
    }

    public void sendPaymentReminderEmail(
            String toEmail,
            String bookingId
    ) {

        String subject = "Xác nhận & thanh toán đơn đặt phòng #" + bookingId;

        String content = """
            <div style="
                max-width:600px;
                margin:0 auto;
                font-family:Arial, Helvetica, sans-serif;
                background-color:#ffffff;
                border:1px solid #e5e7eb;
                border-radius:8px;
                overflow:hidden;
            ">

                <!-- Header -->
                <div style="
                    background-color:#1e2a38;
                    padding:20px;
                    text-align:center;
                    color:white;
                ">
                    <h1 style="margin:0; font-size:22px;">
                        HotelLink
                    </h1>
                    <p style="margin:4px 0 0; font-size:14px;">
                        Xác nhận thanh toán đơn đặt phòng
                    </p>
                </div>

                <!-- Body -->
                <div style="padding:24px; color:#111827;">
                    <h2 style="margin-top:0; font-size:20px;">
                        Hoàn tất thanh toán để giữ phòng
                    </h2>

                    <p style="font-size:14px; line-height:1.6;">
                        Cảm ơn bạn đã đặt phòng tại <b>HotelLink</b>.
                        Đơn đặt phòng của bạn hiện đang ở trạng thái <b>chờ thanh toán</b>.
                    </p>

                    <p style="font-size:14px; line-height:1.6;">
                        Mã đơn đặt phòng:
                        <b style="color:#1e2a38;">%s</b>
                    </p>

                    <p style="font-size:14px; color:#374151;">
                        ⏰ Vui lòng hoàn tất thanh toán trong vòng
                        <b>15 phút</b> kể từ khi nhận được email này
                        để xác nhận đơn đặt phòng.
                    </p>

                    <p style="font-size:13px; color:#6b7280;">
                        Sau thời gian trên, nếu chưa thanh toán,
                        hệ thống sẽ <b>tự động hủy đơn</b>
                        và phòng sẽ được mở lại cho khách khác.
                    </p>

                    <hr style="border:none; border-top:1px solid #e5e7eb; margin:24px 0;">

                    <p style="font-size:12px; color:#9ca3af;">
                        Nếu bạn không thực hiện đặt phòng này,
                        vui lòng bỏ qua email. Mọi thắc mắc xin liên hệ bộ phận hỗ trợ.
                    </p>

                    <p style="font-size:12px; color:#9ca3af;">
                        © 2025 HotelLink. All rights reserved.
                    </p>
                </div>
            </div>
            """.formatted(bookingId);

            sendHtmlEmail(toEmail, subject, content);
        }

        public void sendPaymentSuccessEmail(
            String toEmail,
            String bookingId,
            LocalDateTime checkIn,
            LocalDateTime checkOut,
            double totalPayment
    ) {

        String subject = "Thanh toán thành công - Đơn đặt phòng #" + bookingId;

        DateTimeFormatter dateTimeFormatter =
                DateTimeFormatter.ofPattern("HH:mm dd/MM/yyyy");

        @SuppressWarnings("deprecation")
        NumberFormat currencyFormatter =
                NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));

        String checkInFormatted = checkIn.format(dateTimeFormatter);
        String checkOutFormatted = checkOut.format(dateTimeFormatter);
        String totalPaymentFormatted = currencyFormatter.format(totalPayment);

        String content = """
            <div style="
                max-width:600px;
                margin:0 auto;
                font-family:Arial, Helvetica, sans-serif;
                background-color:#ffffff;
                border:1px solid #e5e7eb;
                border-radius:8px;
                overflow:hidden;
            ">

                <!-- Header -->
                <div style="
                    background-color:#16a34a;
                    padding:20px;
                    text-align:center;
                    color:white;
                ">
                    <h1 style="margin:0; font-size:22px;">HotelLink</h1>
                    <p style="margin:4px 0 0; font-size:14px;">
                        Thanh toán thành công
                    </p>
                </div>

                <!-- Body -->
                <div style="padding:24px; color:#111827;">
                    <h2 style="margin-top:0; font-size:20px;">
                        🎉 Cảm ơn bạn đã thanh toán
                    </h2>

                    <p style="font-size:14px; line-height:1.6;">
                        Chúng tôi đã <b>xác nhận thanh toán thành công</b>
                        cho đơn đặt phòng của bạn tại <b>HotelLink</b>.
                    </p>

                    <p style="font-size:14px;">
                        Mã đơn đặt phòng:
                        <b style="color:#16a34a;">%s</b>
                    </p>

                    <!-- Booking Info -->
                    <div style="
                        margin:20px 0;
                        padding:16px;
                        background-color:#f9fafb;
                        border:1px solid #e5e7eb;
                        border-radius:6px;
                        font-size:14px;
                    ">
                        <p><b>⏰ Thời gian check-in:</b> %s</p>
                        <p><b>⏰ Thời gian check-out:</b> %s</p>
                        <p><b>💰 Tổng tiền đã thanh toán:</b>
                            <span style="color:#16a34a; font-weight:bold;">
                                %s
                            </span>
                        </p>
                    </div>

                    <div style="
                        margin:24px 0;
                        padding:16px;
                        background-color:#f0fdf4;
                        border:1px solid #bbf7d0;
                        border-radius:6px;
                        font-size:14px;
                        color:#166534;
                    ">
                        ✔ Phòng của bạn đã được giữ chỗ thành công.
                        Vui lòng đến đúng thời gian check-in.
                    </div>

                    <p style="font-size:13px; color:#6b7280;">
                        Nếu bạn có bất kỳ thắc mắc nào,
                        vui lòng liên hệ bộ phận hỗ trợ của chúng tôi.
                    </p>

                    <hr style="border:none; border-top:1px solid #e5e7eb; margin:24px 0;">

                    <p style="font-size:12px; color:#9ca3af;">
                        © 2025 HotelLink. All rights reserved.
                    </p>
                </div>
            </div>
            """.formatted(
                bookingId,
                checkInFormatted,
                checkOutFormatted,
                totalPaymentFormatted
            );

        sendHtmlEmail(toEmail, subject, content);
    }


}
