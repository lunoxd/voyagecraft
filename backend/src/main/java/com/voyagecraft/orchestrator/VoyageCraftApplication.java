package com.voyagecraft.orchestrator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class VoyageCraftApplication {

    public static void main(String[] args) {
        System.out.println("==================================================================");
        System.out.println("   VOYAGECRAFT TRAVEL GROUP - PS030 ORCHESTRATION ENGINE");
        System.out.println("   Spring Boot & Maven Microservices Backend Active");
        System.out.println("==================================================================");
        SpringApplication.run(VoyageCraftApplication.class, args);
    }
}
