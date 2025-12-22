package iuh.fit.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
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
                    background-color:#dc2626;
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
                               background-color:#dc2626;
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

}
