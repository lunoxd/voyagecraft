package com.voyagecraft.orchestrator.service;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class GatewayRoutingService {

    public static class RouteDefinition {
        private String id;
        private String pathPattern;
        private String serviceId;
        private List<String> methods;
        private int rateLimitPerMin;
        private boolean requiresAuth;
        private long totalRouted;
        private boolean enabled;

        public RouteDefinition(String id, String pathPattern, String serviceId, List<String> methods, int rateLimitPerMin, boolean requiresAuth) {
            this.id = id;
            this.pathPattern = pathPattern;
            this.serviceId = serviceId;
            this.methods = methods;
            this.rateLimitPerMin = rateLimitPerMin;
            this.requiresAuth = requiresAuth;
            this.totalRouted = 10000;
            this.enabled = true;
        }

        public String getId() { return id; }
        public String getPathPattern() { return pathPattern; }
        public String getServiceId() { return serviceId; }
        public List<String> getMethods() { return methods; }
        public int getRateLimitPerMin() { return rateLimitPerMin; }
        public boolean isRequiresAuth() { return requiresAuth; }
        public long getTotalRouted() { return totalRouted; }
        public void incrementRouted() { this.totalRouted++; }
        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
    }

    private final List<RouteDefinition> routes = new ArrayList<>(List.of(
            new RouteDefinition("RT-01", "/api/v1/packages/**", "PACKAGE-SERVICE", List.of("GET", "POST"), 1200, false),
            new RouteDefinition("RT-02", "/api/v1/bookings/**", "BOOKING-SERVICE", List.of("GET", "POST", "PATCH"), 600, true),
            new RouteDefinition("RT-03", "/api/v1/payments/**", "PAYMENT-SERVICE", List.of("POST", "GET"), 400, true),
            new RouteDefinition("RT-04", "/api/v1/auth/**", "AUTH-SERVICE", List.of("POST", "GET"), 800, false)
    ));

    private String loadBalancerStrategy = "ROUND_ROBIN";

    public List<RouteDefinition> getRoutes() { return routes; }
    public String getLoadBalancerStrategy() { return loadBalancerStrategy; }
    public void setLoadBalancerStrategy(String strategy) { this.loadBalancerStrategy = strategy; }
}
