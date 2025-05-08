import { browser } from '$app/environment';
import type { PrayerTimesResponse } from "$lib/dto/dto";

const API_URL = 'https://api.aladhan.com/v1';

// Type definitions
interface ApiOptions extends RequestInit {
    headers?: Record<string, string>;
}

/**
 * Make an API request with authentication handling
 * @param endpoint - API endpoint
 * @param options - Fetch options
 * @param requireAuth - Whether authentication is required
 * @returns Promise with the response data
 */
async function apiRequest<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    if (!browser) {
        // Handle server-side rendering case
        return null as unknown as T;
    }

    // Set default headers
    const headers = {
        // 'Content-Type': 'application/json',
        // ...options.headers,
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });
        console.log(`${API_URL}${endpoint}`);

        // Parse response
        const data = await response.json();

        // If response is not ok, throw error with message from API
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data as T;
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
}

export const adhan = {
    prayerTime: (dateStr: string, latitude: number, longitude: number, method: string): Promise<PrayerTimesResponse> =>
        apiRequest<PrayerTimesResponse>(`/timings/${dateStr}?latitude=${latitude}&longitude=${longitude}&method=${method}`, { method: 'GET', body: null })
}