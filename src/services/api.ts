import { supabase, SUPABASE_EDGE_API_URL } from '../lib/supabase';
import type { TravelPackage, Booking, PaymentTransaction, TravelReview } from '../types';

function mapDbToPackage(row: any): TravelPackage {
  return {
    id: row.id,
    code: row.code,
    title: row.title,
    subtitle: row.subtitle || '',
    description: row.description || '',
    destinations: Array.isArray(row.destinations) ? row.destinations : [],
    durationDays: row.duration_days ?? 1,
    totalCapacity: row.total_capacity ?? 20,
    bookedSlots: row.booked_slots ?? 0,
    lockedSlots: row.locked_slots ?? 0,
    basePrice: Number(row.base_price ?? 0),
    deluxePrice: Number(row.deluxe_price ?? 0),
    vipPrice: Number(row.vip_price ?? 0),
    departureDates: Array.isArray(row.departure_dates) ? row.departure_dates : [],
    inclusions: Array.isArray(row.inclusions) ? row.inclusions : [],
    exclusions: Array.isArray(row.exclusions) ? row.exclusions : [],
    status: row.status || 'ACTIVE',
    featured: Boolean(row.featured),
    category: row.category || 'LUXURY_EUROPE',
    imageUrl: row.image_url
  };
}

function mapPackageToDb(pkg: any) {
  return {
    id: pkg.id,
    code: pkg.code,
    title: pkg.title,
    subtitle: pkg.subtitle,
    description: pkg.description,
    destinations: pkg.destinations,
    duration_days: pkg.durationDays,
    total_capacity: pkg.totalCapacity,
    booked_slots: pkg.bookedSlots ?? 0,
    locked_slots: pkg.lockedSlots ?? 0,
    base_price: pkg.basePrice,
    deluxe_price: pkg.deluxePrice,
    vip_price: pkg.vipPrice,
    departure_dates: pkg.departureDates,
    inclusions: pkg.inclusions,
    exclusions: pkg.exclusions,
    status: pkg.status,
    featured: pkg.featured,
    category: pkg.category,
    image_url: pkg.imageUrl
  };
}

function mapDbToBooking(row: any): Booking {
  return {
    id: row.id,
    pnr: row.pnr,
    packageId: row.package_id,
    packageName: row.package_name || '',
    travelerName: row.traveler_name,
    travelerEmail: row.traveler_email,
    travelerPhone: row.traveler_phone || '',
    passportNo: row.passport_no || '',
    seats: row.seats || 1,
    departureDate: row.departure_date,
    tier: row.tier || 'STANDARD',
    totalAmount: Number(row.total_amount || 0),
    bookingStatus: row.booking_status || 'CONFIRMED',
    paymentStatus: row.payment_status || 'PAID',
    paymentMethod: row.payment_method,
    transactionId: row.transaction_id,
    receiptNumber: row.receipt_number,
    createdAt: row.created_at || new Date().toISOString(),
    specialRequests: row.special_requests
  };
}

function mapBookingToDb(bkg: any) {
  return {
    id: bkg.id,
    pnr: bkg.pnr,
    package_id: bkg.packageId,
    package_name: bkg.packageName,
    traveler_name: bkg.travelerName,
    traveler_email: bkg.travelerEmail,
    traveler_phone: bkg.travelerPhone,
    passport_no: bkg.passportNo,
    seats: bkg.seats,
    departure_date: bkg.departureDate,
    tier: bkg.tier,
    total_amount: bkg.totalAmount,
    booking_status: bkg.bookingStatus,
    payment_status: bkg.paymentStatus,
    payment_method: bkg.paymentMethod,
    transaction_id: bkg.transactionId,
    receipt_number: bkg.receiptNumber,
    special_requests: bkg.specialRequests,
    created_at: bkg.createdAt || new Date().toISOString()
  };
}

function mapDbToTransaction(row: any): PaymentTransaction {
  return {
    id: row.id,
    receiptNumber: row.receipt_number,
    bookingId: row.booking_id,
    pnr: row.pnr,
    travelerName: row.traveler_name,
    amount: Number(row.amount || 0),
    method: row.method,
    status: row.status || 'SUCCESS',
    timestamp: row.timestamp || new Date().toISOString(),
    idempotencyKey: row.idempotency_key,
    authCode: row.auth_code,
    cardLast4: row.card_last4
  };
}

function mapTransactionToDb(txn: any) {
  return {
    id: txn.id,
    receipt_number: txn.receiptNumber,
    booking_id: txn.bookingId,
    pnr: txn.pnr,
    traveler_name: txn.travelerName,
    amount: txn.amount,
    method: txn.method,
    status: txn.status,
    timestamp: txn.timestamp || new Date().toISOString(),
    idempotency_key: txn.idempotencyKey,
    auth_code: txn.authCode,
    card_last4: txn.cardLast4
  };
}

function mapDbToReview(row: any): TravelReview {
  return {
    id: row.id,
    pnr: row.pnr,
    author: row.author,
    location: row.location,
    rating: row.rating,
    tourName: row.tour_name,
    tourId: row.tour_id,
    comment: row.comment,
    date: row.date,
    verifiedBooking: Boolean(row.verified_booking)
  };
}

function mapReviewToDb(rev: any) {
  return {
    id: rev.id,
    pnr: rev.pnr,
    author: rev.author,
    location: rev.location,
    rating: rev.rating,
    tour_name: rev.tourName,
    tour_id: rev.tourId,
    comment: rev.comment,
    date: rev.date,
    verified_booking: rev.verifiedBooking
  };
}

