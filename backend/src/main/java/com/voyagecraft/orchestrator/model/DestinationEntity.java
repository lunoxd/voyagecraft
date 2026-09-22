package com.voyagecraft.orchestrator.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "destinations")
public class DestinationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "package_id")
    @JsonIgnore
    private TravelPackageEntity travelPackage;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String country;

    private int nights;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "destination_highlights", joinColumns = @JoinColumn(name = "destination_id"))
    @Column(name = "highlight")
    private List<String> highlights;

    public DestinationEntity() {}

    public DestinationEntity(String city, String country, int nights, List<String> highlights) {
        this.city = city;
        this.country = country;
        this.nights = nights;
        this.highlights = highlights;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public TravelPackageEntity getTravelPackage() { return travelPackage; }
    public void setTravelPackage(TravelPackageEntity travelPackage) { this.travelPackage = travelPackage; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public int getNights() { return nights; }
    public void setNights(int nights) { this.nights = nights; }

    public List<String> getHighlights() { return highlights; }
    public void setHighlights(List<String> highlights) { this.highlights = highlights; }
}
