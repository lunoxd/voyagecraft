package com.voyagecraft.orchestrator.model;

import java.util.List;

public class TravelPackage {
    private String id;
    private String code;
    private String title;
    private String subtitle;
    private String description;
    private List<Destination> destinations;
    private int durationDays;
    private int totalCapacity;
    private int bookedSlots;
    private int lockedSlots;
    private double basePrice;
    private double deluxePrice;
    private double vipPrice;
    private List<String> departureDates;
    private List<String> inclusions;
    private List<String> exclusions;
    private String status; // ACTIVE, LIMITED, SOLD_OUT
    private boolean featured;
    private String category;

    public TravelPackage() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<Destination> getDestinations() { return destinations; }
    public void setDestinations(List<Destination> destinations) { this.destinations = destinations; }

    public int getDurationDays() { return durationDays; }
    public void setDurationDays(int durationDays) { this.durationDays = durationDays; }

    public int getTotalCapacity() { return totalCapacity; }
    public void setTotalCapacity(int totalCapacity) { this.totalCapacity = totalCapacity; }

    public int getBookedSlots() { return bookedSlots; }
    public void setBookedSlots(int bookedSlots) { this.bookedSlots = bookedSlots; }

    public int getLockedSlots() { return lockedSlots; }
    public void setLockedSlots(int lockedSlots) { this.lockedSlots = lockedSlots; }

    public double getBasePrice() { return basePrice; }
    public void setBasePrice(double basePrice) { this.basePrice = basePrice; }

    public double getDeluxePrice() { return deluxePrice; }
    public void setDeluxePrice(double deluxePrice) { this.deluxePrice = deluxePrice; }

    public double getVipPrice() { return vipPrice; }
    public void setVipPrice(double vipPrice) { this.vipPrice = vipPrice; }

    public List<String> getDepartureDates() { return departureDates; }
    public void setDepartureDates(List<String> departureDates) { this.departureDates = departureDates; }

    public List<String> getInclusions() { return inclusions; }
    public void setInclusions(List<String> inclusions) { this.inclusions = inclusions; }

    public List<String> getExclusions() { return exclusions; }
    public void setExclusions(List<String> exclusions) { this.exclusions = exclusions; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}
