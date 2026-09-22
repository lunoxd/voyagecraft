package com.voyagecraft.orchestrator.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "system_logs")
public class SystemLogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String timestamp;

    @Column(nullable = false)
    private String service;

    private String traceId;
    private String level; // INFO, WARN, ERROR, SUCCESS

    @Column(length = 2000)
    private String message;

    public SystemLogEntity() {
        this.timestamp = Instant.now().toString();
    }

    public SystemLogEntity(String service, String traceId, String level, String message) {
        this.timestamp = Instant.now().toString();
        this.service = service;
        this.traceId = traceId;
        this.level = level;
        this.message = message;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public String getService() { return service; }
    public void setService(String service) { this.service = service; }

    public String getTraceId() { return traceId; }
    public void setTraceId(String traceId) { this.traceId = traceId; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
