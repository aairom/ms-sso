# SharePoint Site Path Configuration Fix

## Problem: 404 "itemNotFound" Error

When accessing SharePoint sites through the application, you may encounter this error:

```
Graph API error: 404 - {"error":{"code":"itemNotFound","message":"Requested site could not be found"}}
```

## Root Cause

The Microsoft Graph API endpoint for accessing SharePoint sites requires the **exact site path** that matches your SharePoint site structure. The error occurs when the `siteRelativePath` in the configuration doesn't match the actual site path in SharePoint.

### Graph API Endpoint Format

```
https://graph.microsoft.com/v1.0/sites/{hostname}:/{site-path}
```

For example:
- ✅ Correct: `https://graph.microsoft.com/v1.0/sites/3w2lyf.sharepoint.com:/sites/aamSite`
- ❌ Wrong: `https://graph.microsoft.com/v1.0/sites/3w2lyf.sharepoint.com:/sites/siteA`

## Solution

### Step 1: Identify Your Actual Site Paths

From your SharePoint site URLs, extract the site path:

**Example:**
- Full URL: `https://3w2lyf.sharepoint.com/sites/aamSite/SitePages/CollabHome.aspx`
- Site Path: `/sites/aamSite`

**Another Example:**
- Full URL: `https://3w2lyf.sharepoint.com/sites/aamSiteNumber2/SitePages/CollabHome.aspx`
- Site Path: `/sites/aamSiteNumber2`

### Step 2: Update env-config.js

Add the `SITE_A_PATH` and `SITE_B_PATH` variables to your `scripts/env-config.js`:

```javascript
window.ENV_CONFIG = {
    CLIENT_ID: 'your-client-id',
    TENANT_ID: 'your-tenant-id',
    TENANT_NAME: 'xxx',
    TENANT_DOMAIN: 'xxx.sharepoint.com',
    
    // Site A Configuration
    SITE_A_URL: 'https://xxx.sharepoint.com/sites/yoursite',
    SITE_A_PATH: '/sites/aamSite',  // ← Add this line
    SITE_A_PAGE: 'https://xxx.sharepoint.com/sites/yoursite/SitePages/CollabHome.aspx',
    
    // Site B Configuration
    SITE_B_URL: 'https://xxx.sharepoint.com/sites/yoursite2',
    SITE_B_PATH: '/sites/yoursite2',  // ← Add this line
    SITE_B_PAGE: 'https://xxx.sharepoint.com/sites/yoursite2/SitePages/CollabHome.aspx',
    
    // User emails...
};
```

### Step 3: Verify config.js Uses Environment Variables

The `scripts/config.js` should now reference these environment variables:

```javascript
const sharepointConfig = {
    tenant: getEnv('TENANT_NAME', 'contoso'),
    tenantDomain: getEnv('TENANT_DOMAIN', 'contoso.sharepoint.com'),
    
    sites: [
        {
            name: 'Site A',
            url: getEnv('SITE_A_URL', 'https://contoso.sharepoint.com/sites/siteA'),
            siteRelativePath: getEnv('SITE_A_PATH', '/sites/siteA'),  // ← Uses env variable
            pageUrl: getEnv('SITE_A_PAGE', 'https://contoso.sharepoint.com/sites/siteA/SitePages/Home.aspx'),
            description: 'Primary collaboration site'
        },
        {
            name: 'Site B',
            url: getEnv('SITE_B_URL', 'https://contoso.sharepoint.com/sites/siteB'),
            siteRelativePath: getEnv('SITE_B_PATH', '/sites/siteB'),  // ← Uses env variable
            pageUrl: getEnv('SITE_B_PAGE', 'https://contoso.sharepoint.com/sites/siteB/SitePages/Home.aspx'),
            description: 'Secondary collaboration site'
        }
    ]
};
```

### Step 4: Clear Cache and Reload

1. **Hard refresh** the browser: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. **Clear browser cache** if the issue persists
3. **Sign out and sign in again** to get fresh tokens

## Verification

After making these changes, the application should:

1. ✅ Successfully authenticate with Microsoft Entra ID
2. ✅ Load both SharePoint sites without 404 errors
3. ✅ Display site information, lists, and documents

## Common Mistakes

### ❌ Wrong: Hardcoded Generic Paths
```javascript
siteRelativePath: '/sites/siteA',  // Generic name doesn't match actual site
```

### ✅ Correct: Actual Site Paths from Environment
```javascript
siteRelativePath: getEnv('SITE_A_PATH', '/sites/siteA'),  // Matches actual SharePoint site
```

### ❌ Wrong: Trailing Slash in URL
```javascript
SITE_B_URL: 'https://3w2lyf.sharepoint.com/sites/yoursite2/',  // Extra slash
```

### ✅ Correct: No Trailing Slash
```javascript
SITE_B_URL: 'https://xxx.sharepoint.com/sites/yoursite2',  // Clean URL
```

## How to Find Your Site Path

### Method 1: From SharePoint URL
1. Open your SharePoint site in a browser
2. Look at the URL in the address bar
3. Extract the path between the domain and `/SitePages/`

**Example:**
```
https://xxx.sharepoint.com/sites/yoursite/SitePages/CollabHome.aspx
                                 ^^^^^^^^^^^^^^^^
                                 This is your site path: /sites/yoursite
```

### Method 2: Using SharePoint Site Settings
1. Go to your SharePoint site
2. Click the gear icon (⚙️) → **Site Settings**
3. Look for **Site URL** or **Web Server Relative URL**

### Method 3: Using Microsoft Graph Explorer
1. Go to [Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer)
2. Sign in with your account
3. Try this query:
   ```
   GET https://graph.microsoft.com/v1.0/sites?search=*
   ```
4. Find your site in the results and note the `webUrl` property

## Testing the Fix

After updating the configuration:

1. **Open Browser Console** (F12)
2. **Sign in** to the application
3. **Check Console Logs** for:
   ```
   Calling Graph API: GET https://graph.microsoft.com/v1.0/sites/xxx.sharepoint.com:/sites/yoursite
   Site info retrieved: {id: "...", displayName: "...", ...}
   ```

4. **Verify Site Cards** show:
   - ✅ Site name and description
   - ✅ Last modified date
   - ✅ "Open Site" button works

## Related Documentation

- [Environment Variables Setup](./12-Environment-Variables-Setup.md)
- [Azure Setup Guide](./02-Azure-Setup-Guide.md)
- [Troubleshooting Guide](./03-Troubleshooting-Guide.md)

## Summary

The 404 error occurs when the `siteRelativePath` doesn't match your actual SharePoint site structure. Always ensure:

1. ✅ Site paths match your actual SharePoint URLs
2. ✅ No trailing slashes in URLs
3. ✅ Environment variables are properly configured
4. ✅ Browser cache is cleared after configuration changes

---

*Last Updated: 2026-03-13*