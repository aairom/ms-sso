/**
 * Microsoft Entra ID (Azure AD) Configuration
 *
 * This configuration loads sensitive values from the .env file.
 * Copy .env.example to .env and fill in your actual values.
 *
 * Follow the setup guide in Docs/02-Azure-Setup-Guide.md to get these values
 */

// MSAL 1.x Configuration (Implicit Flow - No PKCE)
const msalConfig = {
    auth: {
        // Application (client) ID from .env file
        // Fallback to placeholder if .env not loaded
        clientId: getEnv('CLIENT_ID', 'YOUR_CLIENT_ID_HERE'),
        
        // Directory (tenant) ID from .env file
        // Fallback to placeholder if .env not loaded
        authority: `https://login.microsoftonline.com/${getEnv('TENANT_ID', 'YOUR_TENANT_ID_HERE')}`,
        
        // Redirect URI - must match Azure Portal configuration
        redirectUri: 'http://localhost:3000',
        
        // Post logout redirect URI
        postLogoutRedirectUri: 'http://localhost:3000',
        
        // Navigate to login request URL after logout
        navigateToLoginRequestUrl: false
    },
    cache: {
        // Cache location: "localStorage" or "sessionStorage"
        cacheLocation: 'sessionStorage',
        
        // Store auth state in cookie for IE11 compatibility
        storeAuthStateInCookie: false
    },
    // No system/logger configuration - MSAL 1.x will use defaults
};

/**
 * Scopes (permissions) requested from Microsoft Graph API
 * These must be configured in Azure Portal under API permissions
 */
// Login request configuration for MSAL 1.x
const loginRequest = {
    scopes: [
        'User.Read',           // Read user profile
        'Sites.Read.All',      // Read all site collections
        'Files.Read.All'       // Read all files user can access
    ],
    prompt: 'select_account'  // Prompt user to select account
};

/**
 * Scopes for acquiring tokens silently
 * Used when making API calls after initial login
 */
const tokenRequest = {
    scopes: [
        'User.Read',
        'Sites.Read.All',
        'Files.Read.All'
    ],
    forceRefresh: false // Set to true to skip cache and force token refresh
};

/**
 * Microsoft Graph API endpoints
 */
const graphConfig = {
    // Base URL for Microsoft Graph API
    graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
    
    // Get user's photo
    graphPhotoEndpoint: 'https://graph.microsoft.com/v1.0/me/photo/$value',
    
    // Get SharePoint sites
    graphSitesEndpoint: 'https://graph.microsoft.com/v1.0/sites',
    
    // Get site by path
    // Usage: graphSiteByPathEndpoint.replace('{hostname}', 'tenant.sharepoint.com').replace('{site-path}', '/sites/sitename')
    graphSiteByPathEndpoint: 'https://graph.microsoft.com/v1.0/sites/{hostname}:/{site-path}',
    
    // Get site lists
    // Usage: graphSiteListsEndpoint.replace('{site-id}', 'actual-site-id')
    graphSiteListsEndpoint: 'https://graph.microsoft.com/v1.0/sites/{site-id}/lists',
    
    // Get list items
    // Usage: graphListItemsEndpoint.replace('{site-id}', 'id').replace('{list-id}', 'id')
    graphListItemsEndpoint: 'https://graph.microsoft.com/v1.0/sites/{site-id}/lists/{list-id}/items'
};

/**
 * SharePoint site configurations
 * Loads from .env file with fallback to default values
 */
const sharepointConfig = {
    // Tenant information from .env
    tenant: getEnv('TENANT_NAME', 'contoso'),
    tenantDomain: getEnv('TENANT_DOMAIN', 'contoso.sharepoint.com'),
    
    // SharePoint sites from .env
    sites: [
        {
            name: 'Site A',
            url: getEnv('SITE_A_URL', 'https://contoso.sharepoint.com/sites/siteA'),
            siteRelativePath: getEnv('SITE_A_PATH', '/sites/siteA'),
            pageUrl: getEnv('SITE_A_PAGE', 'https://contoso.sharepoint.com/sites/siteA/SitePages/Home.aspx'),
            description: 'Primary collaboration site'
        },
        {
            name: 'Site B',
            url: getEnv('SITE_B_URL', 'https://contoso.sharepoint.com/sites/siteB'),
            siteRelativePath: getEnv('SITE_B_PATH', '/sites/siteB'),
            pageUrl: getEnv('SITE_B_PAGE', 'https://contoso.sharepoint.com/sites/siteB/SitePages/Home.aspx'),
            description: 'Secondary collaboration site'
        }
    ],
    
    // SharePoint REST API base URL
    // Usage: restApiBase + site.siteRelativePath + '/_api/web'
    restApiBase: `https://${getEnv('TENANT_DOMAIN', 'contoso.sharepoint.com')}`
};

/**
 * Test users for the application
 * Loads from .env file with fallback to default values
 */
const testUsers = [
    {
        email: getEnv('ADMIN_EMAIL', 'admin@contoso.onmicrosoft.com'),
        role: 'Administrator',
        description: 'Admin user with full access'
    },
    {
        email: getEnv('USER1_EMAIL', 'user1@contoso.onmicrosoft.com'),
        role: 'User',
        description: 'Standard user'
    },
    {
        email: getEnv('USER2_EMAIL', 'user2@contoso.onmicrosoft.com'),
        role: 'User',
        description: 'Standard user'
    }
];

/**
 * Application settings
 */
const appConfig = {
    // Application name
    appName: 'SharePoint SSO Demo',
    
    // Application version
    version: '1.0.0',
    
    // Enable debug mode (shows more console logs)
    debugMode: true,
    
    // Auto-refresh interval for SharePoint data (in milliseconds)
    // Set to 0 to disable auto-refresh
    autoRefreshInterval: 0, // 5 minutes = 300000
    
    // Maximum number of items to display per list
    maxItemsPerList: 10,
    
    // Show detailed error messages to users
    showDetailedErrors: true
};

/**
 * UI Configuration
 */
const uiConfig = {
    // Theme colors
    colors: {
        primary: '#0078d4',      // Microsoft blue
        secondary: '#036c70',    // SharePoint teal
        success: '#107c10',      // Green
        error: '#d13438',        // Red
        warning: '#ffa500',      // Orange
        info: '#0078d4'          // Blue
    },
    
    // Animation durations (in milliseconds)
    animations: {
        fadeIn: 300,
        fadeOut: 200,
        slideIn: 400
    },
    
    // Loading messages
    loadingMessages: {
        authenticating: 'Authenticating with Microsoft Entra ID...',
        loadingProfile: 'Loading user profile...',
        loadingSharePoint: 'Loading SharePoint data...',
        fetchingSites: 'Fetching site information...'
    }
};

// Export configuration objects for use in other scripts
// Note: In a module system, you would use: export { msalConfig, loginRequest, ... }
// For vanilla JS with script tags, these are available globally

// Made with Bob
