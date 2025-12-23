package iuh.fit.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BedResponse {
    private String id;
    private String name;
    private String description;
    private int quantity;
}
