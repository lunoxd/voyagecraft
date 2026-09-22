package com.voyagecraft.orchestrator.dto;

public class BookingRequest {
    private String packageId;
    private String travelerName;
    private String travelerEmail;
    private String travelerPhone;
    private String passportNo;
    private int seats;
    private String departureDate;
    private String tier; // STANDARD, DELUXE, VIP
    private String paymentMethod; // CREDIT_CARD, BANK_WIRE, CORPORATE_INVOICE, CRYPTO_ESCROW
    private String specialRequests;

    public BookingRequest() {}

    public String getPackageId() { return packageId; }
    public void setPackageId(String packageId) { this.packageId = packageId; }

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

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getSpecialRequests() { return specialRequests; }
    public void setSpecialRequests(String specialRequests) { this.specialRequests = specialRequests; }
}
