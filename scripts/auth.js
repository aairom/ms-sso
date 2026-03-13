/**
 * Authentication Module
 * Handles all Microsoft Entra ID (Azure AD) authentication operations using MSAL.js 1.x
 * MSAL 1.x uses implicit flow by default - no PKCE required!
 */

// MSAL instance - will be initialized on page load
let msalInstance = null;

// Current user account
let currentAccount = null;

/**
 * Initialize MSAL instance
 * Must be called before any other authentication operations
 */
async function initializeMSAL() {
    try {
        console.log('Initializing MSAL 1.x (Implicit Flow)...');
        
        // Check if MSAL is loaded
        if (typeof Msal === 'undefined') {
            console.error('MSAL library not loaded!');
            throw new Error('MSAL library not loaded. Check your internet connection.');
        }
        
        console.log('MSAL library loaded successfully');
        
        // Create MSAL instance with configuration from config.js
        // MSAL 1.x uses UserAgentApplication
        msalInstance = new Msal.UserAgentApplication(msalConfig);
        
        console.log('MSAL instance created successfully');
        
        // Set up callback for redirect
        msalInstance.handleRedirectCallback((error, response) => {
            console.log('Redirect callback triggered');
            if (error) {
                console.error('Redirect callback error:', error);
                handleAuthenticationError(error);
                hideLoading();
                return;
            }
            
            if (response) {
                console.log('Redirect response received:', response);
                currentAccount = response.account;
                handleAuthenticationResponse(response);
                onSignInSuccess();
            } else {
                console.log('Redirect callback: no response');
                hideLoading();
            }
        });
        
        console.log('Redirect callback registered');
        
        // Check if there's already a signed-in account
        const account = msalInstance.getAccount();
        
        if (account) {
            console.log('Found cached account:', account);
            currentAccount = account;
            
            // User is already signed in
            await onSignInSuccess();
        } else {
            console.log('No cached account found - sign in required');
            onSignInRequired();
        }
        
        console.log('MSAL initialized successfully');
        return true;
    } catch (error) {
        console.error('Error initializing MSAL:', error);
        handleAuthenticationError(error);
        hideLoading();
        return false;
    }
}

/**
 * Sign in using redirect
 * MSAL 1.x uses implicit flow by default - no PKCE!
 */
async function signInPopup() {
    try {
        console.log('Starting sign in with redirect (Implicit Flow)...');
        showLoading('Redirecting to sign in...');
        
        // MSAL 1.x loginRedirect uses implicit flow automatically
        msalInstance.loginRedirect(loginRequest);
        
        // Note: Code after loginRedirect won't execute as page will redirect
    } catch (error) {
        console.error('Sign in error:', error);
        hideLoading();
        handleAuthenticationError(error);
        throw error;
    }
}

/**
 * Sign in using redirect (alias for signInPopup for compatibility)
 */
async function signInRedirect() {
    return signInPopup();
}

/**
 * Sign out the current user
 */
async function signOut() {
    try {
        console.log('Signing out...');
        showLoading('Signing out...');
        
        // Clear current account
        currentAccount = null;
        
        // Sign out using MSAL 1.x
        msalInstance.logout();
        
        console.log('Sign out successful');
        hideLoading();
        onSignOutSuccess();
    } catch (error) {
        console.error('Sign out error:', error);
        hideLoading();
        handleAuthenticationError(error);
    }
}

/**
 * Acquire access token silently (from cache or using refresh token)
 * This is the preferred method for getting tokens
 */
async function acquireTokenSilent(scopes = null) {
    try {
        if (!currentAccount) {
            throw new Error('No account signed in');
        }
        
        const request = {
            scopes: scopes || tokenRequest.scopes,
            account: currentAccount
        };
        
        console.log('Acquiring token silently...');
        const response = await msalInstance.acquireTokenSilent(request);
        console.log('Token acquired silently');
        
        return response.accessToken;
    } catch (error) {
        console.warn('Silent token acquisition failed:', error);
        
        // If silent acquisition fails, try interactive method
        if (error.name === 'InteractionRequiredAuthError' || 
            error.errorCode === 'consent_required' ||
            error.errorCode === 'interaction_required' ||
            error.errorCode === 'login_required') {
            console.log('Interaction required, falling back to redirect...');
            return await acquireTokenRedirect(scopes);
        }
        
        throw error;
    }
}

/**
 * Acquire access token using redirect
 * Used when silent acquisition fails
 */
async function acquireTokenRedirect(scopes = null) {
    try {
        const request = {
            scopes: scopes || tokenRequest.scopes,
            account: currentAccount
        };
        
        console.log('Acquiring token with redirect...');
        showLoading('Requesting permissions...');
        
        // This will redirect the page
        msalInstance.acquireTokenRedirect(request);
        
        // Code after this won't execute
    } catch (error) {
        console.error('Token acquisition error:', error);
        hideLoading();
        handleAuthenticationError(error);
        throw error;
    }
}

