package iuh.fit.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class FeedbackDTO {
    private String id;
    private int cleanlinessScore;
    private int serviceScore;
    private int facilitiesScore;
    private String comments;
    private String roomTypeName;
    private LocalDateTime createdAt;
}
