/**
 * SharePoint Integration Module
 * Handles all SharePoint API calls using Microsoft Graph API and SharePoint REST API
 */

/**
 * Call Microsoft Graph API
 * Generic function to make authenticated API calls to Microsoft Graph
 */
async function callMSGraph(endpoint, method = 'GET', body = null) {
    try {
        // Get access token
        const token = await acquireTokenSilent();
        
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        
        const options = {
            method: method,
            headers: headers
        };
        
        if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            options.body = JSON.stringify(body);
        }
        
        console.log(`Calling Graph API: ${method} ${endpoint}`);
        const response = await fetch(endpoint, options);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Graph API error: ${response.status} - ${errorText}`);
        }
        
        // Handle empty responses
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }
        
        return await response.text();
    } catch (error) {
        console.error('Graph API call failed:', error);
        throw error;
    }
}

/**
 * Call SharePoint REST API
 * Generic function to make authenticated API calls to SharePoint REST API
 */
async function callSharePointAPI(endpoint, method = 'GET', body = null) {
    try {
        // Get access token with SharePoint scope
        const token = await acquireTokenSilent(['https://3w2lyf.sharepoint.com/.default']);
        
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json;odata=verbose',
            'Content-Type': 'application/json;odata=verbose'
        };
        
        const options = {
            method: method,
            headers: headers
        };
        
        if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            options.body = JSON.stringify(body);
        }
        
        console.log(`Calling SharePoint API: ${method} ${endpoint}`);
        const response = await fetch(endpoint, options);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`SharePoint API error: ${response.status} - ${errorText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('SharePoint API call failed:', error);
        throw error;
    }
}

/**
 * Get user profile from Microsoft Graph
 */
async function getUserProfile() {
    try {
        console.log('Fetching user profile...');
        const profile = await callMSGraph(graphConfig.graphMeEndpoint);
        console.log('User profile retrieved:', profile);
        return profile;
    } catch (error) {
        console.error('Failed to get user profile:', error);
        throw error;
    }
}

/**
 * Get user's photo from Microsoft Graph
 */
async function getUserPhoto() {
    try {
        console.log('Fetching user photo...');
        const token = await acquireTokenSilent();
        
        const response = await fetch(graphConfig.graphPhotoEndpoint, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            console.log('No user photo available');
            return null;
        }
        
        const blob = await response.blob();
        const photoUrl = URL.createObjectURL(blob);
        console.log('User photo retrieved');
        return photoUrl;
    } catch (error) {
        console.warn('Failed to get user photo:', error);
        return null;
    }
}

/**
 * Get SharePoint site information using Microsoft Graph
 */
async function getSiteInfo(siteConfig) {
    try {
        console.log(`Fetching site info for: ${siteConfig.name}`);
        
        // Construct the Graph API endpoint for the site
        const endpoint = graphConfig.graphSiteByPathEndpoint
            .replace('{hostname}', sharepointConfig.tenantDomain)
            .replace('{site-path}', siteConfig.siteRelativePath);
        
        const siteInfo = await callMSGraph(endpoint);
        console.log('Site info retrieved:', siteInfo);
        
        return {
            id: siteInfo.id,
            name: siteInfo.displayName || siteConfig.name,
            description: siteInfo.description || siteConfig.description,
            url: siteInfo.webUrl,
            createdDateTime: siteInfo.createdDateTime,
            lastModifiedDateTime: siteInfo.lastModifiedDateTime
        };
    } catch (error) {
        console.error(`Failed to get site info for ${siteConfig.name}:`, error);
        throw error;
    }
}

/**
 * Get all configured SharePoint sites information
 */
async function getAllSitesInfo() {
    try {
        console.log('Fetching all sites information...');
        
        const sitesPromises = sharepointConfig.sites.map(site => 
            getSiteInfo(site).catch(error => ({
                error: true,
                message: error.message,
                name: site.name
            }))
        );
        
        const sitesInfo = await Promise.all(sitesPromises);
        console.log('All sites info retrieved');
        
        return sitesInfo;
    } catch (error) {
        console.error('Failed to get all sites info:', error);
        throw error;
    }
}

/**
 * Get lists from a SharePoint site
 */
async function getSiteLists(siteId) {
    try {
        console.log(`Fetching lists for site: ${siteId}`);
        
        const endpoint = graphConfig.graphSiteListsEndpoint.replace('{site-id}', siteId);
        const response = await callMSGraph(endpoint);
        
        const lists = response.value || [];
        console.log(`Retrieved ${lists.length} lists`);
        
        return lists.map(list => ({
            id: list.id,
            name: list.displayName,
            description: list.description,
            createdDateTime: list.createdDateTime,
            lastModifiedDateTime: list.lastModifiedDateTime,
            webUrl: list.webUrl,
            listTemplate: list.list?.template
        }));
    } catch (error) {
        console.error('Failed to get site lists:', error);
        throw error;
    }
}

/**
 * Get items from a SharePoint list
 */
async function getListItems(siteId, listId, top = 10) {
    try {
        console.log(`Fetching items from list: ${listId}`);
        
        const endpoint = graphConfig.graphListItemsEndpoint
            .replace('{site-id}', siteId)
            .replace('{list-id}', listId) + 
            `?$top=${top}&$expand=fields`;
        
        const response = await callMSGraph(endpoint);
        
        const items = response.value || [];
        console.log(`Retrieved ${items.length} items`);
        
        return items.map(item => ({
            id: item.id,
            fields: item.fields,
            createdDateTime: item.createdDateTime,
            lastModifiedDateTime: item.lastModifiedDateTime,
            webUrl: item.webUrl
        }));
    } catch (error) {
        console.error('Failed to get list items:', error);
        throw error;
    }
}

