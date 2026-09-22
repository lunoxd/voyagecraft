package com.voyagecraft.orchestrator.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "bookings")
public class BookingEntity {

    @Id
    private String id;

    @Column(nullable = false, unique = true)
    private String pnr;

    @Column(nullable = false)
    private String packageId;

    @Column(nullable = false)
    private String packageName;

    @Column(nullable = false)
    private String travelerName;

    @Column(nullable = false)
    private String travelerEmail;

    private String travelerPhone;
    private String passportNo;
    private int seats;
    private String departureDate;
    private String tier; // STANDARD, DELUXE, VIP
    private double totalAmount;
    private String bookingStatus; // CONFIRMED, CANCELLED, PENDING
    private String paymentStatus; // PAID, REFUNDED, FAILED
    private String transactionId;
    private String receiptNumber;
    private String createdAt;
    private String specialRequests;

    public BookingEntity() {
        this.createdAt = Instant.now().toString();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPnr() { return pnr; }
    public void setPnr(String pnr) { this.pnr = pnr; }

    public String getPackageId() { return packageId; }
    public void setPackageId(String packageId) { this.packageId = packageId; }

    public String getPackageName() { return packageName; }
    public void setPackageName(String packageName) { this.packageName = packageName; }

    public String getTravelerName() { return travelerName; }
    public void setTravelerName(String travelerName) { this.travelerName = travelerName; }

    public String getTravelerEmail() { return travelerEmail; }
    public void setTravelerEmail(String travelerEmail) { this.travelerEmail = travelerEmail; }

    public String getTravelerPhone() { return travelerPhone; }
    public void setTravelerPhone(String travelerPhone) { this.travelerPhone = travelerPhone; }

    public String getPassportNo() { return passportNo; }
    public void setPassportNo(String passportNo) { this.passportNo = passportNo; }

    public int getSeats() { return seats; }
    public void setSeats(int seats) { this.seats = seats; }

    public String getDepartureDate() { return departureDate; }
    public void setDepartureDate(String departureDate) { this.departureDate = departureDate; }

    public String getTier() { return tier; }
    public void setTier(String tier) { this.tier = tier; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public String getBookingStatus() { return bookingStatus; }
    public void setBookingStatus(String bookingStatus) { this.bookingStatus = bookingStatus; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public String getReceiptNumber() { return receiptNumber; }
    public void setReceiptNumber(String receiptNumber) { this.receiptNumber = receiptNumber; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getSpecialRequests() { return specialRequests; }
    public void setSpecialRequests(String specialRequests) { this.specialRequests = specialRequests; }
}
