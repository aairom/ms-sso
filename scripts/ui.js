/**
 * UI Management Module
 * Handles all user interface updates and interactions
 */

/**
 * Initialize UI when page loads
 */
function initializeUI() {
    console.log('Initializing UI...');
    
    // Set up event listeners
    setupEventListeners();
    
    // Show initial state
    updateUIForSignedOut();
    
    console.log('UI initialized');
}

/**
 * Set up event listeners for UI elements
 */
function setupEventListeners() {
    // Sign in button
    const signInBtn = document.getElementById('signInBtn');
    if (signInBtn) {
        signInBtn.addEventListener('click', handleSignInClick);
    }
    
    // Sign out button
    const signOutBtn = document.getElementById('signOutBtn');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', handleSignOutClick);
    }
    
    // Refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', handleRefreshClick);
    }
    
    // Test connectivity button
    const testConnBtn = document.getElementById('testConnectivityBtn');
    if (testConnBtn) {
        testConnBtn.addEventListener('click', handleTestConnectivityClick);
    }
    
    // Site cards - will be added dynamically
    console.log('Event listeners set up');
}

/**
 * Handle sign in button click
 */
async function handleSignInClick() {
    try {
        await signInPopup();
    } catch (error) {
        console.error('Sign in failed:', error);
    }
}

/**
 * Handle sign out button click
 */
async function handleSignOutClick() {
    try {
        await signOut();
    } catch (error) {
        console.error('Sign out failed:', error);
    }
}

/**
 * Handle refresh button click
 */
async function handleRefreshClick() {
    try {
        showLoading('Refreshing data...');
        await loadSharePointData();
        hideLoading();
        showSuccess('Data refreshed successfully');
    } catch (error) {
        hideLoading();
        showError('Failed to refresh data', error.message);
    }
}

/**
 * Handle test connectivity button click
 */
async function handleTestConnectivityClick() {
    try {
        showLoading('Testing connectivity...');
        const results = await testSharePointConnectivity();
        hideLoading();
        displayConnectivityResults(results);
    } catch (error) {
        hideLoading();
        showError('Connectivity test failed', error.message);
    }
}

/**
 * Update UI for signed-in state
 */
function updateUIForSignedIn() {
    console.log('Updating UI for signed-in state');
    
    // Hide sign-in section
    const signInSection = document.getElementById('signInSection');
    if (signInSection) {
        signInSection.style.display = 'none';
    }
    
    // Show main content
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
        mainContent.style.display = 'block';
    }
    
    // Update buttons
    const signInBtn = document.getElementById('signInBtn');
    if (signInBtn) {
        signInBtn.style.display = 'none';
    }
    
    const signOutBtn = document.getElementById('signOutBtn');
    if (signOutBtn) {
        signOutBtn.style.display = 'inline-block';
    }
}

/**
 * Update UI for signed-out state
 */
function updateUIForSignedOut() {
    console.log('Updating UI for signed-out state');
    
    // Show sign-in section
    const signInSection = document.getElementById('signInSection');
    if (signInSection) {
        signInSection.style.display = 'block';
    }
    
    // Hide main content
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
        mainContent.style.display = 'none';
    }
    
    // Update buttons
    const signInBtn = document.getElementById('signInBtn');
    if (signInBtn) {
        signInBtn.style.display = 'inline-block';
    }
    
    const signOutBtn = document.getElementById('signOutBtn');
    if (signOutBtn) {
        signOutBtn.style.display = 'none';
    }
}

/**
 * Display user profile information
 */
function displayUserProfile(profile, photoUrl = null) {
    console.log('Displaying user profile');
    
    const userInfoDiv = document.getElementById('userInfo');
    if (!userInfoDiv) return;
    
    const displayName = profile.displayName || profile.userPrincipalName;
    const email = profile.mail || profile.userPrincipalName;
    const jobTitle = profile.jobTitle || 'N/A';
    
    let html = '<div class="user-profile">';
    
    // User photo
    if (photoUrl) {
        html += `<img src="${photoUrl}" alt="User photo" class="user-photo">`;
    } else {
        html += '<div class="user-photo-placeholder">👤</div>';
    }
    
    // User details
    html += '<div class="user-details">';
    html += `<h3>${displayName}</h3>`;
    html += `<p class="user-email">${email}</p>`;
    html += `<p class="user-job-title">${jobTitle}</p>`;
    html += '</div>';
    html += '</div>';
    
    userInfoDiv.innerHTML = html;
}

