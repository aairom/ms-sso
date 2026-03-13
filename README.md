# SharePoint SSO Demo - Microsoft Entra ID

A comprehensive demonstration of Single Sign-On (SSO) implementation using Microsoft Entra ID (formerly Azure Active Directory) to authenticate users and access SharePoint sites.

## 🎯 Overview

This project demonstrates how to:
- Implement SSO authentication using Microsoft Entra ID
- Access multiple SharePoint sites with a single login
- Use Microsoft Graph API and SharePoint REST API
- Build a modern web application with MSAL.js

## 📋 Prerequisites

- Azure subscription with admin access
- Access to Azure Portal (https://portal.azure.com)
- SharePoint Online sites
- Modern web browser (Chrome, Edge, Firefox, Safari)
- Basic knowledge of HTML, CSS, and JavaScript

## 🏗️ Project Structure

```
ms-sso/
├── Docs/                           # Comprehensive documentation
│   ├── 01-SSO-Overview.md         # SSO concepts and architecture
│   ├── 02-Azure-Setup-Guide.md    # Step-by-step Azure configuration
│   └── 03-Implementation-Guide.md # Technical implementation details
├── scripts/                        # JavaScript modules
│   ├── config.js                  # Configuration settings
│   ├── auth.js                    # Authentication logic (MSAL)
│   ├── sharepoint.js              # SharePoint API integration
│   └── ui.js                      # UI management
├── index.html                      # Main application page
├── styles.css                      # Application styles
└── README.md                       # This file
```

## 🚀 Quick Start

### Step 1: Azure Portal Configuration

1. **Register Application in Azure Portal**
   - Navigate to Azure Portal → Microsoft Entra ID → App registrations
   - Click "New registration"
   - Name: `SharePoint SSO Demo`
   - Supported account types: Single tenant
   - Redirect URI: `http://localhost:3000` (Single-page application)
   - Click "Register"

2. **Note Important Values**
   ```
   Application (client) ID: [COPY THIS]
   Directory (tenant) ID: [COPY THIS]
   ```

3. **Configure Authentication**
   - Go to Authentication
   - Add redirect URIs:
     - `http://localhost:3000`
     - `http://localhost:3000/callback`
   - Enable "Access tokens" and "ID tokens"
   - Save changes

4. **Add API Permissions**
   - Go to API permissions
   - Add Microsoft Graph permissions:
     - `User.Read`
     - `Sites.Read.All`
     - `Files.Read.All`
     - `offline_access`
   - Grant admin consent

📖 **Detailed instructions**: See [Docs/02-Azure-Setup-Guide.md](Docs/02-Azure-Setup-Guide.md)

### Step 2: Configure Application

1. **Create Environment Configuration File**
   
   Copy the template to create your configuration:

   ```bash
   cp scripts/env-config.js.example scripts/env-config.js
   ```

2. **Update Configuration Values**
   
   Open `scripts/env-config.js` and replace the placeholder values with your actual Azure AD and SharePoint information:

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
       SITE_A_PATH: '/sites/siteA',
       SITE_A_PAGE: 'https://your-tenant-name.sharepoint.com/sites/siteA/SitePages/Home.aspx',
       SITE_B_URL: 'https://your-tenant-name.sharepoint.com/sites/siteB',
       SITE_B_PATH: '/sites/siteB',
       SITE_B_PAGE: 'https://your-tenant-name.sharepoint.com/sites/siteB/SitePages/Home.aspx',
       
       // Test Users (optional)
       ADMIN_EMAIL: 'admin@your-tenant-name.onmicrosoft.com',
       USER1_EMAIL: 'user1@your-tenant-name.onmicrosoft.com',
       USER2_EMAIL: 'user2@your-tenant-name.onmicrosoft.com'
   };
   ```

   ⚠️ **Important**:
   - Never commit `scripts/env-config.js` to Git (it's in `.gitignore`)
   - Only commit `scripts/env-config.js.example` (the template)
   - The `.env` file is an alternative configuration method (also supported)

### Step 3: Run the Application

1. **Start a Local Web Server**

   The application must be served over HTTP (not file://). Choose one method:

   **Option A: Using Python**
   ```bash
   # Python 3
   python -m http.server 3000
   
   # Python 2
   python -m SimpleHTTPServer 3000
   ```

   **Option B: Using Node.js (http-server)**
   ```bash
   npx http-server -p 3000
   ```

   **Option C: Using PHP**
   ```bash
   php -S localhost:3000
   ```

   **Option D: Using VS Code Live Server**
   - Install "Live Server" extension
   - Right-click `index.html`
   - Select "Open with Live Server"

2. **Open in Browser**
   
   Navigate to: `http://localhost:3000`

