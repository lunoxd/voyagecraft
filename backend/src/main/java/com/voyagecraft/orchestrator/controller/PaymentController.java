package com.voyagecraft.orchestrator.controller;

import com.voyagecraft.orchestrator.dto.ApiResponse;
import com.voyagecraft.orchestrator.model.PaymentTransactionEntity;
import com.voyagecraft.orchestrator.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<List<PaymentTransactionEntity>>> getAllTransactions() {
        return ResponseEntity.ok(ApiResponse.ok("Financial transactions ledger retrieved from SQL", paymentService.getAllTransactions(), "TRC-PAY-" + UUID.randomUUID().toString().substring(0, 6)));
    }
}
