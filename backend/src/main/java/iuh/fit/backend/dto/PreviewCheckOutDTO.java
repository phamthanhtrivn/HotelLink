package iuh.fit.backend.dto;

import iuh.fit.backend.entity.BookingServiceEntity;
import iuh.fit.backend.entity.ServiceEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PreviewCheckOutDTO {
    private List<BookingServiceEntity> usedServices;
    private ServiceEntity lateCheckOutService;
}
