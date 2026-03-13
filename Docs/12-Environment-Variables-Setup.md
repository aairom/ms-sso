# Environment Variables Setup Guide

## Overview

This project uses a `.env` file to store sensitive configuration values like Client IDs, Tenant IDs, and SharePoint URLs. This approach keeps sensitive information out of version control and makes it easy to configure the application for different environments.

## Why Use .env Files?

✅ **Security**: Sensitive credentials are never committed to Git  
✅ **Flexibility**: Easy to switch between development, staging, and production  
✅ **Simplicity**: All configuration in one place  
✅ **Best Practice**: Industry-standard approach for managing secrets

## Quick Setup

### Step 1: Copy the Template

Copy `.env.example` to create your `.env` file:

```bash
cp .env.example .env
```

### Step 2: Fill in Your Values

Open `.env` in a text editor and replace the placeholder values with your actual Azure AD and SharePoint information:

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

### 1. Environment Loader

The `scripts/env-loader.js` file loads and parses the `.env` file:

```javascript
// Loads .env file and makes variables available
await loadEnv();

// Access variables using getEnv()
const clientId = getEnv('CLIENT_ID', 'default-value');
```

### 2. Configuration

The `scripts/config.js` file uses environment variables:

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

1. `env-loader.js` - Loads environment variables
2. `config.js` - Uses environment variables
3. `auth.js` - Uses configuration
4. `sharepoint.js` - Uses configuration
5. `ui.js` - Uses configuration

## Security Best Practices

### ✅ DO

- ✅ Keep `.env` file in `.gitignore`
- ✅ Use `.env.example` as a template (without real values)
- ✅ Store real credentials only in `.env`
- ✅ Use different `.env` files for different environments
- ✅ Rotate credentials regularly

### ❌ DON'T

- ❌ Never commit `.env` to Git
- ❌ Never share `.env` file publicly
- ❌ Never put real credentials in `.env.example`
- ❌ Never hardcode credentials in source code
- ❌ Never email or message `.env` file contents

## Troubleshooting

### Problem: "Environment variables not loaded"

**Solution**: Ensure `.env` file exists in the project root:

```bash
# Check if .env exists
ls -la .env

# If not, copy from template
cp .env.example .env
```

### Problem: "Authentication fails with placeholder values"

**Solution**: Verify you've replaced all placeholder values in `.env`:

```bash
# Check for placeholder values
grep "YOUR_" .env
grep "your-" .env

# Should return no results if properly configured
```

### Problem: "Cannot read .env file"

**Solution**: Ensure you're running the app through a web server (not file://):

```bash
# Start a local server
python -m http.server 3000
# or
npx http-server -p 3000
```

### Problem: "CORS error when loading .env"

**Solution**: The `.env` file must be served by the same web server as your application. Ensure:

1. `.env` is in the project root
2. You're accessing via `http://localhost:3000` (not `file://`)
3. Your web server is configured to serve `.env` files

## Multiple Environments

### Development Environment

Create `.env.development`:

```env
CLIENT_ID=dev-client-id
TENANT_ID=dev-tenant-id
TENANT_NAME=dev-tenant
```

### Production Environment

Create `.env.production`:

```env
CLIENT_ID=prod-client-id
TENANT_ID=prod-tenant-id
TENANT_NAME=prod-tenant
```

### Switching Environments

```bash
# Use development
cp .env.development .env

# Use production
cp .env.production .env
```

## Verification Checklist

Before running the application, verify:

- [ ] `.env` file exists in project root
- [ ] `CLIENT_ID` is set to your Azure AD Application ID
- [ ] `TENANT_ID` is set to your Azure AD Tenant ID
- [ ] `TENANT_NAME` matches your SharePoint tenant
- [ ] `TENANT_DOMAIN` matches your SharePoint domain
- [ ] SharePoint site URLs are correct
- [ ] No placeholder values remain (no `YOUR_` or `your-`)
- [ ] `.env` is listed in `.gitignore`

## Example Configuration

Here's a complete example (with fake values):

```env
# Azure AD Configuration
CLIENT_ID=a1b2c3d4-e5f6-7890-abcd-ef1234567890
TENANT_ID=9876fedc-ba09-8765-4321-0fedcba98765

# SharePoint Configuration
TENANT_NAME=contoso
TENANT_DOMAIN=contoso.sharepoint.com

# SharePoint Sites
SITE_A_URL=https://contoso.sharepoint.com/sites/marketing
SITE_A_PAGE=https://contoso.sharepoint.com/sites/marketing/SitePages/Home.aspx
SITE_B_URL=https://contoso.sharepoint.com/sites/sales
SITE_B_PAGE=https://contoso.sharepoint.com/sites/sales/SitePages/Home.aspx

# Test Users
ADMIN_EMAIL=admin@contoso.onmicrosoft.com
USER1_EMAIL=john.doe@contoso.onmicrosoft.com
USER2_EMAIL=jane.smith@contoso.onmicrosoft.com
```

## Additional Resources

- [Azure AD App Registration Guide](Docs/02-Azure-Setup-Guide.md)
- [Configuration Guide](Docs/03-Implementation-Guide.md)
- [Troubleshooting Guide](Docs/05-Troubleshooting-Loading-Issue.md)

---

**Last Updated**: 2026-03-13  
**Related Files**: `.env`, `.env.example`, `scripts/env-loader.js`, `scripts/config.js`