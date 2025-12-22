# Frontend Rate Limiting Response Handling

## Overview
The frontend has been updated to properly handle rate limiting errors (429 responses) from the backend. Users now receive clear, user-friendly messages with retry timing information instead of generic error alerts.

---

## Key Implementation Details

### 1. Rate Limit Handler Utility
**File:** [src/lib/rateLimitHandler.ts](src/lib/rateLimitHandler.ts)

This centralized utility provides:
- **`handleRateLimitError(error)`** - Detects 429 responses and shows formatted toast messages
- **`getRateLimitInfo(error)`** - Extracts rate limit information from responses
- **`handleApiError(error, message)`** - Generic error handler that checks for rate limits first
- **`rateLimitHandlers` object** - Type-specific handlers for auth, public, and protected routes

#### Features:
- ✅ Detects 429 (Too Many Requests) status codes
- ✅ Extracts `retryAfter` timestamp from response
- ✅ Formats retry time in human-readable format (e.g., "in 5 minutes")
- ✅ Shows toast notifications instead of browser alerts
- ✅ Longer toast duration (5 seconds) for rate limit errors
- ✅ Returns boolean indicating if error was a rate limit

---

## Updated Components

### Authentication Pages

#### Sign Up Form
**File:** [src/components/signup-form.tsx](src/components/signup-form.tsx)
- ✅ Uses `toast.success()` and `toast.error()` instead of `alert()`
- ✅ Calls `rateLimitHandlers.auth.handleError()` in catch block
- ✅ Shows retry timing when rate limited
- ✅ Improved success message with redirect delay

#### Sign In Form
**File:** [src/components/signin-form.tsx](src/components/signin-form.tsx)
- ✅ Uses `toast` notifications throughout
- ✅ Handles rate limit errors with auth handler
- ✅ Shows specific message for auth rate limits
- ✅ Improved user feedback on success

#### Google Auth Button
**File:** [src/components/googleAuthButton.tsx](src/components/googleAuthButton.tsx)
- ✅ Uses `toast.error()` for all error messages
- ✅ Calls `rateLimitHandlers.auth.handleError()` for 429s
- ✅ Proper error handling for network issues
- ✅ 404 errors handled separately with helpful message

---

### Protected Routes

#### All Testimonials Page
**File:** [src/app/all-testimonials/page.tsx](src/app/all-testimonials/page.tsx)
- ✅ `rateLimitHandlers.protected.handleError()` in fetch
- ✅ `rateLimitHandlers.protected.handleError()` in toggleFavorite
- ✅ `rateLimitHandlers.protected.handleError()` in handleArchiveConfirm

#### Archived Page
**File:** [src/app/archived/page.tsx](src/app/archived/page.tsx)
- ✅ Uses protected handler for testimonials fetch
- ✅ Shows rate limit info when user hits limit

#### Favourites Page
**File:** [src/app/favourites/page.tsx](src/app/favourites/page.tsx)
- ✅ Protected handler for fetch testimonials
- ✅ Consistent error messages across app

#### Spaces Page
**File:** [src/app/spaces/page.tsx](src/app/spaces/page.tsx)
- ✅ Protected handler for create/delete space operations
- ✅ Protected handler for fetch spaces

#### Space Detail Page
**File:** [src/app/spaces/[id]/page.tsx](src/app/spaces/[id]/page.tsx)
- ✅ Protected handler for fetch space
- ✅ Protected handler for favorite toggle (with try/catch around async fav/unfav)
- ✅ Proper error handling in favorite operations

---

### Public Routes

#### Public Testimonial Pages
**File:** [src/app/[slug]/page.tsx](src/app/[slug]/page.tsx)
- ✅ Uses `rateLimitHandlers.public.handleError()` for campaign fetch
- ✅ Uses `rateLimitHandlers.public.handleError()` for form submission
- ✅ Specific handling for quota limit errors (403)
- ✅ Uses `toast.success()` for successful submission

#### Video Page
**File:** [src/app/video/page.tsx](src/app/video/page.tsx)
- ✅ Public handler for campaign fetch
- ✅ Public handler for testimonial submission
- ✅ Uses `toast` instead of `alert()`
- ✅ Shows success toast on submission

---

### Context & Dialogs