3. **Sign In**
   
   Click "Sign In with Microsoft" and use one of the test users:
   - `admin@contoso.onmicrosoft.com`
   - `user1@contoso.onmicrosoft.com`
   - `user2@contoso.onmicrosoft.com`

## 🔑 Test Users

| Email | Role | Description |
|-------|------|-------------|
| admin@contoso.onmicrosoft.com | Administrator | Full access to all sites |
| user1@contoso.onmicrosoft.com | User | Standard user access |
| user2@contoso.onmicrosoft.com | User | Standard user access |

## 🌐 SharePoint Sites

The application connects to these SharePoint sites:

1. **AAM Site**
   - URL: https://contoso.sharepoint.com/sites/aamSite
   - Page: https://contoso.sharepoint.com/sites/aamSite/SitePages/CollabHome.aspx

2. **AAM Site Number 2**
   - URL: https://contoso.sharepoint.com/sites/aamSiteNumber2
   - Page: https://contoso.sharepoint.com/sites/aamSiteNumber2/SitePages/CollabHome.aspx

## 📚 Features

### Authentication
- ✅ Single Sign-On with Microsoft Entra ID
- ✅ Secure token management with MSAL.js
- ✅ Automatic token refresh
- ✅ Sign in/Sign out functionality

### SharePoint Integration
- ✅ Access multiple SharePoint sites
- ✅ View site information and metadata
- ✅ List site libraries and lists
- ✅ Test connectivity to sites
- ✅ Direct links to SharePoint pages

### User Interface
- ✅ Modern, responsive design
- ✅ User profile display with photo
- ✅ Real-time loading indicators
- ✅ Error handling and notifications
- ✅ Site cards with detailed information

## 🔧 Configuration Options

### Authentication Settings

In `scripts/config.js`, you can customize:

```javascript
// Cache location
cacheLocation: 'sessionStorage'  // or 'localStorage'

// Logging level
logLevel: msal.LogLevel.Info     // Error, Warning, Info, Verbose

// Token refresh
forceRefresh: false              // Set to true to skip cache
```

### API Scopes

Modify requested permissions in `config.js`:

```javascript
const loginRequest = {
    scopes: [
        'User.Read',
        'Sites.Read.All',
        'Files.Read.All',
        'offline_access'
    ]
};
```

### UI Settings

Customize appearance in `config.js`:

```javascript
const uiConfig = {
    colors: {
        primary: '#0078d4',
        secondary: '#036c70',
        // ...
    },
    maxItemsPerList: 10,
    showDetailedErrors: true
};
```

## 🐛 Troubleshooting

### Common Issues

#### 1. "AADSTS50011: Reply URL mismatch"
**Solution**: Verify redirect URI in Azure Portal matches your application URL exactly.

#### 2. "AADSTS65001: User has not consented"
**Solution**: Grant admin consent for API permissions in Azure Portal.

#### 3. "CORS Error"
**Solution**: Ensure you're running the app through a web server, not opening the HTML file directly.

#### 4. "404 itemNotFound - Requested site could not be found"
**Solution**:
- Verify SharePoint site paths match your actual sites
- Check `SITE_A_PATH` and `SITE_B_PATH` in env-config.js
- See [Docs/13-SharePoint-Site-Path-Fix.md](Docs/13-SharePoint-Site-Path-Fix.md) for detailed fix

#### 5. "Failed to fetch SharePoint data"
**Solution**:
- Verify API permissions are granted
- Check that SharePoint site URLs are correct
- Ensure user has access to the SharePoint sites

