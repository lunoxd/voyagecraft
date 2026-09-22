package com.voyagecraft.orchestrator.repository;

import com.voyagecraft.orchestrator.model.TravelPackageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PackageRepository extends JpaRepository<TravelPackageEntity, String> {
    Optional<TravelPackageEntity> findByCode(String code);
    List<TravelPackageEntity> findByCategory(String category);
}
