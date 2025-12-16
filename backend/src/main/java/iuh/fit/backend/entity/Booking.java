package iuh.fit.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
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
@Table(name = "bookings")
public class Booking {
    @Id
    @Column(name = "booking_id")
    private String id;
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;
    @NotBlank(message = "Tên đầy đủ không được để trống")
    @Pattern(
            regexp = "^(?:[A-ZÀ-Ỹ][a-zà-ỹ]*)(?:\\s+[A-ZÀ-Ỹ][a-zà-ỹ]*)+$",
            message = "Viết hoa mỗi chữ cái đầu, ít nhất 2 từ gồm họ và tên"
    )
    private String fullName;
    private String contactName;
    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(
            regexp = "^(03|05|07|08|09|01)+([0-9]{8})$",
            message = "Số điện thoại không hợp lệ"
    )
    private String contactPhone;
    @Email
    private String contactEmail;
    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;
    private LocalDateTime checkIn;
    private LocalDateTime checkOut;
    @DecimalMin(value = "300000", message = "Giá phòng phải lớn hơn hoặc bằng 300,000 VND")
    private double roomPrice;
    @Min(value = 1, message = "Số đêm phải lớn hơn hoặc bằng 1")
    private int nights;
    @Size(max = 500, message = "Ghi chú không được vượt quá 500 ký tự")
    private String notes;
    @Enumerated(EnumType.STRING)
    private BookingStatus bookingStatus;
    @Enumerated(EnumType.STRING)
    private BookingSource bookingSource;
    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;
    @ManyToOne
    @JoinColumn(name = "updated_by")
    private User updatedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    @PositiveOrZero(message = "Phí VAT phải lớn hơn hoặc bằng 0")
    private double vatFee;
    @PositiveOrZero(message = "Giảm giá lần đầu phải lớn hơn hoặc bằng 0")
    private double firstTimeDiscount;
    @PositiveOrZero(message = "Giảm giá điểm phải lớn hơn hoặc bằng 0")
    private double pointDiscount;
    @PositiveOrZero(message = "Dịch vụ bổ sung phải lớn hơn hoặc bằng 0")
    private double extraServices;
    private boolean paid;
    @Positive(message = "Tổng tiền phải lớn hơn 0")
    private double total;
    @Positive(message = "Tổng tiền thanh toán phải lớn hơn 0")
    private double totalPayment;
}