/**
 * Get SharePoint site using REST API
 */
async function getSiteInfoREST(siteConfig) {
    try {
        console.log(`Fetching site info via REST API: ${siteConfig.name}`);
        
        const endpoint = `${siteConfig.url}/_api/web`;
        const response = await callSharePointAPI(endpoint);
        
        const siteData = response.d;
        
        return {
            title: siteData.Title,
            description: siteData.Description,
            url: siteData.Url,
            created: siteData.Created,
            lastModified: siteData.LastItemModifiedDate,
            language: siteData.Language,
            serverRelativeUrl: siteData.ServerRelativeUrl
        };
    } catch (error) {
        console.error(`Failed to get site info via REST for ${siteConfig.name}:`, error);
        throw error;
    }
}

/**
 * Get lists from SharePoint site using REST API
 */
async function getListsREST(siteConfig) {
    try {
        console.log(`Fetching lists via REST API: ${siteConfig.name}`);
        
        const endpoint = `${siteConfig.url}/_api/web/lists`;
        const response = await callSharePointAPI(endpoint);
        
        const lists = response.d.results || [];
        
        return lists
            .filter(list => !list.Hidden) // Filter out hidden lists
            .map(list => ({
                id: list.Id,
                title: list.Title,
                description: list.Description,
                itemCount: list.ItemCount,
                created: list.Created,
                lastModified: list.LastItemModifiedDate,
                baseTemplate: list.BaseTemplate
            }));
    } catch (error) {
        console.error('Failed to get lists via REST:', error);
        throw error;
    }
}

/**
 * Get current user's permissions on a site
 */
async function getUserPermissions(siteConfig) {
    try {
        console.log(`Checking user permissions for: ${siteConfig.name}`);
        
        const endpoint = `${siteConfig.url}/_api/web/currentuser`;
        const response = await callSharePointAPI(endpoint);
        
        const user = response.d;
        
        return {
            id: user.Id,
            title: user.Title,
            email: user.Email,
            loginName: user.LoginName,
            isSiteAdmin: user.IsSiteAdmin
        };
    } catch (error) {
        console.error('Failed to get user permissions:', error);
        throw error;
    }
}

/**
 * Search SharePoint sites
 */
async function searchSharePoint(query, siteConfig) {
    try {
        console.log(`Searching SharePoint: ${query}`);
        
        const endpoint = `${siteConfig.url}/_api/search/query?querytext='${encodeURIComponent(query)}'`;
        const response = await callSharePointAPI(endpoint);
        
        const results = response.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results || [];
        
        return results.map(result => {
            const cells = result.Cells.results;
            const resultObj = {};
            
            cells.forEach(cell => {
                resultObj[cell.Key] = cell.Value;
            });
            
            return resultObj;
        });
    } catch (error) {
        console.error('Search failed:', error);
        throw error;
    }
}

/**
 * Get document library files
 */
async function getDocumentLibraryFiles(siteConfig, libraryName = 'Documents') {
    try {
        console.log(`Fetching files from ${libraryName}...`);
        
        const endpoint = `${siteConfig.url}/_api/web/lists/getbytitle('${libraryName}')/items?$top=10`;
        const response = await callSharePointAPI(endpoint);
        
        const files = response.d.results || [];
        
        return files.map(file => ({
            id: file.Id,
            title: file.Title,
            fileName: file.FileLeafRef,
            fileType: file.File_x0020_Type,
            created: file.Created,
            modified: file.Modified,
            author: file.Author,
            editor: file.Editor
        }));
    } catch (error) {
        console.error('Failed to get document library files:', error);
        throw error;
    }
}

/**
 * Test SharePoint connectivity
 * Attempts to connect to all configured sites and returns status
 */
async function testSharePointConnectivity() {
    console.log('Testing SharePoint connectivity...');
    
    const results = [];
    
    for (const site of sharepointConfig.sites) {
        try {
            const startTime = Date.now();
            await getSiteInfo(site);
            const endTime = Date.now();
            
            results.push({
                site: site.name,
                status: 'success',
                responseTime: endTime - startTime,
                message: 'Connected successfully'
            });
        } catch (error) {
            results.push({
                site: site.name,
                status: 'error',
                error: error.message,
                message: 'Connection failed'
            });
        }
    }
    
    console.log('Connectivity test results:', results);
    return results;
}

/**
 * Get comprehensive site data
 * Fetches site info, lists, and user permissions
 */
async function getComprehensiveSiteData(siteConfig) {
    try {
        console.log(`Fetching comprehensive data for: ${siteConfig.name}`);
        
        const [siteInfo, lists, userPerms] = await Promise.allSettled([
            getSiteInfo(siteConfig),
            getSiteLists(siteConfig.id).catch(() => []),
            getUserPermissions(siteConfig).catch(() => null)
        ]);
        
        return {
            site: siteInfo.status === 'fulfilled' ? siteInfo.value : null,
            lists: lists.status === 'fulfilled' ? lists.value : [],
            userPermissions: userPerms.status === 'fulfilled' ? userPerms.value : null,
            error: siteInfo.status === 'rejected' ? siteInfo.reason : null
        };
    } catch (error) {
        console.error('Failed to get comprehensive site data:', error);
        throw error;
    }
}

/**
 * Format SharePoint date
 */
function formatSharePointDate(dateString) {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Get site icon based on template
 */
function getSiteIcon(template) {
    const icons = {
        'DocumentLibrary': '📄',
        'PictureLibrary': '🖼️',
        'GenericList': '📋',
        'Calendar': '📅',
        'Tasks': '✅',
        'Announcements': '📢',
        'Contacts': '👥',
        'Links': '🔗'
    };
    
    return icons[template] || '📁';
}

console.log('SharePoint module loaded');

// Made with Bob
