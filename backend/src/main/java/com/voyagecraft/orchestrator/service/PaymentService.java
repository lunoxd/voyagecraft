package com.voyagecraft.orchestrator.service;

import com.voyagecraft.orchestrator.model.PaymentTransactionEntity;
import com.voyagecraft.orchestrator.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public List<PaymentTransactionEntity> getAllTransactions() {
        return paymentRepository.findAll();
    }

    public PaymentTransactionEntity processPayment(String bookingId, String pnr, String travelerName, double amount, String method) {
        PaymentTransactionEntity txn = new PaymentTransactionEntity();
        txn.setId("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        txn.setReceiptNumber("RCPT-2026-" + (int)(1000 + Math.random() * 9000));
        txn.setBookingId(bookingId);
        txn.setPnr(pnr);
        txn.setTravelerName(travelerName);
        txn.setAmount(amount);
        txn.setMethod(method != null ? method : "CREDIT_CARD");
        txn.setStatus("SUCCESS");
        txn.setIdempotencyKey("IDEM-" + pnr + "-" + System.currentTimeMillis());
        txn.setAuthCode("AUTH-" + (int)(100000 + Math.random() * 900000));
        txn.setCardLast4(method != null && method.contains("CARD") ? "4092" : null);

        return paymentRepository.save(txn);
    }

    public boolean refundTransaction(String bookingId) {
        Optional<PaymentTransactionEntity> opt = paymentRepository.findByBookingId(bookingId);
        if (opt.isPresent()) {
            PaymentTransactionEntity txn = opt.get();
            txn.setStatus("REFUNDED");
            paymentRepository.save(txn);
            return true;
        }
        return false;
    }
}
