package com.voyagecraft.orchestrator.model;

import java.util.List;

public class Destination {
    private String city;
    private String country;
    private int nights;
    private List<String> highlights;

    public Destination() {}

    public Destination(String city, String country, int nights, List<String> highlights) {
        this.city = city;
        this.country = country;
        this.nights = nights;
        this.highlights = highlights;
    }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public int getNights() { return nights; }
    public void setNights(int nights) { this.nights = nights; }

    public List<String> getHighlights() { return highlights; }
    public void setHighlights(List<String> highlights) { this.highlights = highlights; }
}
