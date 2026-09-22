package com.voyagecraft.orchestrator;

import com.voyagecraft.orchestrator.dto.BookingRequest;
import com.voyagecraft.orchestrator.model.BookingEntity;
import com.voyagecraft.orchestrator.security.JwtUtil;
import com.voyagecraft.orchestrator.service.PackageService;
import com.voyagecraft.orchestrator.service.SagaOrchestratorService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class VoyageCraftApplicationTests {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PackageService packageService;

    @Autowired
    private SagaOrchestratorService sagaOrchestratorService;

    @Test
    void contextLoads() {
        assertNotNull(jwtUtil);
        assertNotNull(packageService);
        assertNotNull(sagaOrchestratorService);
    }

    @Test
    void testJwtTokenGenerationAndValidation() {
        String username = "alexander.wright@voyagecraft.internal";
        String token = jwtUtil.generateToken(username, "ADMIN", List.of("packages:write", "system:manage"));

        assertNotNull(token);
        assertTrue(jwtUtil.validateToken(token));
        assertEquals(username, jwtUtil.extractUsername(token));
        assertEquals("ADMIN", jwtUtil.extractRole(token));
    }

    @Test
    void testAtomicCapacityAndOverbookingPrevention() {
        String packageId = "PKG-EUR-01";
        // Attempt to lock an excessively large number of seats
        boolean lockAcquired = packageService.acquireAtomicLock(packageId, 999);
        assertFalse(lockAcquired, "Should prevent overbooking when seats exceed available capacity");
    }

    @Test
    void testSagaHappyPathBooking() {
        BookingRequest request = new BookingRequest();
        request.setPackageId("PKG-JPN-02");
        request.setTravelerName("Unit Test Traveler");
        request.setTravelerEmail("traveler@test.com");
        request.setTravelerPhone("+15550001111");
        request.setPassportNo("US12345678");
        request.setSeats(1);
        request.setDepartureDate("2026-10-20");
        request.setTier("VIP");
        request.setPaymentMethod("CREDIT_CARD");

        BookingEntity booking = sagaOrchestratorService.executeBookingSaga(request, "TRC-TEST-SAGA");
        assertNotNull(booking);
        assertEquals("CONFIRMED", booking.getBookingStatus());
        assertEquals("PAID", booking.getPaymentStatus());
        assertNotNull(booking.getPnr());
    }
}
