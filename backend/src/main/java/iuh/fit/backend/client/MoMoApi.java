package iuh.fit.backend.client;

import iuh.fit.backend.dto.MoMoRequest;
import iuh.fit.backend.dto.MoMoResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "momo", url = "${momo.end-point}")
public interface MoMoApi {

    @PostMapping("/create")
    MoMoResponse createMoMoQR(@RequestBody MoMoRequest moMoRequest);
}
