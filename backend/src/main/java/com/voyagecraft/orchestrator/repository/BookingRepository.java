package com.voyagecraft.orchestrator.repository;

import com.voyagecraft.orchestrator.model.BookingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<BookingEntity, String> {
    Optional<BookingEntity> findByPnr(String pnr);
    List<BookingEntity> findByTravelerEmail(String travelerEmail);
}
