# Environment Configuration Setup Guide

## Overview

This project uses `scripts/env-config.js` to store sensitive configuration values like Client IDs, Tenant IDs, and SharePoint URLs. This approach keeps sensitive information out of version control and makes it easy to configure the application for different environments.

**Alternative**: You can also use a `.env` file (see Alternative Method section below).

## Why Use env-config.js?

✅ **Security**: Sensitive credentials are never committed to Git
✅ **Synchronous Loading**: No async delays, immediate availability
✅ **Simplicity**: Single JavaScript file, no parsing needed
✅ **Flexibility**: Easy to switch between development, staging, and production
✅ **Best Practice**: Industry-standard approach for managing secrets

## Quick Setup (Recommended Method)

### Step 1: Copy the Template

Copy `scripts/env-config.js.example` to create your configuration file:

```bash
cp scripts/env-config.js.example scripts/env-config.js
```

### Step 2: Fill in Your Values

Open `scripts/env-config.js` in a text editor and replace the placeholder values with your actual Azure AD and SharePoint information:

```javascript
window.ENV_CONFIG = {
    // Azure AD Configuration
    CLIENT_ID: 'your-actual-client-id',
    TENANT_ID: 'your-actual-tenant-id',
    
    // SharePoint Configuration
    TENANT_NAME: 'your-tenant-name',
    TENANT_DOMAIN: 'your-tenant-name.sharepoint.com',
    
    // SharePoint Sites
    SITE_A_URL: 'https://your-tenant-name.sharepoint.com/sites/siteA',
    SITE_A_PAGE: 'https://your-tenant-name.sharepoint.com/sites/siteA/SitePages/Home.aspx',
    SITE_B_URL: 'https://your-tenant-name.sharepoint.com/sites/siteB',
    SITE_B_PAGE: 'https://your-tenant-name.sharepoint.com/sites/siteB/SitePages/Home.aspx',
    
    // Test Users (optional)
    ADMIN_EMAIL: 'admin@your-tenant-name.onmicrosoft.com',
    USER1_EMAIL: 'user1@your-tenant-name.onmicrosoft.com',
    USER2_EMAIL: 'user2@your-tenant-name.onmicrosoft.com'
};
```

## Alternative Method: Using .env File

If you prefer using a `.env` file:

### Step 1: Copy the Template

```bash
cp .env.example .env
```

### Step 2: Fill in Your Values

Open `.env` in a text editor:

```env
# Azure AD Configuration
CLIENT_ID=your-actual-client-id-here
TENANT_ID=your-actual-tenant-id-here

# SharePoint Configuration
TENANT_NAME=your-tenant-name
TENANT_DOMAIN=your-tenant-name.sharepoint.com

# SharePoint Sites
SITE_A_URL=https://your-tenant-name.sharepoint.com/sites/siteA
SITE_A_PAGE=https://your-tenant-name.sharepoint.com/sites/siteA/SitePages/Home.aspx
SITE_B_URL=https://your-tenant-name.sharepoint.com/sites/siteB
SITE_B_PAGE=https://your-tenant-name.sharepoint.com/sites/siteB/SitePages/Home.aspx

# Test Users (optional)
ADMIN_EMAIL=admin@your-tenant-name.onmicrosoft.com
USER1_EMAIL=user1@your-tenant-name.onmicrosoft.com
USER2_EMAIL=user2@your-tenant-name.onmicrosoft.com
```

### Step 3: Get Your Azure AD Values

1. **Go to Azure Portal**: https://portal.azure.com
2. **Navigate to**: Microsoft Entra ID → App registrations → Your app
3. **Copy these values**:
   - **Application (client) ID** → Use for `CLIENT_ID`
   - **Directory (tenant) ID** → Use for `TENANT_ID`

### Step 4: Configure SharePoint URLs

Update the SharePoint URLs to match your actual sites:

```env
TENANT_NAME=contoso
TENANT_DOMAIN=contoso.sharepoint.com
SITE_A_URL=https://contoso.sharepoint.com/sites/aamSite
SITE_A_PAGE=https://contoso.sharepoint.com/sites/aamSite/SitePages/CollabHome.aspx
```

## Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `CLIENT_ID` | Azure AD Application (client) ID | `12345678-1234-1234-1234-123456789abc` |
| `TENANT_ID` | Azure AD Directory (tenant) ID | `87654321-4321-4321-4321-cba987654321` |
| `TENANT_NAME` | Your SharePoint tenant name | `contoso` |
| `TENANT_DOMAIN` | Your SharePoint domain | `contoso.sharepoint.com` |

### SharePoint Site Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `SITE_A_URL` | First SharePoint site URL | `https://contoso.sharepoint.com/sites/siteA` |
| `SITE_A_PAGE` | First site's page URL | `https://contoso.sharepoint.com/sites/siteA/SitePages/Home.aspx` |
| `SITE_B_URL` | Second SharePoint site URL | `https://contoso.sharepoint.com/sites/siteB` |
| `SITE_B_PAGE` | Second site's page URL | `https://contoso.sharepoint.com/sites/siteB/SitePages/Home.aspx` |

### Optional Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `ADMIN_EMAIL` | Admin user email (for documentation) | `admin@contoso.onmicrosoft.com` |
| `USER1_EMAIL` | Test user 1 email | `user1@contoso.onmicrosoft.com` |
| `USER2_EMAIL` | Test user 2 email | `user2@contoso.onmicrosoft.com` |

## How It Works

### 1. Environment Configuration (Recommended)

The `scripts/env-config.js` file provides immediate, synchronous access to configuration:

```javascript
// env-config.js sets window.ENV_CONFIG
window.ENV_CONFIG = {
    CLIENT_ID: 'your-client-id',
    TENANT_ID: 'your-tenant-id',
    // ...
};

// Helper function for easy access
function getEnv(key, defaultValue = '') {
    return window.ENV_CONFIG[key] || defaultValue;
}
```

### 2. Configuration Usage

The `scripts/config.js` file uses the environment configuration:

```javascript
const msalConfig = {
    auth: {
        clientId: getEnv('CLIENT_ID', 'YOUR_CLIENT_ID_HERE'),
        authority: `https://login.microsoftonline.com/${getEnv('TENANT_ID', 'YOUR_TENANT_ID_HERE')}`
    }
};
```

### 3. Loading Order

The application loads files in this order:

1. `env-config.js` - Sets window.ENV_CONFIG (synchronous)
2. `config.js` - Uses getEnv() to read configuration
3. `auth.js` - Uses configuration
4. `sharepoint.js` - Uses configuration
5. `ui.js` - Uses configuration

**Key Advantage**: No async delays, configuration is immediately available.

## Security Best Practices

### ✅ DO

- ✅ Keep `scripts/env-config.js` in `.gitignore`
- ✅ Use `scripts/env-config.js.example` as a template (without real values)
- ✅ Store real credentials only in `scripts/env-config.js`
- ✅ Use different env-config.js files for different environments
- ✅ Rotate credentials regularly
- ✅ Also keep `.env` in `.gitignore` if using alternative method

### ❌ DON'T

- ❌ Never commit `scripts/env-config.js` to Git
- ❌ Never share `scripts/env-config.js` file publicly
- ❌ Never put real credentials in `scripts/env-config.js.example`
- ❌ Never hardcode credentials in source code
- ❌ Never email or message configuration files with real credentials

## Troubleshooting

### Problem: "Environment configuration not loaded"

**Solution**: Ensure `scripts/env-config.js` exists:

```bash
# Check if env-config.js exists
ls -la scripts/env-config.js

# If not, copy from template
cp scripts/env-config.js.example scripts/env-config.js
```

### Problem: "Authentication fails with placeholder values"

**Solution**: Verify you've replaced all placeholder values in `scripts/env-config.js`:

```bash
# Check for placeholder values
grep "YOUR_" scripts/env-config.js
grep "your-" scripts/env-config.js

