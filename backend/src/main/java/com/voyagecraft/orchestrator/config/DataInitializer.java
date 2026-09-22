package com.voyagecraft.orchestrator.config;

import com.voyagecraft.orchestrator.model.*;
import com.voyagecraft.orchestrator.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initDatabase(
            UserRepository userRepository,
            PackageRepository packageRepository,
            BookingRepository bookingRepository,
            PaymentRepository paymentRepository,
            SystemLogRepository logRepository) {
        return args -> {
            // Seed Users in SQL if empty
            if (userRepository.count() == 0) {
                userRepository.save(new UserEntity("USR-VC-ADMIN", "Alexander Wright", "alexander.wright@voyagecraft.internal", "Password123!", "ADMIN"));
                userRepository.save(new UserEntity("USR-VC-AGENT", "Elena Rostova", "elena.rostova@voyagecraft.internal", "Password123!", "AGENT"));
                userRepository.save(new UserEntity("USR-VC-TRAVELER", "Marcus Vance", "marcus.vance@voyagecraft.internal", "Password123!", "TRAVELER"));
                userRepository.save(new UserEntity("USR-VC-DEVOPS", "DevOps Engineer", "devops@voyagecraft.internal", "Password123!", "DEVOPS"));
            }

            // Seed Packages in SQL if empty (All prices in INR ₹)
            if (packageRepository.count() == 0) {
                TravelPackageEntity p1 = new TravelPackageEntity();
                p1.setId("PKG-EUR-01");
                p1.setCode("VC-EUR-LUX");
                p1.setTitle("Grand Euro-Alpine & Mediterranean Odyssey");
                p1.setSubtitle("Paris • Swiss Alps (Interlaken & Zermatt) • Venice • Florence • Rome");
                p1.setDescription("An ultra-exclusive trans-European expedition combining high-speed first-class rail, panoramic Alpine ascents, private gondola charters, and VIP Vatican museum night access.");
                p1.setDurationDays(12);
                p1.setTotalCapacity(20);
                p1.setBookedSlots(15);
                p1.setLockedSlots(1);
                p1.setBasePrice(349000);
                p1.setDeluxePrice(489000);
                p1.setVipPrice(649000);
                p1.setDepartureDates(List.of("2026-10-15", "2026-11-05", "2026-12-01", "2027-01-10"));
                p1.setInclusions(List.of(
                        "5-Star Heritage Hotel Suites",
                        "Executive First-Class Rail Passes",
                        "Dedicated Multilingual Concierge",
                        "Michelin-Starred Degustation Dinners",
                        "Full Baggage Portaging & Private Chauffeurs"
                ));
                p1.setExclusions(List.of("Personal International Airfare", "Custom Souvenirs"));
                p1.setStatus("ACTIVE");
                p1.setFeatured(true);
                p1.setCategory("LUXURY_EUROPE");
                p1.setImageUrl("/images/hero_swiss_alps.jpg");

                p1.addDestination(new DestinationEntity("Paris", "France", 3, List.of("Louvre Private Access", "Seine Yacht Dinner")));
                p1.addDestination(new DestinationEntity("Interlaken & Zermatt", "Switzerland", 4, List.of("Glacier Express", "Matterhorn Sunrise")));
                p1.addDestination(new DestinationEntity("Venice", "Italy", 2, List.of("Grand Canal Water Taxi", "Doge's Palace")));
                p1.addDestination(new DestinationEntity("Rome", "Italy", 3, List.of("Colosseum Underground", "Private Vatican Tour")));
                packageRepository.save(p1);

                TravelPackageEntity p2 = new TravelPackageEntity();
                p2.setId("PKG-JPN-02");
                p2.setCode("VC-JPN-ZEN");
                p2.setTitle("Imperial Shinkansen & Heritage Sanctuary");
                p2.setSubtitle("Tokyo • Hakone (Mt. Fuji) • Kyoto • Nara • Osaka Gastronomy");
                p2.setDescription("Immerse into the contrasting realms of futuristic neon megacities and sacred ancient shrines. Authentic Ryokan onsen stays with Kaiseki dining.");
                p2.setDurationDays(11);
                p2.setTotalCapacity(16);
                p2.setBookedSlots(13);
                p2.setLockedSlots(0);
                p2.setBasePrice(319000);
                p2.setDeluxePrice(429000);
                p2.setVipPrice(599000);
                p2.setDepartureDates(List.of("2026-10-20", "2026-11-12", "2026-11-28", "2026-12-18"));
                p2.setInclusions(List.of(
                        "Traditional Luxury Ryokans & 5★ Tokyo Towers",
                        "Gran Class Shinkansen Bullet Train Passes",
                        "Private Tea Ceremony with Urasenke Master",
                        "Daily Chef's Omakase & Kaiseki Banquets"
                ));
                p2.setExclusions(List.of("Flight transit to Tokyo", "Kimono Tailoring"));
                p2.setStatus("ACTIVE");
                p2.setFeatured(true);
                p2.setCategory("ASIAN_EXPEDITION");
                p2.setImageUrl("/images/pkg_kyoto.jpg");

                p2.addDestination(new DestinationEntity("Tokyo", "Japan", 3, List.of("Ginza Sushi Counter", "Shibuya Sky")));
                p2.addDestination(new DestinationEntity("Hakone", "Japan", 2, List.of("Private Onsen", "Lake Ashi Cruise")));
                p2.addDestination(new DestinationEntity("Kyoto", "Japan", 4, List.of("Fushimi Inari Sunrise", "Tea Ceremony")));
                p2.addDestination(new DestinationEntity("Osaka", "Japan", 2, List.of("Dotonbori Midnight Gourmet Walk")));
                packageRepository.save(p2);

                TravelPackageEntity p3 = new TravelPackageEntity();
                p3.setId("PKG-NOR-03");
                p3.setCode("VC-NOR-AUR");
                p3.setTitle("Arctic Auroras & Scandinavian Fjord Traverse");
                p3.setSubtitle("Oslo • Bergen • Flåm Railway • Tromsø Glass Igloos • Lofoten");
                p3.setDescription("Chasing the ethereal Northern Lights through pristine Nordic fjords, dog-sledding through frozen tundras, and sleeping under glass igloos.");
                p3.setDurationDays(10);
                p3.setTotalCapacity(12);
                p3.setBookedSlots(10);
                p3.setLockedSlots(1);
                p3.setBasePrice(399000);
                p3.setDeluxePrice(529000);
                p3.setVipPrice(719000);
                p3.setDepartureDates(List.of("2026-11-01", "2026-11-20", "2026-12-10", "2027-01-05"));
                p3.setInclusions(List.of(
                        "Geodesic Heated Glass Igloos & Fjord Suites",
                        "Electric Eco-Cruises & Flåm Scenic Rail",
                        "Thermal Arctic Expedition Parkas Provided",
                        "Aurora Alert Radar Monitoring Service"
                ));
                p3.setExclusions(List.of("Cold-weather specialty footwear", "Alcoholic cellars"));
                p3.setStatus("LIMITED");
                p3.setFeatured(true);
                p3.setCategory("NORDIC_SAFARI");
                p3.setImageUrl("/images/pkg_norway.jpg");

                p3.addDestination(new DestinationEntity("Oslo", "Norway", 2, List.of("Munch Museum", "Opera House")));
                p3.addDestination(new DestinationEntity("Bergen", "Norway", 3, List.of("Flåm Railway", "Nærøyfjord Cruise")));
                p3.addDestination(new DestinationEntity("Tromsø", "Norway", 3, List.of("Glass Igloo Aurora Glamping", "Husky Sledding")));
                p3.addDestination(new DestinationEntity("Lofoten", "Norway", 2, List.of("Reine Fishing Village", "Midnight Aurora Excursion")));
                packageRepository.save(p3);

                TravelPackageEntity p4 = new TravelPackageEntity();
                p4.setId("PKG-ALP-04");
                p4.setCode("VC-ALP-SKI");
                p4.setTitle("St. Moritz, Dolomites & Austrian Summit Royale");
                p4.setSubtitle("St. Moritz • Cortina d'Ampezzo • Innsbruck • Salzburg • Vienna");
                p4.setDescription("The quintessential luxury Alpine winter and summer circuit, celebrating majestic peaks, classical symphony halls, and world-renowned ski chalets.");
                p4.setDurationDays(10);
                p4.setTotalCapacity(14);
                p4.setBookedSlots(14);
                p4.setLockedSlots(0);
                p4.setBasePrice(429000);
                p4.setDeluxePrice(569000);
                p4.setVipPrice(779000);
                p4.setDepartureDates(List.of("2026-12-15", "2027-01-08", "2027-02-01"));
                p4.setInclusions(List.of(
                        "Leading Hotels of the World Alpine Chalets",
                        "Private Ski Instructor & Heli-Sightseeing Pass",
                        "Vienna Philharmonic Opera Box Access"
                ));
                p4.setExclusions(List.of("Custom Ski Equipment Rental"));
                p4.setStatus("SOLD_OUT");
                p4.setFeatured(false);
                p4.setCategory("ALPINE_ESCORT");
                p4.setImageUrl("/images/pkg_dolomites.jpg");

                p4.addDestination(new DestinationEntity("St. Moritz", "Switzerland", 3, List.of("Badrutt's Palace", "Corviglia Peak")));
                p4.addDestination(new DestinationEntity("Cortina d'Ampezzo", "Italy", 3, List.of("Tre Cime di Lavaredo", "Mountain Gastronomy")));
                p4.addDestination(new DestinationEntity("Innsbruck", "Austria", 2, List.of("Golden Roof", "Mozart Chamber Concert")));
                p4.addDestination(new DestinationEntity("Vienna", "Austria", 2, List.of("Schönbrunn Gala", "State Opera")));
                packageRepository.save(p4);
            }

            // Seed Initial Bookings
            if (bookingRepository.count() == 0) {
                BookingEntity b1 = new BookingEntity();
                b1.setId("BK-901824-A");
                b1.setPnr("VC-89412X");
                b1.setPackageId("PKG-EUR-01");
                b1.setPackageName("Grand Euro-Alpine & Mediterranean Odyssey");
                b1.setTravelerName("Evelyn Sterling");
                b1.setTravelerEmail("evelyn.sterling@voyagecraft.internal");
                b1.setTravelerPhone("+44 20 7946 0912");
                b1.setPassportNo("GBR-99210481");
                b1.setSeats(2);
                b1.setDepartureDate("2026-10-15");
                b1.setTier("DELUXE");
                b1.setTotalAmount(978000.0);
                b1.setBookingStatus("CONFIRMED");
                b1.setPaymentStatus("PAID");
                b1.setTransactionId("TXN-7782190-X");
                b1.setReceiptNumber("RCPT-2026-8912");
                b1.setSpecialRequests("First class panoramic window seating, vegetarian culinary preferences.");
                bookingRepository.save(b1);

                PaymentTransactionEntity tx1 = new PaymentTransactionEntity();
                tx1.setId("TXN-7782190-X");
                tx1.setReceiptNumber("RCPT-2026-8912");
                tx1.setBookingId("BK-901824-A");
                tx1.setPnr("VC-89412X");
                tx1.setTravelerName("Evelyn Sterling");
                tx1.setAmount(978000.0);
                tx1.setMethod("CREDIT_CARD");
                tx1.setStatus("SUCCESS");
                tx1.setIdempotencyKey("IDEM-VC-89412X-001");
                tx1.setAuthCode("AUTH-910283");
                tx1.setCardLast4("4092");
                paymentRepository.save(tx1);
            }

            // Seed System Log
            if (logRepository.count() == 0) {
                logRepository.save(new SystemLogEntity(
                        "EUREKA-SERVER",
                        "TRC-INIT-01",
                        "SUCCESS",
                        "Eureka Service Registry initialized. 6 microservices registered on H2 SQL DB."
                ));
            }
        };
    }
}