#### 5. "Application not found"
**Solution**: Verify Client ID and Tenant ID in `config.js` are correct.

### Debug Mode

Enable detailed logging in `config.js`:

```javascript
const appConfig = {
    debugMode: true,
    showDetailedErrors: true
};
```

Check browser console (F12) for detailed error messages.

## 📖 Documentation

Comprehensive documentation is available in the `Docs/` folder:

1. **[01-SSO-Overview.md](Docs/01-SSO-Overview.md)**
   - SSO concepts and benefits
   - Architecture diagrams
   - Authentication flow
   - Security considerations

2. **[02-Azure-Setup-Guide.md](Docs/02-Azure-Setup-Guide.md)**
   - Step-by-step Azure configuration
   - App registration process
   - Permission setup
   - Troubleshooting Azure issues

3. **[03-Implementation-Guide.md](Docs/03-Implementation-Guide.md)**
   - Technical architecture
   - Component details
   - API integration
   - Best practices

4. **[12-Environment-Variables-Setup.md](Docs/12-Environment-Variables-Setup.md)**
   - Environment configuration guide
   - env-config.js setup
   - Alternative .env file method
   - Security best practices
   - Troubleshooting

5. **[13-SharePoint-Site-Path-Fix.md](Docs/13-SharePoint-Site-Path-Fix.md)**
   - Fix for 404 "itemNotFound" errors
   - SharePoint site path configuration
   - How to find your actual site paths
   - Common mistakes and solutions

## 🔒 Security Best Practices

1. **Use env-config.js**: Store all sensitive configuration in `scripts/env-config.js` (never commit to Git)
2. **Never commit secrets**: Both `scripts/env-config.js` and `.env` are in `.gitignore` - keep it that way
3. **Use templates only**: Only commit `.example` files (env-config.js.example, .env.example)
4. **Use HTTPS in production**: Always use HTTPS for production deployments
5. **Limit permissions**: Request only necessary API permissions
6. **Token storage**: MSAL handles secure token storage automatically
7. **Regular updates**: Keep MSAL.js library updated
8. **Rotate credentials**: Regularly update Client IDs and secrets

## 🚀 Deployment

### Production Deployment

1. **Update Configuration**
   - Change redirect URIs to production URLs
   - Use HTTPS
   - Update Azure Portal redirect URIs

2. **Build for Production**
   - Minify JavaScript and CSS
   - Optimize images
   - Enable caching

3. **Deploy to Hosting**
   - Azure Static Web Apps
   - GitHub Pages
   - Netlify
   - Vercel
   - Any static hosting service

4. **Update Azure Portal**
   - Add production redirect URIs
   - Update CORS settings if needed

## 🤝 Contributing

This is a demonstration project. Feel free to:
- Fork the repository
- Create feature branches
- Submit pull requests
- Report issues

## 📝 License

This project is provided as-is for educational and demonstration purposes.

## 🔗 Useful Links

- [Microsoft Entra ID Documentation](https://learn.microsoft.com/en-us/entra/identity/)
- [MSAL.js Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js)
- [Microsoft Graph API](https://learn.microsoft.com/en-us/graph/api/overview)
- [SharePoint REST API](https://learn.microsoft.com/en-us/sharepoint/dev/sp-add-ins/get-to-know-the-sharepoint-rest-service)
- [Azure Portal](https://portal.azure.com)

## 📞 Support

For issues or questions:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Review the documentation in `Docs/`
3. Check browser console for error messages
4. Verify Azure Portal configuration

## 🎓 Learning Resources

- [OAuth 2.0 and OpenID Connect](https://learn.microsoft.com/en-us/azure/active-directory/develop/v2-protocols)
- [Single Sign-On Concepts](https://learn.microsoft.com/en-us/azure/active-directory/manage-apps/what-is-single-sign-on)
- [Microsoft Identity Platform](https://learn.microsoft.com/en-us/azure/active-directory/develop/)

---

**Version**: 1.0.0  
**Last Updated**: 2026-03-13  
**Author**: SharePoint SSO Demo Team