/**
 * Display SharePoint sites
 */
function displaySharePointSites(sitesData) {
    console.log('Displaying SharePoint sites');
    
    const sitesContainer = document.getElementById('sitesContainer');
    if (!sitesContainer) return;
    
    if (!sitesData || sitesData.length === 0) {
        sitesContainer.innerHTML = '<p class="no-data">No sites available</p>';
        return;
    }
    
    let html = '<div class="sites-grid">';
    
    sitesData.forEach((site, index) => {
        if (site.error) {
            html += createErrorSiteCard(site);
        } else {
            html += createSiteCard(site, index);
        }
    });
    
    html += '</div>';
    sitesContainer.innerHTML = html;
    
    // Add click handlers to site cards
    document.querySelectorAll('.site-card').forEach((card, index) => {
        card.addEventListener('click', () => handleSiteCardClick(sitesData[index]));
    });
}

/**
 * Create a site card HTML
 */
function createSiteCard(site, index) {
    const config = sharepointConfig.sites[index];
    
    return `
        <div class="site-card" data-site-id="${site.id}">
            <div class="site-card-header">
                <h3>🌐 ${site.name}</h3>
            </div>
            <div class="site-card-body">
                <p class="site-description">${site.description || 'No description'}</p>
                <div class="site-meta">
                    <p><strong>URL:</strong> <a href="${site.url}" target="_blank" onclick="event.stopPropagation()">Open Site</a></p>
                    <p><strong>Last Modified:</strong> ${formatSharePointDate(site.lastModifiedDateTime)}</p>
                </div>
            </div>
            <div class="site-card-footer">
                <button class="btn-secondary" onclick="event.stopPropagation(); openSitePage('${config.pageUrl}')">
                    Open CollabHome
                </button>
            </div>
        </div>
    `;
}

/**
 * Create an error site card HTML
 */
function createErrorSiteCard(site) {
    return `
        <div class="site-card error">
            <div class="site-card-header">
                <h3>⚠️ ${site.name}</h3>
            </div>
            <div class="site-card-body">
                <p class="error-message">${site.message}</p>
            </div>
        </div>
    `;
}

/**
 * Handle site card click
 */
async function handleSiteCardClick(site) {
    if (site.error) return;
    
    try {
        showLoading('Loading site details...');
        
        // Get site lists
        const lists = await getSiteLists(site.id);
        
        hideLoading();
        displaySiteDetails(site, lists);
    } catch (error) {
        hideLoading();
        showError('Failed to load site details', error.message);
    }
}

/**
 * Display site details in a modal or expanded view
 */
function displaySiteDetails(site, lists) {
    console.log('Displaying site details');
    
    const modal = document.getElementById('siteDetailsModal');
    if (!modal) return;
    
    const modalContent = document.getElementById('siteDetailsContent');
    if (!modalContent) return;
    
    let html = `
        <h2>${site.name}</h2>
        <p>${site.description || 'No description'}</p>
        <hr>
        <h3>Lists and Libraries (${lists.length})</h3>
    `;
    
    if (lists.length === 0) {
        html += '<p>No lists found</p>';
    } else {
        html += '<div class="lists-container">';
        lists.forEach(list => {
            const icon = getSiteIcon(list.listTemplate);
            html += `
                <div class="list-item">
                    <span class="list-icon">${icon}</span>
                    <div class="list-info">
                        <strong>${list.name}</strong>
                        <p>${list.description || 'No description'}</p>
                        <small>Modified: ${formatSharePointDate(list.lastModifiedDateTime)}</small>
                    </div>
                </div>
            `;
        });
        html += '</div>';
    }
    
    modalContent.innerHTML = html;
    modal.style.display = 'block';
}

/**
 * Display connectivity test results
 */
