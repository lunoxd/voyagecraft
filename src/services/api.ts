const API_BASE_URL = 'http://localhost:8080/api/v1';

export async function fetchFromApi<T>(endpoint: string, options: RequestInit = {}): Promise<{ success: boolean; data?: T; message?: string; error?: string }> {
  try {
    const token = localStorage.getItem('vc_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const json = await res.json();
    return json;
  } catch (err: any) {
    console.warn(`[API Fallback] Endpoint ${endpoint} unreachable or error:`, err);
    return { success: false, error: err?.message || 'Network error' };
  }
}

export const api = {
  // Packages
  getPackages: () => fetchFromApi<any[]>('/packages'),
  getPackageById: (id: string) => fetchFromApi<any>(`/packages/${id}`),
  createPackage: (pkg: any) => fetchFromApi<any>('/packages', { method: 'POST', body: JSON.stringify(pkg) }),

  // Bookings
  getBookings: () => fetchFromApi<any[]>('/bookings'),
  getBookingById: (id: string) => fetchFromApi<any>(`/bookings/${id}`),
  createBooking: (bookingReq: any) => fetchFromApi<any>('/bookings', { method: 'POST', body: JSON.stringify(bookingReq) }),
  cancelBooking: (id: string) => fetchFromApi<void>(`/bookings/${id}/cancel`, { method: 'POST' }),

  // Payments
  getTransactions: () => fetchFromApi<any[]>('/payments/transactions'),

  // Auth
  signIn: (credentials: { email: string; password: string }) =>
    fetchFromApi<any>('/auth/signin', { method: 'POST', body: JSON.stringify(credentials) }),
  signUp: (userData: { name: string; email: string; password: string; role: string }) =>
    fetchFromApi<any>('/auth/signup', { method: 'POST', body: JSON.stringify(userData) }),
  getUsers: () => fetchFromApi<any[]>('/auth/users'),

  // Eureka & Gateway
  getEurekaApps: () => fetchFromApi<any[]>('/eureka/apps'),
  toggleEurekaInstance: (serviceId: string, instanceId: string) =>
    fetchFromApi<boolean>(`/eureka/instances/${serviceId}/${instanceId}/toggle`, { method: 'POST' }),
  getGatewayRoutes: () => fetchFromApi<any[]>('/gateway/routes'),
  setGatewayStrategy: (strategy: string) =>
    fetchFromApi<string>(`/gateway/strategy?strategy=${strategy}`, { method: 'POST' }),

  // Tests
  runTests: () => fetchFromApi<any[]>('/tests/run')
};
