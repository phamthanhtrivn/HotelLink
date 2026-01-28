package iuh.fit.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardDataDTO {
    private List<OverviewStatDTO> overviewData;
    private List<RoomStaticDTO> roomStaticData;
    private double floorStatus;
    private Map<String, List<Map<String, Object>>> revenueData;
    private Map<String, Object> occupancyStatistic;
    private List<FeedbackDTO> feedbackData;
}
