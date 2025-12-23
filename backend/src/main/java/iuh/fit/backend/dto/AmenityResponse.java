package iuh.fit.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AmenityResponse {
    private String id;
    private String name;
    private String icon;
    private String type;
}
