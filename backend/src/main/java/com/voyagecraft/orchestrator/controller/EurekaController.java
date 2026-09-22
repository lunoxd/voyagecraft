package com.voyagecraft.orchestrator.controller;

import com.voyagecraft.orchestrator.dto.ApiResponse;
import com.voyagecraft.orchestrator.service.EurekaDiscoveryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@RestController
@RequestMapping("/api/v1/eureka")
@CrossOrigin(origins = "*")
public class EurekaController {

    private final EurekaDiscoveryService eurekaService;

    public EurekaController(EurekaDiscoveryService eurekaService) {
        this.eurekaService = eurekaService;
    }

    @GetMapping("/apps")
    public ResponseEntity<ApiResponse<Collection<EurekaDiscoveryService.MicroserviceRegistryEntry>>> getApps() {
        return ResponseEntity.ok(ApiResponse.ok("Eureka service registry fetched", eurekaService.getRegisteredServices(), "TRC-EUR"));
    }

    @PostMapping("/instances/{serviceId}/{instanceId}/toggle")
    public ResponseEntity<ApiResponse<Boolean>> toggleInstance(@PathVariable String serviceId, @PathVariable String instanceId) {
        boolean ok = eurekaService.toggleInstanceStatus(serviceId, instanceId);
        return ResponseEntity.ok(ApiResponse.ok("Instance status toggled", ok, "TRC-EUR-TGL"));
    }
}
