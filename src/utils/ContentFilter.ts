/**
 * ContentFilter.ts
 * Utility functions to detect and filter sensitive payment information
 * to prevent users from bypassing the platform's payment system.
 */

/**
 * Checks if text contains sensitive payment information like account numbers,
 * phone numbers, payment links, etc.
 * 
 * @param text The text to check for sensitive information
 * @returns An object with the result and reason if detected
 */
export const containsSensitiveInfo = (text: string): { isDetected: boolean; reason?: string } => {
  if (!text) return { isDetected: false };
  
  // Convert to lowercase for case-insensitive matching
  const lowerText = text.toLowerCase();
  
  // Patterns to detect
  const patterns = [
    // Any digit is prohibited in chat messages
    { regex: /\d+/g, reason: 'numbers are not allowed' },
    // Bank account numbers (generic patterns)
    { regex: /\b\d{10,18}\b/g, reason: 'potential account number' },
    
    // Credit card numbers
    { regex: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g, reason: 'potential credit card number' },
    
    // Phone numbers in various formats
    { regex: /\b(?:\+\d{1,3}[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}\b/g, reason: 'phone number' },
    
    // Payment keywords with numbers
    { regex: /\b(?:venmo|paypal|cashapp|zelle|bank|account|send money to)\b.{0,30}\d{4,}/gi, reason: 'payment service reference' },
    
    // Payment instructions
    { regex: /\b(?:send|transfer|pay|payment|deposit)\b.{0,20}\b(?:to|at|account|number)\b/gi, reason: 'payment instruction' },
    
    // Email addresses with payment-related domains
    { regex: /\b[\w.-]+@(?:paypal|venmo|cash|bank|payment)\.[\w.-]+\b/gi, reason: 'payment service email' },
    
    // Common payment service usernames
    { regex: /\b(?:venmo|cashapp|paypal|zelle)[\s:@]+[\w.-]+\b/gi, reason: 'payment service username' },
    
    // Direct payment request
    { regex: /\b(?:pay me directly|offline payment|outside the app|avoid fee|bypass platform)\b/gi, reason: 'attempt to bypass platform' },
  ];
  
  // Check each pattern
  for (const pattern of patterns) {
    if (pattern.regex.test(lowerText)) {
      return { isDetected: true, reason: pattern.reason };
    }
  }
  
  return { isDetected: false };
};

/**
 * Filters sensitive information from text and replaces it with a placeholder
 * 
 * @param text The text to filter
 * @returns Filtered text with sensitive information replaced
 */
export const filterSensitiveContent = (text: string): string => {
  if (!text) return text;
  
  let filteredText = text;
  
  // Replace account numbers (sequences of 10-18 digits)
  filteredText = filteredText.replace(/\b\d{10,18}\b/g, '***FILTERED***');
  
  // Replace credit card numbers
  filteredText = filteredText.replace(/\b(?:\d{4}[-\s]?){3}\d{4}\b/g, '***FILTERED***');
  
  // Replace phone numbers
  filteredText = filteredText.replace(
    /\b(?:\+\d{1,3}[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}\b/g, 
    '***FILTERED***'
  );
  
  return filteredText;
};

/**
 * Validates user input for sensitive information
 * 
 * @param text The text to validate
 * @returns Object with validation result and error message if invalid
 */
export const validateContent = (text: string): { isValid: boolean; errorMessage?: string } => {
  const result = containsSensitiveInfo(text);
  
  if (result.isDetected) {
    return { 
      isValid: false, 
      errorMessage: `Your message contains a ${result.reason || 'sensitive information'} which is not allowed. Please remove it to continue.` 
    };
  }
  
  return { isValid: true };
}; 