# Should return no results if properly configured
```

### Problem: "endpoints_resolution_error"

**Solution**: This means CLIENT_ID or TENANT_ID are undefined. Check:

1. `scripts/env-config.js` exists and has real values
2. File is loaded before `config.js` in `index.html`
3. No syntax errors in `env-config.js`

```html
<!-- Correct order in index.html -->
<script src="scripts/env-config.js"></script>
<script src="scripts/config.js"></script>
```

### Problem: "Cannot read property of undefined"

**Solution**: Ensure `window.ENV_CONFIG` is set before other scripts load:

```javascript
// Check in browser console
console.log(window.ENV_CONFIG);
// Should show your configuration object
```

## Multiple Environments

### Development Environment

Create `scripts/env-config.dev.js`:

```javascript
window.ENV_CONFIG = {
    CLIENT_ID: 'dev-client-id',
    TENANT_ID: 'dev-tenant-id',
    TENANT_NAME: 'dev-tenant',
    // ...
};
```

### Production Environment

Create `scripts/env-config.prod.js`:

```javascript
window.ENV_CONFIG = {
    CLIENT_ID: 'prod-client-id',
    TENANT_ID: 'prod-tenant-id',
    TENANT_NAME: 'prod-tenant',
    // ...
};
```

### Switching Environments

```bash
# Use development
cp scripts/env-config.dev.js scripts/env-config.js

# Use production
cp scripts/env-config.prod.js scripts/env-config.js
```

**Tip**: Add `scripts/env-config.*.js` to `.gitignore` to exclude all environment-specific files.

## Verification Checklist

Before running the application, verify:

- [ ] `scripts/env-config.js` file exists
- [ ] `CLIENT_ID` is set to your Azure AD Application ID
- [ ] `TENANT_ID` is set to your Azure AD Tenant ID
- [ ] `TENANT_NAME` matches your SharePoint tenant
- [ ] `TENANT_DOMAIN` matches your SharePoint domain
- [ ] SharePoint site URLs are correct
- [ ] No placeholder values remain (no `YOUR_` or `your-`)
- [ ] `scripts/env-config.js` is listed in `.gitignore`
- [ ] `scripts/env-config.js` loads before `config.js` in `index.html`

## Example Configuration

Here's a complete example (with fake values):

```javascript
// scripts/env-config.js
window.ENV_CONFIG = {
    // Azure AD Configuration
    CLIENT_ID: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    TENANT_ID: '9876fedc-ba09-8765-4321-0fedcba98765',
    
    // SharePoint Configuration
    TENANT_NAME: 'contoso',
    TENANT_DOMAIN: 'contoso.sharepoint.com',
    
    // SharePoint Sites
    SITE_A_URL: 'https://contoso.sharepoint.com/sites/marketing',
    SITE_A_PAGE: 'https://contoso.sharepoint.com/sites/marketing/SitePages/Home.aspx',
    SITE_B_URL: 'https://contoso.sharepoint.com/sites/sales',
    SITE_B_PAGE: 'https://contoso.sharepoint.com/sites/sales/SitePages/Home.aspx',
    
    // Test Users
    ADMIN_EMAIL: 'admin@contoso.onmicrosoft.com',
    USER1_EMAIL: 'john.doe@contoso.onmicrosoft.com',
    USER2_EMAIL: 'jane.smith@contoso.onmicrosoft.com'
};

function getEnv(key, defaultValue = '') {
    return window.ENV_CONFIG[key] || defaultValue;
}
```

## Additional Resources

- [Azure AD App Registration Guide](02-Azure-Setup-Guide.md)
- [Configuration Guide](03-Implementation-Guide.md)
- [Troubleshooting Guide](05-Troubleshooting-Loading-Issue.md)

## Summary

**Recommended Approach**: Use `scripts/env-config.js`
- ✅ Synchronous loading (no delays)
- ✅ Immediate availability
- ✅ Simple JavaScript object
- ✅ No parsing required

**Alternative Approach**: Use `.env` file
- ⚠️ Requires async loading
- ⚠️ May cause timing issues
- ✅ Industry standard format
- ✅ Works with build tools

---

**Last Updated**: 2026-03-13
**Related Files**: `scripts/env-config.js`, `scripts/env-config.js.example`, `.env`, `.env.example`, `scripts/config.js`