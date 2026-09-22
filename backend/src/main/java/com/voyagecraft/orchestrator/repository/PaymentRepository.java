package com.voyagecraft.orchestrator.repository;

import com.voyagecraft.orchestrator.model.PaymentTransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentTransactionEntity, String> {
    Optional<PaymentTransactionEntity> findByBookingId(String bookingId);
    Optional<PaymentTransactionEntity> findByReceiptNumber(String receiptNumber);
    List<PaymentTransactionEntity> findByStatus(String status);
}
