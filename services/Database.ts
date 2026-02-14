
import { User, Ride, RideStatus, Role, CaptainProfile, INITIAL_LOCATION } from '../types';

// CHANGED: Use relative path '/api'. 
// The Vite Proxy (configured in vite.config.ts) will forward this to http://localhost:4000/api
const API_URL = '/api';

class DatabaseService {
  
  private getToken() {
    return localStorage.getItem('token');
  }

  // --- HELPERS ---
  
  private async request(endpoint: string, method: string = 'GET', body?: any) {
    try {
        const headers: any = { 'Content-Type': 'application/json' };
        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const options: RequestInit = {
            method,
            headers,
        };
        if (body) options.body = JSON.stringify(body);
        
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        const url = `${API_URL}${cleanEndpoint}`;

        const res = await fetch(url, options);
        
        // Handle non-JSON responses (like 404 HTML pages from proxies or server errors)
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await res.text();
            console.error(`❌ API Request Failed for ${url}`);
            console.error(`Status: ${res.status} ${res.statusText}`);
            console.error(`Response (first 100 chars): ${text.substring(0, 100)}`);
            throw new Error(`Server returned ${res.status} ${res.statusText}. Response: ${text.substring(0, 100)}...`);
        }

        const data = await res.json();
        
        if (!res.ok) throw new Error(data.message || 'API Request Failed');
        return data;
    } catch (error: any) {
        // Detailed error logging
        console.error(`API Error (${endpoint}):`, error.message);
        throw error;
    }
  }

  // --- DEBUGGING ---
  async healthCheck(): Promise<boolean> {
      try {
          // Pings the explicit health route
          // Request: /api/health -> Proxy -> http://localhost:4000/api/health
          await this.request('/health');
          return true;
      } catch (e) {
          console.error("Health Check Failed. Ensure the backend 'server.js' is running on port 4000.");
          return false;
      }
  }

  // --- USER OPERATIONS ---

  async signUp(payload: any): Promise<{user: User, token: string}> {
    return await this.request('/auth/signup', 'POST', payload);
  }

  async signIn(payload: any): Promise<{user: User, token: string}> {
    return await this.request('/auth/login', 'POST', payload);
  }

  async getMe(): Promise<User> {
    return await this.request('/auth/me');
  }

  async updateProfile(fullName: string, profileImage: string): Promise<User> {
      return await this.request('/users/profile', 'PUT', { fullName, profileImage });
  }

  async getAllUsers(): Promise<User[]> {
      return await this.request('/users');
  }

  // --- RIDE OPERATIONS ---

  async getAllRides(): Promise<Ride[]> {
      return await this.request('/rides');
  }

  async createRideRequest(ride: Ride): Promise<Ride> {
      return await this.request('/rides', 'POST', ride);
  }

  async updateRideStatus(rideId: string, status: RideStatus, captainId?: string): Promise<Ride> {
      return await this.request(`/rides/${rideId}`, 'PUT', { status, captainId });
  }

  // --- CAPTAIN OPERATIONS ---
  
  async getCaptainProfile(userId: string): Promise<CaptainProfile> {
      return await this.request(`/captains/${userId}`);
  }

  async updateCaptainProfile(profile: CaptainProfile): Promise<void> {
      await this.request(`/captains/${profile.userId}`, 'PUT', profile);
  }
}

export const db = new DatabaseService();