function displayConnectivityResults(results) {
    console.log('Displaying connectivity results');
    
    const resultsDiv = document.getElementById('connectivityResults');
    if (!resultsDiv) return;
    
    let html = '<div class="connectivity-results">';
    html += '<h3>Connectivity Test Results</h3>';
    
    results.forEach(result => {
        const statusClass = result.status === 'success' ? 'success' : 'error';
        const icon = result.status === 'success' ? '✅' : '❌';
        
        html += `
            <div class="connectivity-result ${statusClass}">
                <span class="result-icon">${icon}</span>
                <div class="result-info">
                    <strong>${result.site}</strong>
                    <p>${result.message}</p>
                    ${result.responseTime ? `<small>Response time: ${result.responseTime}ms</small>` : ''}
                    ${result.error ? `<small class="error-detail">${result.error}</small>` : ''}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    resultsDiv.innerHTML = html;
}

/**
 * Open SharePoint site page in new tab
 */
function openSitePage(url) {
    window.open(url, '_blank');
}

/**
 * Show loading indicator
 */
function showLoading(message = 'Loading...') {
    const loadingDiv = document.getElementById('loadingIndicator');
    if (!loadingDiv) return;
    
    const messageSpan = loadingDiv.querySelector('.loading-message');
    if (messageSpan) {
        messageSpan.textContent = message;
    }
    
    loadingDiv.style.display = 'flex';
}

/**
 * Hide loading indicator
 */
function hideLoading() {
    const loadingDiv = document.getElementById('loadingIndicator');
    if (loadingDiv) {
        loadingDiv.style.display = 'none';
    }
}

/**
 * Show error message
 */
function showError(message, details = '') {
    console.error('Error:', message, details);
    
    const errorDiv = document.getElementById('errorMessage');
    if (!errorDiv) {
        alert(`Error: ${message}\n${details}`);
        return;
    }
    
    const messageSpan = errorDiv.querySelector('.error-text');
    if (messageSpan) {
        messageSpan.textContent = message;
    }
    
    const detailsSpan = errorDiv.querySelector('.error-details');
    if (detailsSpan) {
        detailsSpan.textContent = details;
        detailsSpan.style.display = details ? 'block' : 'none';
    }
    
    errorDiv.style.display = 'block';
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 10000);
}

/**
 * Show success message
 */
function showSuccess(message) {
    console.log('Success:', message);
    
    const successDiv = document.getElementById('successMessage');
    if (!successDiv) {
        return;
    }
    
    const messageSpan = successDiv.querySelector('.success-text');
    if (messageSpan) {
        messageSpan.textContent = message;
    }
    
    successDiv.style.display = 'block';
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 3000);
}

/**
 * Clear user data from UI
 */
function clearUserData() {
    const userInfoDiv = document.getElementById('userInfo');
    if (userInfoDiv) {
        userInfoDiv.innerHTML = '';
    }
    
    const sitesContainer = document.getElementById('sitesContainer');
    if (sitesContainer) {
        sitesContainer.innerHTML = '';
    }
}

/**
 * Load user profile and display
 */
async function loadUserProfile() {
    try {
        showLoading('Loading user profile...');
        
        const profile = await getUserProfile();
        const photoUrl = await getUserPhoto();
        
        displayUserProfile(profile, photoUrl);
        hideLoading();
    } catch (error) {
        hideLoading();
        showError('Failed to load user profile', error.message);
    }
}

/**
 * Load SharePoint data and display
 */
async function loadSharePointData() {
    try {
        showLoading('Loading SharePoint sites...');
        
        const sitesData = await getAllSitesInfo();
        
        displaySharePointSites(sitesData);
        hideLoading();
    } catch (error) {
        hideLoading();
        showError('Failed to load SharePoint data', error.message);
    }
}

/**
 * Close modal
 */
function closeModal() {
    const modal = document.getElementById('siteDetailsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Set up modal close handlers
document.addEventListener('DOMContentLoaded', () => {
    // Close modal when clicking outside
    const modal = document.getElementById('siteDetailsModal');
    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }
    
    // Close button
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
});

console.log('UI module loaded');

// Made with Bob
