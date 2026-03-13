# Troubleshooting: Stuck on Loading Screen

## Problem
The application shows a loading spinner and doesn't proceed to the sign-in page.

## Common Causes

### 1. MSAL Library Not Loading
**Symptoms**: Loading screen appears immediately and never disappears

**Check**:
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Look for errors like:
   - `msal is not defined`
   - `Failed to load resource: net::ERR_BLOCKED_BY_CLIENT`
   - CORS errors

**Solution**:
- Check your internet connection
- Verify the MSAL CDN URL is accessible
- Try using a different CDN or download MSAL locally

### 2. Configuration Error
**Symptoms**: Error in console about invalid configuration

**Check Console for**:
- `Invalid client ID`
- `Invalid authority URL`
- Configuration validation errors

**Solution**:
- Verify Client ID format (should be a GUID)
- Verify Tenant ID format (should be a GUID)
- Check authority URL format

### 3. Redirect URI Mismatch
**Symptoms**: Error after redirect from Microsoft login

**Check**:
- Azure Portal → App registrations → Your app → Authentication
- Verify redirect URI is exactly: `http://localhost:3000`
- Platform must be "Single-page application (SPA)"

### 4. Browser Extensions Blocking
**Symptoms**: Loading screen with no console errors

**Solution**:
- Disable ad blockers
- Disable privacy extensions
- Try in incognito/private mode

## Quick Diagnostic Steps

### Step 1: Check Browser Console
1. Press F12 to open Developer Tools
2. Go to Console tab
3. Refresh the page
4. Look for red error messages
5. Copy any error messages

### Step 2: Check Network Tab
1. In Developer Tools, go to Network tab
2. Refresh the page
3. Look for failed requests (red)
4. Check if MSAL library loaded successfully

### Step 3: Verify Configuration
Your current configuration:
```javascript
clientId: 'xxxxxxxxxx'
authority: 'https://login.microsoftonline.com/xxxxxx'
redirectUri: 'http://localhost:3000'
```

Verify in Azure Portal:
- Application (client) ID matches
- Directory (tenant) ID matches
- Redirect URI is configured

## Solutions

### Solution 1: Clear Browser Cache
```
1. Open browser settings
2. Clear browsing data
3. Select "Cached images and files"
4. Clear data
5. Refresh the page
```

### Solution 2: Check Azure Portal Configuration
1. Go to https://portal.azure.com
2. Navigate to Microsoft Entra ID → App registrations
3. Find your app: "SharePoint SSO Demo"
4. Verify:
   - ✅ Authentication → Redirect URIs includes `http://localhost:3000`
   - ✅ Authentication → Platform is "Single-page application"
   - ✅ API permissions are granted
   - ✅ Application is not disabled

### Solution 3: Test with Minimal Configuration
Create a test file to verify MSAL loads correctly.

### Solution 4: Use Alternative Port
If port 3000 is causing issues:
1. Stop the current server
2. Start on different port: `python -m http.server 8080`
3. Update config.js: `redirectUri: 'http://localhost:8080'`
4. Update Azure Portal redirect URI to match

## Error Messages and Solutions

### "msal is not defined"
**Cause**: MSAL library failed to load from CDN

**Solution**:
1. Check internet connection
2. Try different browser
3. Download MSAL locally:
   ```bash
   # Download MSAL.js
   curl -o msal-browser.min.js https://alcdn.msauth.net/browser/2.38.1/js/msal-browser.min.js
   ```
4. Update index.html to use local file:
   ```html
   <script src="msal-browser.min.js"></script>
   ```

### "AADSTS50011: Reply URL mismatch"
**Cause**: Redirect URI in code doesn't match Azure Portal

**Solution**:
1. Go to Azure Portal → Your app → Authentication
2. Add exact redirect URI: `http://localhost:3000`
3. Save changes
4. Wait 1-2 minutes for changes to propagate
5. Refresh application

### "AADSTS700016: Application not found"
**Cause**: Client ID or Tenant ID is incorrect

**Solution**:
1. Verify Client ID in Azure Portal
2. Verify Tenant ID in Azure Portal
3. Update config.js with correct values
4. Refresh application

### "Network Error" or "Failed to fetch"
**Cause**: CORS or network connectivity issue

**Solution**:
1. Verify you're using http://localhost:3000 (not file://)
2. Check firewall settings
3. Try different network
4. Disable VPN temporarily

## Still Stuck?

### Get Detailed Error Information
1. Open browser console (F12)
2. Take screenshot of Console tab
3. Take screenshot of Network tab
4. Note any red error messages

### Check These Files
1. Verify `index.html` loads correctly
2. Verify all script files load (config.js, auth.js, etc.)
3. Check for JavaScript syntax errors

### Test Basic Functionality
Create a simple test file to verify setup:

```html
<!DOCTYPE html>
<html>
<head>
    <title>MSAL Test</title>
    <script src="https://alcdn.msauth.net/browser/2.38.1/js/msal-browser.min.js"></script>
</head>
<body>
    <h1>MSAL Test</h1>
    <div id="status"></div>
    <script>
        const statusDiv = document.getElementById('status');
        
        // Test 1: Check if MSAL loaded
        if (typeof msal !== 'undefined') {
            statusDiv.innerHTML += '<p>✅ MSAL library loaded</p>';
        } else {
            statusDiv.innerHTML += '<p>❌ MSAL library NOT loaded</p>';
        }
        
        // Test 2: Try to create MSAL instance
        try {
            const msalConfig = {
                auth: {
                    clientId: '4f0d7303-ca48-48e5-849d-f33edf4721a8',
                    authority: 'https://login.microsoftonline.com/61086661-96f9-4806-96af-c943028bb27e',
                    redirectUri: 'http://localhost:3000'
                }
            };
            const msalInstance = new msal.PublicClientApplication(msalConfig);
            statusDiv.innerHTML += '<p>✅ MSAL instance created successfully</p>';
        } catch (error) {
            statusDiv.innerHTML += '<p>❌ Error creating MSAL instance: ' + error.message + '</p>';
        }
    </script>
</body>
</html>
```

Save as `test.html` and open in browser to diagnose the issue.

## Contact Information

If you're still experiencing issues:
1. Check all error messages in browser console
2. Verify Azure Portal configuration
3. Try the test.html file above
4. Review the main README.md for setup steps

---

**Last Updated**: 2026-03-13