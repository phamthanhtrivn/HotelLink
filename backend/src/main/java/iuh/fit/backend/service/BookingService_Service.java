package iuh.fit.backend.service;

import iuh.fit.backend.dto.AddBookingServiceRequest;
import iuh.fit.backend.entity.*;
import iuh.fit.backend.repository.BookingRepo;
import iuh.fit.backend.repository.BookingServiceRepo;
import iuh.fit.backend.repository.ServiceRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class BookingService_Service {
    private final BookingServiceRepo bookingServiceRepo;
    private final BookingRepo bookingRepo;
    private final ServiceRepo serviceRepo;

    @Transactional
    public void earlyCheckIn(String bookingId) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Đơn đặt phòng không tồn tại"));

        ServiceEntity earlyCheckInService = serviceRepo.findByNameContainingIgnoreCaseAndStatusTrue("CheckIn", true);
        if (earlyCheckInService == null) {
            throw new IllegalArgumentException("Dịch vụ CheckIn sớm không tồn tại");
        }

        BookingServiceEntity bookingService = new BookingServiceEntity();
        bookingService.setBooking(booking);
        bookingService.setService(earlyCheckInService);
        bookingService.setQuantity(1);
        bookingService.setPrice(earlyCheckInService.getUnitPrice());
        bookingService.setUsedAt(LocalDateTime.now());

        bookingServiceRepo.save(bookingService);

    }

    @Transactional
    public void addServicesToBooking(
            String bookingId,
            List<AddBookingServiceRequest.ServiceItem> serviceItems
    ) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Đơn đặt phòng không tồn tại"));

        bookingServiceRepo.deleteByBooking_Id(bookingId);

        Map<ServiceType, Set<String>> usedTimeBasedServices = new HashMap<>();
        List<BookingServiceEntity> result = new ArrayList<>();

        for (AddBookingServiceRequest.ServiceItem item : serviceItems) {

            ServiceEntity service = serviceRepo.findById(item.getServiceId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Dịch vụ không tồn tại: " + item.getServiceId()
                    ));

            if (!service.isStatus()) {
                throw new IllegalStateException(
                        "Dịch vụ đang ngưng hoạt động: " + service.getName()
                );
            }

            int quantity = item.getQuantity();
            ServiceType type = service.getServiceType();

            validateQuantity(service, quantity);

            if (type == ServiceType.TIME_BASED) {
                usedTimeBasedServices
                        .computeIfAbsent(type, k -> new HashSet<>());

                if (!usedTimeBasedServices.get(type).add(service.getId())) {
                    throw new IllegalArgumentException(
                            "Dịch vụ " + service.getName() + " chỉ được sử dụng một lần trong một đặt phòng"
                    );
                }
            }

            BookingServiceEntity bookingService = new BookingServiceEntity();
            bookingService.setBookingServiceId(
                    new BookingServiceId(bookingId, service.getId())
            );
            bookingService.setBooking(booking);
            bookingService.setService(service);
            bookingService.setQuantity(quantity);
            bookingService.setPrice(service.getUnitPrice());
            bookingService.setUsedAt(LocalDateTime.now());

            result.add(bookingService);
        }

        bookingServiceRepo.saveAll(result);
    }

    private void validateQuantity(ServiceEntity service, int quantity) {
        ServiceType type = service.getServiceType();

        switch (type) {
            case FOOD, DRINK, PER_GUEST -> {
                if (quantity < 1) {
                    throw new IllegalArgumentException(
                            "Dịch vụ " + service.getName() + " phải có số lượng >= 1"
                    );
                }
            }
            case TIME_BASED, OTHER -> {
                if (quantity != 1) {
                    throw new IllegalArgumentException(
                            "Dịch vụ " + service.getName() + " chỉ được phép số lượng = 1"
                    );
                }
            }
        }
    }

}
