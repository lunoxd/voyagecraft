package com.voyagecraft.orchestrator.service;

import com.voyagecraft.orchestrator.model.BookingEntity;
import com.voyagecraft.orchestrator.repository.BookingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public List<BookingEntity> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Optional<BookingEntity> getBookingById(String id) {
        return bookingRepository.findById(id);
    }

    public Optional<BookingEntity> getBookingByPnr(String pnr) {
        return bookingRepository.findByPnr(pnr);
    }

    public BookingEntity saveBooking(BookingEntity booking) {
        if (booking.getId() == null) {
            booking.setId("BK-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        }
        if (booking.getPnr() == null) {
            booking.setPnr("VC-" + (int)(10000 + Math.random() * 90000) + "A");
        }
        return bookingRepository.save(booking);
    }

    public boolean cancelBooking(String bookingId) {
        Optional<BookingEntity> opt = bookingRepository.findById(bookingId);
        if (opt.isPresent()) {
            BookingEntity booking = opt.get();
            booking.setBookingStatus("CANCELLED");
            booking.setPaymentStatus("REFUNDED");
            bookingRepository.save(booking);
            return true;
        }
        return false;
    }
}
