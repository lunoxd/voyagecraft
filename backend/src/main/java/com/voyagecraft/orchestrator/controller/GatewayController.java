package com.voyagecraft.orchestrator.controller;

import com.voyagecraft.orchestrator.dto.ApiResponse;
import com.voyagecraft.orchestrator.service.GatewayRoutingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/gateway")
@CrossOrigin(origins = "*")
public class GatewayController {

    private final GatewayRoutingService gatewayService;

    public GatewayController(GatewayRoutingService gatewayService) {
        this.gatewayService = gatewayService;
    }

    @GetMapping("/routes")
    public ResponseEntity<ApiResponse<List<GatewayRoutingService.RouteDefinition>>> getRoutes() {
        return ResponseEntity.ok(ApiResponse.ok("Gateway routes loaded", gatewayService.getRoutes(), "TRC-GW-RT"));
    }

    @PostMapping("/strategy")
    public ResponseEntity<ApiResponse<String>> setStrategy(@RequestParam String strategy) {
        gatewayService.setLoadBalancerStrategy(strategy);
        return ResponseEntity.ok(ApiResponse.ok("Load balancer strategy updated", strategy, "TRC-GW-ST"));
    }
}
