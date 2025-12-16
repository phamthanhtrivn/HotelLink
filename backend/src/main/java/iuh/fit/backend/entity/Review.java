package iuh.fit.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
@Table(name = "reviews")
public class Review {
    @Id
    @Column(name = "review_id")
    private String id;
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;
    @OneToOne
    @JoinColumn(name = "booking_id", unique = true)
    private Booking booking;
    @NotNull(message = "Vui lòng chấm điểm sạch sẽ")
    @Min(value = 1, message = "Điểm từ 1 - 10")
    @Max(value = 10, message = "Điểm từ 1 - 10")
    private int cleanlinessScore;
    @NotNull(message = "Vui lòng chấm điểm dịch vụ")
    @Min(value = 1, message = "Điểm từ 1 - 10")
    @Max(value = 10, message = "Điểm từ 1 - 10")
    private int serviceScore;
    @NotNull(message = "Vui lòng chấm điểm cơ sở vật chất")
    @Min(value = 1, message = "Điểm từ 1 - 10")
    @Max(value = 10, message = "Điểm từ 1 - 10")
    private int facilitiesScore;
    @NotBlank(message = "Vui lòng để lại bình luận")
    private String comments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean status;
}
