package com.voyagecraft.orchestrator.repository;

import com.voyagecraft.orchestrator.model.SystemLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SystemLogRepository extends JpaRepository<SystemLogEntity, Long> {
    List<SystemLogEntity> findTop100ByOrderByTimestampDesc();
}
