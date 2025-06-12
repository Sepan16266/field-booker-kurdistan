// Add support for import.meta.env
interface ImportMeta {
  env: {
    VITE_FIREBASE_API_KEY: string;
    VITE_FIREBASE_AUTH_DOMAIN: string;
    VITE_FIREBASE_DATABASE_URL: string;
    VITE_FIREBASE_PROJECT_ID: string;
    VITE_FIREBASE_STORAGE_BUCKET: string;
    VITE_FIREBASE_MESSAGING_SENDER_ID: string;
    VITE_FIREBASE_APP_ID: string;
    DEV: boolean;
    [key: string]: string | boolean | undefined;
  };
}

// Define toast function
declare function toast(options: {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
});

// Define stats interface
interface AdminStats {
  todayBookings: number;
  weekBookings: number;
  revenue: number;
  occupancy: number;
  [key: string]: any;
} 