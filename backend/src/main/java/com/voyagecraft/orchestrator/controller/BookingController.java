package com.voyagecraft.orchestrator.controller;

import com.voyagecraft.orchestrator.dto.ApiResponse;
import com.voyagecraft.orchestrator.dto.BookingRequest;
import com.voyagecraft.orchestrator.model.BookingEntity;
import com.voyagecraft.orchestrator.service.BookingService;
import com.voyagecraft.orchestrator.service.SagaOrchestratorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;
    private final SagaOrchestratorService sagaOrchestratorService;

    public BookingController(BookingService bookingService, SagaOrchestratorService sagaOrchestratorService) {
        this.bookingService = bookingService;
        this.sagaOrchestratorService = sagaOrchestratorService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BookingEntity>>> getAllBookings() {
        return ResponseEntity.ok(ApiResponse.ok("Active bookings retrieved from SQL", bookingService.getAllBookings(), "TRC-BK-ALL"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingEntity>> getBookingById(@PathVariable String id) {
        return bookingService.getBookingById(id)
                .map(b -> ResponseEntity.ok(ApiResponse.ok("Booking record retrieved", b, "TRC-BK-ID")))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BookingEntity>> createBooking(@RequestBody BookingRequest request) {
        String traceId = "TRC-SAGA-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        try {
            BookingEntity booking = sagaOrchestratorService.executeBookingSaga(request, traceId);
            return ResponseEntity.ok(ApiResponse.ok("Reservation orchestrated and persisted to SQL successfully", booking, traceId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.fail(e.getMessage(), traceId));
        }
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelBooking(@PathVariable String id) {
        try {
            sagaOrchestratorService.executeCancellationSaga(id);
            return ResponseEntity.ok(ApiResponse.ok("Reservation cancelled, refund dispatched, SQL inventory restored", null, "TRC-CNL"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.fail(e.getMessage(), "TRC-CNL-ERR"));
        }
    }
}
