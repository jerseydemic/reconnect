/**
 * Generate a random 6-digit verification code
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send verification code via email (simulated - in production, use an email service)
 * For now, we'll just log it to console and show it in an alert
 */
export function sendVerificationCode(email: string, code: string): void {
  console.log(`Verification code for ${email}: ${code}`);
  
  // In production, you would call an email service API here
  // For now, we'll simulate by showing an alert
  alert(`Verification code sent to ${email}!\n\nFor demo purposes, your code is: ${code}\n\n(In production, this would be sent via email)`);
}

/**
 * Store verification code with expiration (15 minutes)
 */
export function storeVerificationCode(email: string, code: string): void {
  const expiration = Date.now() + 15 * 60 * 1000; // 15 minutes
  localStorage.setItem(`verification_${email.toLowerCase()}`, JSON.stringify({
    code,
    expiration
  }));
}

/**
 * Verify code for email
 */
export function verifyCode(email: string, code: string): boolean {
  const stored = localStorage.getItem(`verification_${email.toLowerCase()}`);
  if (!stored) return false;

  const { code: storedCode, expiration } = JSON.parse(stored);
  
  // Check if expired
  if (Date.now() > expiration) {
    localStorage.removeItem(`verification_${email.toLowerCase()}`);
    return false;
  }

  return code === storedCode;
}

/**
 * Clear verification code after successful reset
 */
export function clearVerificationCode(email: string): void {
  localStorage.removeItem(`verification_${email.toLowerCase()}`);
}

/**
 * Find session by email
 */
export function findSessionByEmail(email: string): string | null {
  const normalizedEmail = email.toLowerCase();
  
  // Search through all sessions in localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('session_')) {
      const sessionData = localStorage.getItem(key);
      if (sessionData) {
        try {
          const session = JSON.parse(sessionData);
          if (session.userEmail?.toLowerCase() === normalizedEmail) {
            return session.id;
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }
    }
  }
  
  return null;
}

/**
 * Reset password for a session
 */
export async function resetSessionPassword(sessionId: string, newPassword: string): Promise<boolean> {
  const sessionData = localStorage.getItem(`session_${sessionId}`);
  if (!sessionData) return false;

  try {
    const session = JSON.parse(sessionData);
    const passwordHash = await hashPassword(newPassword);
    session.passwordHash = passwordHash;
    localStorage.setItem(`session_${sessionId}`, JSON.stringify(session));
    return true;
  } catch (e) {
    return false;
  }
}
