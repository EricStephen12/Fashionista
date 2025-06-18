# Content Filtering System

## Overview

The Content Filtering System is designed to prevent users from bypassing the platform's payment system by sharing payment information (like account numbers, phone numbers, or payment service details) in text inputs across the app. This helps protect the platform's revenue model and ensures all transactions happen through the official payment channels.

## Features

- Detects and blocks sensitive payment information
- Provides user-friendly error messages
- Can be applied to any text input across the app
- Supports validation for:
  - Bank account numbers
  - Credit card numbers
  - Phone numbers
  - Payment service references (Venmo, PayPal, etc.)
  - Payment instructions
  - Direct payment requests

## Implementation

### Core Utilities

The core functionality is in `src/utils/ContentFilter.ts`, which provides:

- `containsSensitiveInfo(text)`: Checks if text contains sensitive payment information
- `filterSensitiveContent(text)`: Replaces sensitive information with placeholders
- `validateContent(text)`: Validates user input and returns validation results

### Components

- `ContentFilterWrapper`: A reusable component that wraps any text input to add content filtering

### Integration Points

The content filter is integrated in the following places:

1. **Chat Messages**: Prevents users from sharing payment details in direct messages
2. **Product Descriptions**: Ensures product descriptions don't contain payment bypass instructions
3. **Designer Reviews**: Prevents users from sharing contact or payment info in reviews
4. **User Profiles**: Filters sensitive information from profile descriptions

## Usage

### Basic Usage

```tsx
import { validateContent } from '../src/utils/ContentFilter';

// In a component:
const handleTextChange = (text: string) => {
  const validation = validateContent(text);
  if (!validation.isValid) {
    setError(validation.errorMessage);
    // Show error to user
  } else {
    setError(null);
    // Process valid text
  }
};
```

### Using the ContentFilterWrapper

```tsx
import ContentFilterWrapper from '../src/components/ContentFilterWrapper';

// In a component:
<ContentFilterWrapper
  onValidationChange={(isValid) => setIsFormValid(isValid)}
>
  <TextInput
    placeholder="Enter your message"
    value={message}
    onChangeText={setMessage}
  />
</ContentFilterWrapper>
```

## Regex Patterns

The system uses the following regex patterns to detect sensitive information:

- Bank account numbers: `/\b\d{10,18}\b/g`
- Credit card numbers: `/\b(?:\d{4}[-\s]?){3}\d{4}\b/g`
- Phone numbers: `/\b(?:\+\d{1,3}[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}\b/g`
- Payment keywords: `/\b(?:venmo|paypal|cashapp|zelle|bank|account|send money to)\b.{0,30}\d{4,}/gi`
- Payment instructions: `/\b(?:send|transfer|pay|payment|deposit)\b.{0,20}\b(?:to|at|account|number)\b/gi`
- Direct payment requests: `/\b(?:pay me directly|offline payment|outside the app|avoid fee|bypass platform)\b/gi`

## Extending the System

To add new patterns:

1. Add new regex patterns to the `patterns` array in `containsSensitiveInfo()`
2. Update the filtering logic in `filterSensitiveContent()` if needed
3. Test with various examples to ensure proper detection

## Best Practices

1. Apply the filter before submitting any user-generated content to the server
2. Provide clear error messages to users about why their content was flagged
3. Don't reveal the exact patterns being matched to prevent users from finding workarounds
4. Regularly update the patterns to catch new bypass attempts
5. Consider implementing server-side validation as a second layer of protection 