#### User Context
**File:** [src/context/UserContext.tsx](src/context/UserContext.tsx)
- ✅ Protected handler for user data fetch
- ✅ Silently fails without showing toast (since it's called on every page load)
- ✅ Proper error logging

#### Create Space Dialog
**File:** [src/components/ui/create-space-dialog.tsx](src/components/ui/create-space-dialog.tsx)
- ✅ Uses `toast` instead of `alert()`
- ✅ Protected handler for space creation
- ✅ Proper error messages

---

## Response Formats by Limiter Type

### Auth Limiter (10 failed attempts / 15 min)
```json
{
  "success": false,
  "message": "Too many login attempts. Please try again after 15 minutes.",
  "retryAfter": 1703254800
}
```
**Toast Message:** "Too many login attempts. Please try again after 15 minutes. Try again in 15 minutes."

### Public Limiter (50 submissions / 1 hour)
```json
{
  "success": false,
  "message": "Too many submissions. Please try again later.",
  "retryAfter": 1703261000
}
```
**Toast Message:** "Too many submissions. Please try again later. Try again in 59 minutes."

### Global Limiter (100 requests / 15 min)
```json
{
  "success": false,
  "message": "Too many requests. Please try again later.",
  "retryAfter": 1703254800
}
```
**Toast Message:** "Too many requests. Please try again later. Try again in 15 minutes."

---

## Toast Notifications Configuration

All rate limit toasts use these settings:
- **Type:** `toast.error()`
- **Duration:** 5000ms (5 seconds) - longer than normal errors
- **Position:** `top-center` - prominent placement
- **Auto-close:** Yes, after 5 seconds
- **Dismissible:** Yes, user can click X to close

Other error toasts:
- **Type:** `toast.error()`
- **Duration:** 4000ms (4 seconds)
- **Position:** `top-center`

Success toasts:
- **Type:** `toast.success()`
- **Duration:** Varies by context (1500-5000ms)
- **Position:** `top-center` or `bottom-right`

---

## Usage Examples

### For Auth Endpoints (signup, signin, google auth)
```typescript
try {
  // API call
  await axios.post(url, data);
} catch (error: any) {
  rateLimitHandlers.auth.handleError(error);
}
```

### For Protected Endpoints (authenticated user operations)
```typescript
try {
  // API call
  await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
} catch (error: any) {
  rateLimitHandlers.protected.handleError(error, "Custom error message");
}
```

### For Public Endpoints (public submissions)
```typescript
try {
  // API call
  await axios.post(url, data);
} catch (error: any) {
  rateLimitHandlers.public.handleError(error, "Failed to submit");
}
```

---

## Error Flow Diagram

```
API Request
    ↓
Response Status?
    ├─ 429 → handleRateLimitError() → Format retry time → Toast with retry info
    ├─ 4xx/5xx → Handler-specific error → Toast with error message
    └─ Success → Process response → Success toast (if needed)
```

---

## Retry Time Formatting

The utility automatically formats retry times:
- **0-59 seconds:** "Try again in X seconds"
- **1-59 minutes:** "Try again in X minutes"
- **1-23 hours:** "Try again in X hours"
- **24+ hours:** "Try again at HH:MM AM/PM"

Examples:
- 30 seconds → "Try again in 30 seconds"
- 5 minutes → "Try again in 5 minutes"
- 2 hours → "Try again in 2 hours"
- Future date → "Try again at 3:45 PM"

---

## Testing Rate Limits

### Test Auth Limiter
1. Go to `/signin`
2. Enter wrong credentials 10+ times
3. Should see: "Too many login attempts. Please try again after 15 minutes. Try again in 15 minutes."

### Test Public Limiter
1. Visit a public campaign page (e.g., `/campaign-slug`)
2. Submit 50+ testimonials rapidly
3. Should see: "Too many submissions. Please try again later. Try again in 1 hour."

### Test Global Limiter
1. Authenticate and visit `/all-testimonials`
2. Rapidly click favorite button 100+ times
3. Should see: "Too many requests. Please try again later. Try again in 15 minutes."

---

## Files Modified Summary

| File | Changes |
|------|---------|
| [src/lib/rateLimitHandler.ts](src/lib/rateLimitHandler.ts) | NEW - Core utility |
| [src/components/signup-form.tsx](src/components/signup-form.tsx) | Auth handler added |
| [src/components/signin-form.tsx](src/components/signin-form.tsx) | Auth handler added |
| [src/components/googleAuthButton.tsx](src/components/googleAuthButton.tsx) | Auth handler added |
| [src/app/all-testimonials/page.tsx](src/app/all-testimonials/page.tsx) | Protected handler added |
| [src/app/archived/page.tsx](src/app/archived/page.tsx) | Protected handler added |
| [src/app/favourites/page.tsx](src/app/favourites/page.tsx) | Protected handler added |
| [src/app/spaces/page.tsx](src/app/spaces/page.tsx) | Protected handler added |
| [src/app/spaces/[id]/page.tsx](src/app/spaces/[id]/page.tsx) | Protected handler added |
| [src/app/[slug]/page.tsx](src/app/[slug]/page.tsx) | Public handler added |
| [src/app/video/page.tsx](src/app/video/page.tsx) | Public handler added |
| [src/context/UserContext.tsx](src/context/UserContext.tsx) | Protected handler added |
| [src/components/ui/create-space-dialog.tsx](src/components/ui/create-space-dialog.tsx) | Protected handler added |

---

## Benefits

✅ **User Experience**
- Clear, actionable error messages
- Exact retry timing information
- No confusion about why requests are failing
- Professional error presentation with toasts

✅ **Consistency**
- All rate limit errors handled uniformly
- Same message format across app
- Predictable behavior for users

✅ **Developer Experience**
- Reusable utility functions
- Type-specific handlers for different endpoint types
- Easy to add to new endpoints
- Centralized error handling logic

✅ **Monitoring**
- Console errors logged for debugging
- Rate limit info captured for analytics
- Clear separation between rate limits and other errors

---

## Future Enhancements

1. **Local Rate Limit Tracking:** Track requests on client to warn before hitting limits
2. **Exponential Backoff:** Implement automatic retry with exponential backoff
3. **Request Queuing:** Queue requests that would hit rate limits for later
4. **User Preferences:** Allow users to set retry preferences
5. **Analytics:** Track rate limit hits for user behavior analysis
6. **Custom Handlers:** Per-endpoint custom error handling if needed

---

## Support

If you encounter issues with rate limiting:
1. Check browser console for detailed error logs
2. Verify backend is running and rate limiters are configured
3. Check timestamp format in `retryAfter` response
4. Test with curl to isolate frontend vs backend issues

