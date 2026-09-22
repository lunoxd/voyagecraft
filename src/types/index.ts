export type UserRole = 'TRAVELER' | 'AGENT' | 'ADMIN' | 'DEVOPS';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export interface JWTPayload {
  sub: string;
  name: string;
  email: string;
  role: UserRole;
  iss: string;
  aud: string;
  iat: number;
  exp: number;
  permissions: string[];
}

export interface TravelDestination {
  city: string;
  country: string;
  nights: number;
  highlights: string[];
}

export interface TravelPackage {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  destinations: TravelDestination[];
  durationDays: number;
  totalCapacity: number;
  bookedSlots: number;
  lockedSlots: number; // Atomic temporary lock during active booking checkout
  basePrice: number;
  deluxePrice: number;
  vipPrice: number;
  departureDates: string[];
  inclusions: string[];
  exclusions: string[];
  status: 'ACTIVE' | 'LIMITED' | 'SOLD_OUT' | 'ARCHIVED';
  featured: boolean;
  category: 'LUXURY_EUROPE' | 'ASIAN_EXPEDITION' | 'NORDIC_SAFARI' | 'ALPINE_ESCORT';
  imageUrl?: string;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REFUNDED';
export type PaymentStatus = 'UNPAID' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type TravelTier = 'STANDARD' | 'DELUXE' | 'VIP';

export interface Booking {
  id: string;
  pnr: string;
  packageId: string;
  packageName: string;
  travelerName: string;
  travelerEmail: string;
  travelerPhone: string;
  passportNo: string;
  seats: number;
  departureDate: string;
  tier: TravelTier;
  totalAmount: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  transactionId?: string;
  receiptNumber?: string;
  createdAt: string;
  specialRequests?: string;
}

export interface PaymentTransaction {
  id: string;
  receiptNumber: string;
  bookingId: string;
  pnr: string;
  travelerName: string;
  amount: number;
  method: 'CREDIT_CARD' | 'CORPORATE_INVOICE' | 'BANK_WIRE' | 'CRYPTO_ESCROW';
  status: 'SUCCESS' | 'FAILED' | 'REFUNDED' | 'PROCESSING';
  timestamp: string;
  idempotencyKey: string;
  authCode: string;
  cardLast4?: string;
}

export type ServiceStatus = 'UP' | 'DOWN' | 'STARTING' | 'MAINTENANCE';

export interface MicroserviceInstance {
  instanceId: string;
  host?: string;
  ip: string;
  port: number;
  status: ServiceStatus;
  zone: string;
  weight: number;
  latencyMs: number;
  activeConnections: number;
  cpuPercent: number;
  memoryMb: number;
  uptimeSeconds: number;
}

export interface MicroserviceDefinition {
  serviceId: string;
  name: string;
  description: string;
  version: string;
  healthEndpoint: string;
  instances: MicroserviceInstance[];
  trafficPercentage: number;
  dependencies: string[];
}

export type LoadBalancerStrategy = 'ROUND_ROBIN' | 'WEIGHTED_ROUND_ROBIN' | 'LEAST_CONNECTIONS' | 'IP_HASH';

export interface GatewayRoute {
  id: string;
  pathPattern: string;
  serviceId: string;
  methods: string[];
  rateLimitPerMin: number;
  requiresAuth: boolean;
  activeRequests: number;
  totalRoutedCount: number;
  avgLatencyMs: number;
  circuitBreakerStatus: 'CLOSED' | 'HALF_OPEN' | 'OPEN';
  enabled: boolean;
}

export interface SagaStep {
  stepIndex: number;
  service: 'API Gateway' | 'Auth Service' | 'Booking Service' | 'Payment Service' | 'Package Service' | 'Notification Service';
  action: string;
  status: 'PENDING' | 'EXECUTING' | 'SUCCESS' | 'COMPENSATED' | 'FAILED';
  payload?: any;
  compensationAction?: string;
  executionTimeMs?: number;
}

export interface SagaTransaction {
  id: string;
  traceId: string;
  name: string;
  startTime: string;
  endTime?: string;
  status: 'SUCCESS' | 'ROLLED_BACK' | 'EXECUTING' | 'FAILED';
  steps: SagaStep[];
}

export interface SystemLog {
  id: string;
  timestamp: string;
  service: string;
  traceId: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  message: string;
  metadata?: any;
}

export interface TestCase {
  id: string;
  title: string;
  category: 'AUTH' | 'CAPACITY' | 'PAYMENT' | 'GATEWAY' | 'EUREKA' | 'SAGA';
  description: string;
  status: 'IDLE' | 'RUNNING' | 'PASSED' | 'FAILED';
  durationMs?: number;
  logs?: string[];
  assertion?: string;
}

export interface TravelReview {
  id: string;
  pnr: string;
  author: string;
  location: string;
  rating: number;
  tourName: string;
  tourId: string;
  comment: string;
  date: string;
  verifiedBooking: boolean;
}

export interface RubricCriterion {
  id: number;
  title: string;
  description: string;
  maxScore: number;
  currentScore: number;
  status: 'VERIFIED' | 'PASSING' | 'PENDING';
  implementationDetails: string[];
  codeReferences: string[];
}

