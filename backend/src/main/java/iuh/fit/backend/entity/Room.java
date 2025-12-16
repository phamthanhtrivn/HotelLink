package iuh.fit.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
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
@Table(name = "rooms")
public class Room {
    @Id
    @Column(name = "room_id")
    private String id;
    @NotBlank
    @Pattern(
            message = "Số phòng phải là 101, 102, 201...",
            regexp = "^[1-9][0-9]{2}$"
    )
    private String roomNumber;
    @NotBlank
    @Pattern(
            message = "Tầng phải là Tầng 1, Tầng 2, Tầng 3...",
            regexp = "^[Tầng][1-9][0-9]?$"
    )
    private String floor;
    @ManyToOne
    @JoinColumn(name = "room_type_id")
    private RoomType roomType;
    @Enumerated(EnumType.STRING)
    private RoomStatus roomStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean status;
}
