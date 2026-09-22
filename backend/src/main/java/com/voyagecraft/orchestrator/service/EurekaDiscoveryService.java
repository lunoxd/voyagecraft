package com.voyagecraft.orchestrator.service;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class EurekaDiscoveryService {

    public static class ServiceInstanceInfo {
        private String instanceId;
        private String ip;
        private int port;
        private String status; // UP, DOWN
        private String zone;
        private int weight;
        private int latencyMs;
        private int cpuPercent;

        public ServiceInstanceInfo(String instanceId, String ip, int port, String status, String zone, int weight, int latencyMs, int cpuPercent) {
            this.instanceId = instanceId;
            this.ip = ip;
            this.port = port;
            this.status = status;
            this.zone = zone;
            this.weight = weight;
            this.latencyMs = latencyMs;
            this.cpuPercent = cpuPercent;
        }

        public String getInstanceId() { return instanceId; }
        public void setInstanceId(String instanceId) { this.instanceId = instanceId; }
        public String getIp() { return ip; }
        public int getPort() { return port; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getZone() { return zone; }
        public int getWeight() { return weight; }
        public int getLatencyMs() { return latencyMs; }
        public int getCpuPercent() { return cpuPercent; }
    }

    public static class MicroserviceRegistryEntry {
        private String serviceId;
        private String name;
        private String version;
        private List<ServiceInstanceInfo> instances;

        public MicroserviceRegistryEntry(String serviceId, String name, String version, List<ServiceInstanceInfo> instances) {
            this.serviceId = serviceId;
            this.name = name;
            this.version = version;
            this.instances = instances;
        }

        public String getServiceId() { return serviceId; }
        public String getName() { return name; }
        public String getVersion() { return version; }
        public List<ServiceInstanceInfo> getInstances() { return instances; }
    }

    private final Map<String, MicroserviceRegistryEntry> registry = new ConcurrentHashMap<>();

    public EurekaDiscoveryService() {
        registry.put("PACKAGE-SERVICE", new MicroserviceRegistryEntry(
                "PACKAGE-SERVICE", "Package Catalog & Inventory Service", "v3.0.1",
                new ArrayList<>(List.of(
                        new ServiceInstanceInfo("package-node-a", "10.0.4.11", 8082, "UP", "us-east-1a", 70, 14, 22),
                        new ServiceInstanceInfo("package-node-b", "10.0.4.12", 8083, "UP", "us-east-1b", 30, 16, 18)
                ))
        ));

        registry.put("BOOKING-SERVICE", new MicroserviceRegistryEntry(
                "BOOKING-SERVICE", "Reservation Orchestrator Service", "v2.9.0",
                new ArrayList<>(List.of(
                        new ServiceInstanceInfo("booking-node-a", "10.0.5.31", 8084, "UP", "us-east-1a", 50, 18, 34),
                        new ServiceInstanceInfo("booking-node-b", "10.0.5.32", 8085, "UP", "us-east-1b", 50, 19, 31)
                ))
        ));

        registry.put("PAYMENT-SERVICE", new MicroserviceRegistryEntry(
                "PAYMENT-SERVICE", "Financial Settlement & Payment Gateway", "v2.6.2",
                new ArrayList<>(List.of(
                        new ServiceInstanceInfo("payment-node-01", "10.0.6.40", 8086, "UP", "us-east-1a", 100, 24, 29)
                ))
        ));

        registry.put("AUTH-SERVICE", new MicroserviceRegistryEntry(
                "AUTH-SERVICE", "JWT Authentication & Security Service", "v2.4.0",
                new ArrayList<>(List.of(
                        new ServiceInstanceInfo("auth-node-01", "10.0.3.21", 8081, "UP", "us-east-1a", 100, 11, 18)
                ))
        ));
    }

    public Collection<MicroserviceRegistryEntry> getRegisteredServices() {
        return registry.values();
    }

    public boolean toggleInstanceStatus(String serviceId, String instanceId) {
        MicroserviceRegistryEntry entry = registry.get(serviceId);
        if (entry != null) {
            for (ServiceInstanceInfo inst : entry.getInstances()) {
                if (inst.getInstanceId().equals(instanceId)) {
                    inst.setStatus("UP".equals(inst.getStatus()) ? "DOWN" : "UP");
                    return true;
                }
            }
        }
        return false;
    }
}
