# Fixing PKCE Error

## Error Message
```
The PKCE code challenge and verifier could not be generated.
Detail: TypeError: Cannot read properties of undefined (reading 'digest')
pkce_not_created
```

## What is PKCE?
PKCE (Proof Key for Code Exchange) is a security enhancement for OAuth 2.0. It requires the browser's Web Crypto API, which may not be available in all browsers or contexts.

## Solution Applied

### Change 1: Use Redirect Flow Instead of Popup
The application now uses `loginRedirect()` instead of `loginPopup()` for better compatibility.

**What this means:**
- When you click "Sign In", the entire page will redirect to Microsoft login
- After signing in, you'll be redirected back to the application
- This is more reliable than popup windows

### Change 2: Enable Implicit Flow in Azure Portal

You need to enable implicit flow in Azure Portal as a fallback:

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Microsoft Entra ID** → **App registrations**
3. Select your app: **SharePoint SSO Demo**
4. Click **Authentication** in the left menu
5. Under **Implicit grant and hybrid flows**, ensure these are checked:
   - ✅ **Access tokens** (used for implicit flows)
   - ✅ **ID tokens** (used for implicit and hybrid flows)
6. Click **Save**

## Testing the Fix

1. **Refresh the application** (Ctrl+Shift+R)
2. **Click "Sign In with Microsoft"**
3. The page should redirect to Microsoft login (not open a popup)
4. Enter your credentials
5. You'll be redirected back to the application
6. You should see your profile and SharePoint sites

## Alternative: Use a Different Browser

If the issue persists, try:
- **Chrome** or **Edge** (best support for Web Crypto API)
- **Firefox** (good support)
- Avoid older browsers or browsers with strict security settings

## Check Browser Compatibility

Open browser console (F12) and run:
```javascript
console.log('Crypto API available:', typeof crypto !== 'undefined');
console.log('SubtleCrypto available:', typeof crypto?.subtle !== 'undefined');
```

Both should return `true`. If not, your browser doesn't support the required APIs.

## If Still Having Issues

### Option 1: Use HTTP instead of HTTPS for localhost
Some browsers restrict crypto APIs on non-HTTPS sites. Since you're using `http://localhost:3000`, this should be fine.

### Option 2: Update Browser
Ensure you're using the latest version of your browser.

### Option 3: Check Browser Settings
- Disable strict security extensions
- Allow JavaScript
- Enable cookies
- Try incognito/private mode

## Expected Behavior After Fix

1. Click "Sign In" → Page redirects to Microsoft
2. Enter credentials → Redirects back to app
3. Profile loads → SharePoint sites appear
4. Everything works! ✅

---

**Last Updated**: 2026-03-13