/**
 * Acquire access token using popup (for compatibility)
 */
async function acquireTokenPopup(scopes = null) {
    return acquireTokenRedirect(scopes);
}

/**
 * Get the current signed-in account
 */
function getCurrentAccount() {
    return currentAccount;
}

/**
 * Check if user is signed in
 */
function isSignedIn() {
    return currentAccount !== null;
}

/**
 * Get user's display name
 */
function getUserDisplayName() {
    if (!currentAccount) return null;
    return currentAccount.name || currentAccount.userName;
}

/**
 * Get user's email
 */
function getUserEmail() {
    if (!currentAccount) return null;
    return currentAccount.userName;
}

/**
 * Get user's unique identifier
 */
function getUserId() {
    if (!currentAccount) return null;
    return currentAccount.homeAccountIdentifier;
}

/**
 * Handle successful authentication response
 */
function handleAuthenticationResponse(response) {
    console.log('Authentication response:', {
        account: response.account.userName,
        scopes: response.scopes,
        tokenType: response.tokenType
    });
    
    // Store authentication timestamp
    sessionStorage.setItem('authTimestamp', new Date().toISOString());
    
    // Log successful authentication
    logAuthenticationEvent('sign_in_success', {
        user: response.account.userName,
        method: response.fromCache ? 'cache' : 'interactive'
    });
}

/**
 * Handle authentication errors
 */
function handleAuthenticationError(error) {
    console.error('Authentication error:', error);
    
    // Always hide loading indicator on error
    hideLoading();
    
    let errorMessage = 'An authentication error occurred.';
    let errorDetails = '';
    
    // Parse MSAL errors
    if (error && error.errorCode) {
        errorMessage = error.errorMessage || error.message;
        errorDetails = error.errorCode;
        
        // Handle specific error codes
        switch (error.errorCode) {
            case 'user_cancelled':
                errorMessage = 'Sign in was cancelled.';
                break;
            case 'consent_required':
                errorMessage = 'Additional permissions are required.';
                break;
            case 'interaction_required':
                errorMessage = 'User interaction is required.';
                break;
            case 'login_required':
                errorMessage = 'Please sign in to continue.';
                break;
            case 'token_renewal_error':
                errorMessage = 'Failed to refresh access token. Please sign in again.';
                break;
        }
    }
    
    // Log error
    logAuthenticationEvent('auth_error', {
        error: errorDetails,
        message: errorMessage
    });
    
    // Show error to user
    showError(errorMessage, errorDetails);
}

/**
 * Log authentication events
 */
function logAuthenticationEvent(eventType, data) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        event: eventType,
        data: data
    };
    
    console.log('Auth Event:', logEntry);
    
    // In production, send to logging service
    // Example: sendToLoggingService(logEntry);
}

/**
 * Callback when sign in is required
 */
function onSignInRequired() {
    console.log('Sign in required');
    hideLoading();
    updateUIForSignedOut();
}

/**
 * Callback when sign in is successful
 */
async function onSignInSuccess() {
    console.log('Sign in successful');
    updateUIForSignedIn();
    
    // Load user profile
    await loadUserProfile();
    
    // Load SharePoint data
    await loadSharePointData();
}

/**
 * Callback when sign out is successful
 */
function onSignOutSuccess() {
    console.log('Sign out successful');
    updateUIForSignedOut();
    clearUserData();
}

/**
 * Validate token expiration
 * Returns true if token is still valid
 */
function isTokenValid(expiresOn) {
    if (!expiresOn) return false;
    
    const now = new Date();
    const expiration = new Date(expiresOn);
    
    // Add 5 minute buffer
    const bufferTime = 5 * 60 * 1000;
    return expiration.getTime() - now.getTime() > bufferTime;
}

/**
 * Get token expiration time
 */
function getTokenExpiration() {
    if (!currentAccount) return null;
    
    // MSAL 1.x handles this internally
    return null;
}

/**
 * Force token refresh
 */
async function forceTokenRefresh() {
    try {
        console.log('Forcing token refresh...');
        
        const request = {
            scopes: tokenRequest.scopes,
            account: currentAccount,
            forceRefresh: true
        };
        
        const response = await msalInstance.acquireTokenSilent(request);
        console.log('Token refreshed successfully');
        
        return response.accessToken;
    } catch (error) {
        console.error('Token refresh error:', error);
        throw error;
    }
}

// Initialize MSAL when script loads
console.log('Auth module loaded (MSAL 1.x - Implicit Flow)');

// Made with Bob
