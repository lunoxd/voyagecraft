package com.voyagecraft.orchestrator.service;

import com.voyagecraft.orchestrator.dto.BookingRequest;
import com.voyagecraft.orchestrator.model.BookingEntity;
import com.voyagecraft.orchestrator.model.PaymentTransactionEntity;
import com.voyagecraft.orchestrator.model.TravelPackageEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class SagaOrchestratorService {

    private final PackageService packageService;
    private final BookingService bookingService;
    private final PaymentService paymentService;

    public SagaOrchestratorService(PackageService packageService, BookingService bookingService, PaymentService paymentService) {
        this.packageService = packageService;
        this.bookingService = bookingService;
        this.paymentService = paymentService;
    }

    public BookingEntity executeBookingSaga(BookingRequest request, String traceId) {
        TravelPackageEntity pkg = packageService.getPackageById(request.getPackageId())
                .orElseThrow(() -> new IllegalArgumentException("Package not found: " + request.getPackageId()));

        // Step 1: Atomic Hold Lock in SQL Package Service
        boolean lockAcquired = packageService.acquireAtomicLock(request.getPackageId(), request.getSeats());
        if (!lockAcquired) {
            throw new IllegalStateException("Overbooking prevented: insufficient package capacity.");
        }

        String pnr = "VC-" + (int)(10000 + Math.random() * 90000) + "A";
        String bookingId = "BK-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        try {
            // Step 2: Calculate Pricing
            double pricePerSeat = "VIP".equalsIgnoreCase(request.getTier()) ? pkg.getVipPrice()
                    : "DELUXE".equalsIgnoreCase(request.getTier()) ? pkg.getDeluxePrice() : pkg.getBasePrice();
            double totalAmount = pricePerSeat * request.getSeats();

            // Step 3: Payment Capture & Settlement persisted to SQL
            PaymentTransactionEntity txn = paymentService.processPayment(
                    bookingId, pnr, request.getTravelerName(), totalAmount, request.getPaymentMethod());

            // Step 4: Finalize Booking Record persisted to SQL
            BookingEntity booking = new BookingEntity();
            booking.setId(bookingId);
            booking.setPnr(pnr);
            booking.setPackageId(pkg.getId());
            booking.setPackageName(pkg.getTitle());
            booking.setTravelerName(request.getTravelerName());
            booking.setTravelerEmail(request.getTravelerEmail());
            booking.setTravelerPhone(request.getTravelerPhone());
            booking.setPassportNo(request.getPassportNo());
            booking.setSeats(request.getSeats());
            booking.setDepartureDate(request.getDepartureDate());
            booking.setTier(request.getTier() != null ? request.getTier() : "STANDARD");
            booking.setTotalAmount(totalAmount);
            booking.setBookingStatus("CONFIRMED");
            booking.setPaymentStatus("PAID");
            booking.setTransactionId(txn.getId());
            booking.setReceiptNumber(txn.getReceiptNumber());
            booking.setSpecialRequests(request.getSpecialRequests());

            BookingEntity savedBooking = bookingService.saveBooking(booking);

            // Step 5: Commit Inventory Deduction in SQL Package Service
            packageService.commitBooking(pkg.getId(), request.getSeats());

            return savedBooking;
        } catch (Exception e) {
            // SAGA COMPENSATION: Release temporary lock
            packageService.releaseLock(request.getPackageId(), request.getSeats());
            throw new RuntimeException("Saga Execution Failed, compensating rollback applied: " + e.getMessage(), e);
        }
    }

    public boolean executeCancellationSaga(String bookingId) {
        BookingEntity booking = bookingService.getBookingById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        bookingService.cancelBooking(bookingId);
        paymentService.refundTransaction(bookingId);
        packageService.restoreInventory(booking.getPackageId(), booking.getSeats());

        return true;
    }
}
