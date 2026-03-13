/**
 * Microsoft Entra ID (Azure AD) Configuration
 * 
 * IMPORTANT: Replace the placeholder values with your actual Azure AD app registration details
 * Follow the setup guide in Docs/02-Azure-Setup-Guide.md to get these values
 */

// MSAL 1.x Configuration (Implicit Flow - No PKCE)
const msalConfig = {
    auth: {
        // Application (client) ID from Azure Portal
        clientId: '4f0d7303-ca48-48e5-849d-f33edf4721a8',
        
        // Authority URL with tenant ID
        authority: 'https://login.microsoftonline.com/61086661-96f9-4806-96af-c943028bb27e',
        
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
 * Your actual SharePoint sites
 */
const sharepointConfig = {
    // Tenant information
    tenant: '3w2lyf',
    tenantDomain: '3w2lyf.sharepoint.com',
    
    // SharePoint sites to access
    sites: [
        {
            name: 'AAM Site',
            url: 'https://3w2lyf.sharepoint.com/sites/aamSite',
            siteRelativePath: '/sites/aamSite',
            pageUrl: 'https://3w2lyf.sharepoint.com/sites/aamSite/SitePages/CollabHome.aspx',
            description: 'Primary collaboration site'
        },
        {
            name: 'AAM Site Number 2',
            url: 'https://3w2lyf.sharepoint.com/sites/aamSiteNumber2',
            siteRelativePath: '/sites/aamSiteNumber2',
            pageUrl: 'https://3w2lyf.sharepoint.com/sites/aamSiteNumber2/SitePages/CollabHome.aspx',
            description: 'Secondary collaboration site'
        }
    ],
    
    // SharePoint REST API base URL
    // Usage: restApiBase + site.siteRelativePath + '/_api/web'
    restApiBase: 'https://3w2lyf.sharepoint.com'
};

/**
 * Test users for the application
 * These are the users configured in your Azure AD tenant
 */
const testUsers = [
    {
        email: 'adminAlainAirom@3w2lyf.onmicrosoft.com',
        role: 'Administrator',
        description: 'Admin user with full access'
    },
    {
        email: 'user1@3w2lyf.onmicrosoft.com',
        role: 'User',
        description: 'Standard user'
    },
    {
        email: 'user2@3w2lyf.onmicrosoft.com',
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