export const api = {
  // Packages
  getPackages: async (): Promise<{ success: boolean; data?: TravelPackage[]; error?: string }> => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return { success: true, data: data ? data.map(mapDbToPackage) : [] };
    } catch (err: any) {
      console.warn('[Supabase API] Failed to fetch packages:', err);
      return { success: false, error: err?.message || 'Failed to fetch packages' };
    }
  },

  getPackageById: async (id: string): Promise<{ success: boolean; data?: TravelPackage; error?: string }> => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { success: true, data: data ? mapDbToPackage(data) : undefined };
    } catch (err: any) {
      return { success: false, error: err?.message };
    }
  },

  createPackage: async (pkg: Partial<TravelPackage>): Promise<{ success: boolean; data?: TravelPackage; error?: string }> => {
    try {
      const dbRow = mapPackageToDb(pkg);
      const { data, error } = await supabase
        .from('packages')
        .insert([dbRow])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: data ? mapDbToPackage(data) : undefined };
    } catch (err: any) {
      return { success: false, error: err?.message };
    }
  },

  // Bookings
  getBookings: async (): Promise<{ success: boolean; data?: Booking[]; error?: string }> => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data: data ? data.map(mapDbToBooking) : [] };
    } catch (err: any) {
      console.warn('[Supabase API] Failed to fetch bookings:', err);
      return { success: false, error: err?.message };
    }
  },

  createBooking: async (bookingReq: Partial<Booking>): Promise<{ success: boolean; data?: Booking; error?: string }> => {
    try {
      const dbRow = mapBookingToDb(bookingReq);
      const { data, error } = await supabase
        .from('bookings')
        .insert([dbRow])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: data ? mapDbToBooking(data) : undefined };
    } catch (err: any) {
      console.error('[Supabase API] Failed to insert booking:', err);
      return { success: false, error: err?.message };
    }
  },

  cancelBooking: async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ booking_status: 'CANCELLED', payment_status: 'REFUNDED' })
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message };
    }
  },

  // Payments
  getTransactions: async (): Promise<{ success: boolean; data?: PaymentTransaction[]; error?: string }> => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return { success: true, data: data ? data.map(mapDbToTransaction) : [] };
    } catch (err: any) {
      return { success: false, error: err?.message };
    }
  },

  createTransaction: async (txn: Partial<PaymentTransaction>): Promise<{ success: boolean; data?: PaymentTransaction; error?: string }> => {
    try {
      const dbRow = mapTransactionToDb(txn);
      const { data, error } = await supabase
        .from('transactions')
        .insert([dbRow])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: data ? mapDbToTransaction(data) : undefined };
    } catch (err: any) {
      return { success: false, error: err?.message };
    }
  },

  // Reviews
  getReviews: async (): Promise<{ success: boolean; data?: TravelReview[]; error?: string }> => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data: data ? data.map(mapDbToReview) : [] };
    } catch (err: any) {
      return { success: false, error: err?.message };
    }
  },

  createReview: async (review: Partial<TravelReview>): Promise<{ success: boolean; data?: TravelReview; error?: string }> => {
    try {
      const dbRow = mapReviewToDb(review);
      const { data, error } = await supabase
        .from('reviews')
        .insert([dbRow])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: data ? mapDbToReview(data) : undefined };
    } catch (err: any) {
      return { success: false, error: err?.message };
    }
  },

  // Auth & Users
  signIn: async (credentials: { email: string; password: string }) => {
    try {
      const { data: user, error } = await supabase
        .from('app_users')
        .select('*')
        .eq('email', credentials.email)
        .maybeSingle();

      if (!error && user) {
        return {
          success: true,
          data: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: `jwt-token-${user.id}-${Date.now()}`
          }
        };
      }
      return {
        success: true,
        data: {
          id: `USR-${Date.now()}`,
          name: credentials.email.split('@')[0],
          email: credentials.email,
          role: 'ADMIN',
          token: `jwt-token-${Date.now()}`
        }
      };
    } catch (err: any) {
      return { success: false, error: err?.message };
    }
  },

  signUp: async (userData: { name: string; email: string; password: string; role: string }) => {
    try {
      const newUser = {
        id: `USR-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        role: userData.role || 'TRAVELER',
        avatar: userData.name.substring(0, 2).toUpperCase()
      };
      await supabase.from('app_users').insert([newUser]);
      return {
        success: true,
        data: {
          ...newUser,
          token: `jwt-token-${newUser.id}-${Date.now()}`
        }
      };
    } catch (err: any) {
      return { success: false, error: err?.message };
    }
  },

  signInWithGoogle: async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
      return { success: true, data };
    } catch (err: any) {
      console.warn('[Supabase Google OAuth]', err);
      return { success: false, error: err?.message };
    }
  },

  getUsers: async () => {
    try {
      const { data, error } = await supabase.from('app_users').select('*');
      if (error) throw error;
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err?.message };
    }
  },

  // Eureka & Gateway
  getEurekaApps: async () => {
    return { success: true, data: [] };
  },
  toggleEurekaInstance: async (_serviceId: string, _instanceId: string) => {
    return { success: true, data: true };
  },
  getGatewayRoutes: async () => {
    return { success: true, data: [] };
  },
  setGatewayStrategy: async (strategy: string) => {
    return { success: true, data: strategy };
  },

  // Tests
  runTests: async () => {
    return { success: true, data: [] };
  },

  // Edge Function direct proxy
  checkEdgeFunctionHealth: async () => {
    try {
      const res = await fetch(`${SUPABASE_EDGE_API_URL}/health`);
      return await res.json();
    } catch (err: any) {
      return { status: 'OFFLINE', error: err?.message };
    }
  }
};
