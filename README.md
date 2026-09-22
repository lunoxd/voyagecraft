# VoyageCraft • Ultra-Luxury Travel Orchestration Platform

[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4.0-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![WebGL](https://img.shields.io/badge/WebGL2-Shader_Grainient-990000?style=for-the-badge&logo=webgl&logoColor=white)](https://www.khronos.org/webgl/)

> **VoyageCraft** is a mission-critical, enterprise-grade multi-destination expedition reservation and luxury travel orchestration system. Engineered with a Spring Boot distributed microservices architecture (Eureka Registry, Cloud Gateway, Saga Orchestrator, Concurrency-Safe Inventory Escrow) and a cutting-edge React 19 frontend governed by foundational UX Laws.

---

## 🏛️ Architectural Overview

```
                          ┌──────────────────────────┐
                          │   React 19 Web Client    │
                          │ (WebGL Grainient + GSAP) │
                          └─────────────┬────────────┘
                                        │ (HTTP / REST / SSE)
                                        ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                    Spring Cloud API Gateway (Port 8080)                    │
│      [ JWT Claims Verification • Rate Limiter • Global Route Matrix ]      │
└───────────────────────┬────────────────────────────┬───────────────────────┘
                        │                            │
        ┌───────────────┴───────────────┐            │
        ▼                               ▼            ▼
┌──────────────┐                 ┌──────────────┐ ┌──────────────────────────┐
│ Eureka Naming│                 │ Distributed  │ │  Microservices Cluster   │
│ & Discovery  │                 │  Saga Engine │ │  - Package Service: 8082 │
│ (Port 8761)  │                 │  Orchestrator│ │  - Booking Service: 8081 │
└──────────────┘                 └──────────────┘ │  - Payment Service: 8083 │
                                                  └──────────────────────────┘
```

---

## 💎 Design System & UX Laws Implementation

VoyageCraft was meticulously crafted applying fundamental Human-Computer Interaction (HCI) laws and Google Material / Web Vitals principles:

1. **Fitts's Law (Target Accessibility & Touch Zones)**:
   - Primary action buttons, floating Apple-style pill navigation bar, and booking triggers meet or exceed minimum touch target dimensions (48×48px) with high visual affordance.
2. **Hick's Law (Decision Time Optimization)**:
   - Streamlined 4-step booking wizard with categorized progressive disclosure, eliminating cognitive overload during multi-day tour customizations.
3. **Jakob's Law (Familiar Mental Models)**:
   - Standardized e-commerce and luxury travel reservation conventions (real-time seat quota badges, dynamic price tier toggling, immediate receipt generation with persistent PNR).
4. **Miller's Law & Law of Proximity (Information Chunking)**:
   - Itinerary stops, luxury inclusions, hotel accommodations, and flight logistics grouped into discrete scannable visual cards.
5. **Von Restorff Effect (Visual Isolation & Hierarchy)**:
   - Crucial real-time scarcity indicators (`"2 SEATS LEFT"`, `"SOLD OUT"`) highlighted with high-contrast badge indicators.
6. **Doherty Threshold (Perceived Instantaneous Performance)**:
   - Sub-100ms UI state transitions, optimistic seat locking, animated GSAP poster masonry, and interactive marquee previews.

---

## 🚀 Key Features

- 🌌 **Full-Screen Sky Blue & White WebGL Grainient Canvas**: GPU-accelerated raymarching fragment shader rendering organic wave warps and analog film grain.
- 🖼️ **Dynamic GSAP Masonry Poster Gallery**: Interactive multi-column responsive grid with hover-to-focus optics and link routing.
- 🧭 **Flowing Menu Kinetic Compass**: Smooth-scrolling interactive marquee directory with preview reveal effects.
- 🔒 **Pessimistic Concurrency Seat Lock Engine**: Zero-overbooking guarantees using atomic slot quotas and transactional rollback escrow.
- 🔄 **Distributed Saga State Visualizer**: Real-time step-by-step transaction inspector with automated compensation rollbacks.
- 📑 **Instant PDF-Style Booking Vouchers & Receipts**: Cryptographically keyed PNR generation with full ledger audit trail.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (TypeScript)
- **Bundler**: Vite 8.3
- **Styling**: Tailwind CSS + Custom Design Tokens
- **WebGL Shader**: OGL + WebGL2 Custom Shaders
- **Motion & Animations**: GSAP (GreenSock)
- **Icons**: Material Design Icons & Lucide Icons

### Backend
- **Framework**: Java 17 / 21 + Spring Boot 3.4.0
- **Service Discovery**: Spring Cloud Netflix Eureka
- **API Gateway**: Spring Cloud Gateway + Resilience4j Circuit Breakers
- **Data Persistence**: Spring Data JPA / H2 In-Memory / PostgreSQL-ready
- **Testing**: JUnit 5, Spring Boot Test, MockMvc (100% Passing Integration Tests)

---

## ⚡ Quickstart Guide

### Prerequisites
- Node.js 18+ & npm
- JDK 17+ & Maven 3.9+

### 1. Launch Backend Cluster (Spring Boot)
```bash
./run_backend.sh
```
*Starts Eureka Discovery (8761), API Gateway (8080), Package Service (8082), Booking Service (8081), and Payment Service (8083).*

### 2. Launch Frontend (React + Vite)
```bash
./run_frontend.sh
```
*Spins up Vite dev server on `http://localhost:5173` with instant HMR.*

### 3. Run Backend Integration Tests
```bash
cd backend && ./mvnw clean test
```

---

## 📄 License
MIT License • Built with excellence for next-generation luxury travel orchestration.
