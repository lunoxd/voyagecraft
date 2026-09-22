package com.voyagecraft.orchestrator.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "packages")
public class TravelPackageEntity {

    @Id
    private String id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String title;

    private String subtitle;

    @Column(length = 2000)
    private String description;

    @OneToMany(mappedBy = "travelPackage", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<DestinationEntity> destinations = new ArrayList<>();

    private int durationDays;
    private int totalCapacity;
    private int bookedSlots;
    private int lockedSlots;
    private double basePrice;
    private double deluxePrice;
    private double vipPrice;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "package_departure_dates", joinColumns = @JoinColumn(name = "package_id"))
    @Column(name = "departure_date")
    private List<String> departureDates = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "package_inclusions", joinColumns = @JoinColumn(name = "package_id"))
    @Column(name = "inclusion")
    private List<String> inclusions = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "package_exclusions", joinColumns = @JoinColumn(name = "package_id"))
    @Column(name = "exclusion")
    private List<String> exclusions = new ArrayList<>();

    private String status; // ACTIVE, LIMITED, SOLD_OUT
    private boolean featured;
    private String category;
    private String imageUrl;

    public TravelPackageEntity() {}

    public void addDestination(DestinationEntity d) {
        destinations.add(d);
        d.setTravelPackage(this);
    }

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

    public List<DestinationEntity> getDestinations() { return destinations; }
    public void setDestinations(List<DestinationEntity> destinations) { this.destinations = destinations; }

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

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
