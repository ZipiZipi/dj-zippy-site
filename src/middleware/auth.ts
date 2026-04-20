// Authentication middleware for admin routes
// Validates session cookies and redirects to login if not authenticated

import type { AstroMiddleware } from 'astro';

export const authMiddleware: AstroMiddleware = async (context, next) => {
  const { url, cookies, redirect } = context;

  // Skip auth for login page
  if (url.pathname === '/admin/login') {
    return next();
  }

  // Skip auth for API endpoints that don't require it
  if (url.pathname === '/api/admin/login') {
    return next();
  }

  // Check for valid session
  const sessionToken = cookies.get('admin_session')?.value;

  if (!sessionToken || !validateSessionToken(sessionToken)) {
    return redirect('/admin/login');
  }

  return next();
};

/**
 * Validate session token (in production, use JWT or database-backed sessions)
 * For now, we'll use a simple token format: base64(timestamp:hash)
 */
export function validateSessionToken(token: string): boolean {
  try {
    // For development: just check if token exists and isn't expired
    // In production, implement proper JWT validation or database checks
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [timestamp] = decoded.split(':');
    const tokenTime = parseInt(timestamp);

    // Token valid for 7 days
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const isExpired = Date.now() - tokenTime > sevenDaysMs;

    return !isExpired;
  } catch {
    return false;
  }
}

/**
 * Generate a new session token
 */
export function generateSessionToken(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const token = `${timestamp}:${random}`;
  return Buffer.from(token).toString('base64');
}

/**
 * Verify admin password
 */
export function verifyAdminPassword(password: string): boolean {
  const adminPassword = import.meta.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.warn('Warning: ADMIN_PASSWORD not set in environment variables');
    return false;
  }

  // Simple comparison - in production, use bcrypt or similar
  return password === adminPassword;
}
