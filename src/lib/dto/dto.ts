
export interface Prayer {
    name: string;
    time: string;
    isNext: boolean;
    notified: boolean; // Track if notification was already sent
    img?: string;
}
export interface PrayerTimesResponse {
    code: number;
    status: string;
    data: {
        timings: {
            Fajr: string;
            Sunrise: string;
            Dhuhr: string;
            Asr: string;
            Sunset: string;
            Maghrib: string;
            Isha: string;
            Imsak: string;
            Midnight: string;
            [key: string]: string;
        };
        date: {
            readable: string;
            timestamp: string;
            hijri: {
                date: string;
                month: {
                    number: number;
                    en: string;
                    ar: string;
                };
                year: string;
                designation: {
                    abbreviated: string;
                    expanded: string;
                };
                holidays: string[];
            };
            gregorian: {
                date: string;
                format: string;
                day: string;
                month: {
                    number: number;
                    en: string;
                };
                year: string;
                designation: {
                    abbreviated: string;
                    expanded: string;
                };
            };
        };
        meta: {
            latitude: number;
            longitude: number;
            timezone: string;
            method: {
                id: number;
                name: string;
                params: {
                    Fajr: number;
                    Isha: number;
                };
            };
            latitudeAdjustmentMethod: string;
            midnightMode: string;
            school: string;
            offset: {
                [key: string]: number;
            };
        };
    };
}