# Quick Start Checklist

Use this checklist to quickly set up and run the SharePoint SSO Demo application.

## ✅ Pre-Setup Checklist

- [ ] I have access to Azure Portal (https://portal.azure.com)
- [ ] I have admin rights in Azure AD/Entra ID
- [ ] I have access to the SharePoint sites
- [ ] I have a modern web browser installed
- [ ] I can run a local web server (Python, Node.js, or VS Code)

## 📋 Setup Steps

### 1. Azure Portal Configuration (15-20 minutes)

- [ ] **Navigate to Azure Portal**
  - Go to https://portal.azure.com
  - Sign in with admin account

- [ ] **Register Application**
  - Go to Microsoft Entra ID → App registrations
  - Click "New registration"
  - Name: `SharePoint SSO Demo`
  - Account type: Single tenant (3w2lyf only)
  - Redirect URI: Platform = SPA, URI = `http://localhost:3000`
  - Click "Register"

- [ ] **Copy Important Values**
  ```
  Application (client) ID: _______________________
  Directory (tenant) ID: _______________________
  ```

- [ ] **Configure Authentication**
  - Go to Authentication section
  - Add redirect URIs:
    - `http://localhost:3000`
    - `http://localhost:3000/callback`
  - Under "Implicit grant and hybrid flows":
    - ✅ Check "Access tokens"
    - ✅ Check "ID tokens"
  - Click "Save"

- [ ] **Add API Permissions**
  - Go to API permissions
  - Click "Add a permission"
  - Select "Microsoft Graph"
  - Select "Delegated permissions"
  - Add these permissions:
    - ✅ User.Read
    - ✅ Sites.Read.All
    - ✅ Files.Read.All
    - ✅ offline_access
  - Click "Add permissions"

- [ ] **Grant Admin Consent**
  - Click "Grant admin consent for 3w2lyf"
  - Click "Yes" to confirm
  - Verify all permissions show green checkmarks

### 2. Application Configuration (5 minutes)

- [ ] **Open Project Folder**
  - Navigate to the project directory

- [ ] **Edit Configuration File**
  - Open `scripts/config.js`
  - Find line with `clientId: 'YOUR_CLIENT_ID_HERE'`
  - Replace with your Application (client) ID
  - Find line with `authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID_HERE'`
  - Replace YOUR_TENANT_ID_HERE with your Directory (tenant) ID
  - Save the file

- [ ] **Verify SharePoint URLs**
  - Check that SharePoint site URLs match your sites:
    - https://xxx.sharepoint.com/sites/yoursite
    - https://xxx.sharepoint.com/sites/yoursite2
  - Update if different

### 3. Run the Application (2 minutes)

- [ ] **Start Web Server**
  
  Choose ONE method:
  
  **Option A: Python**
  ```bash
  python -m http.server 3000
  ```
  
  **Option B: Node.js**
  ```bash
  npx http-server -p 3000
  ```
  
  **Option C: VS Code Live Server**
  - Install Live Server extension
  - Right-click index.html
  - Select "Open with Live Server"

- [ ] **Open Browser**
  - Navigate to: http://localhost:3000
  - You should see the welcome page

### 4. Test Authentication (5 minutes)

- [ ] **Sign In**
  - Click "Sign In with Microsoft" button
  - You'll be redirected to Microsoft login page

- [ ] **Enter Credentials**
  - Use one of these test accounts:
    - admin@mail.com
    - User1@mail.com
    - user2@mail.com
  - Enter password

- [ ] **Grant Permissions** (first time only)
  - Review requested permissions
  - Click "Accept"

- [ ] **Verify Sign In**
  - You should be redirected back to the app
  - User profile should be displayed
  - SharePoint sites should be loaded

### 5. Test Features (5 minutes)

- [ ] **View User Profile**
  - Check that your name and email are displayed
  - User photo should appear (if available)

- [ ] **View SharePoint Sites**
  - Two site cards should be displayed
  - Each card shows site name and description

- [ ] **Test Connectivity**
  - Click "Test Connectivity" button
  - Both sites should show green checkmarks
  - Response times should be displayed

- [ ] **View Site Details**
  - Click on a site card
  - Modal should open showing lists and libraries
  - Close modal

- [ ] **Open SharePoint Page**
  - Click "Open CollabHome" button on a site card
  - SharePoint page should open in new tab
  - You should be automatically signed in (SSO!)

- [ ] **Refresh Data**
  - Click "Refresh Data" button
  - Data should reload
  - Success message should appear

- [ ] **Sign Out**
  - Click "Sign Out" button
  - You should be signed out
  - Welcome page should appear

## 🎉 Success Criteria

You've successfully completed the setup if:

✅ Application loads without errors  
✅ Sign in works with Microsoft account  
✅ User profile displays correctly  
✅ SharePoint sites are visible  
✅ Connectivity test passes  
✅ Site details can be viewed  
✅ SharePoint pages open with SSO  
✅ Sign out works correctly  

## 🐛 Troubleshooting Quick Fixes

### Issue: "Reply URL mismatch" error
**Fix**: 
1. Go to Azure Portal → App registrations → Your app → Authentication
2. Verify redirect URI is exactly: `http://localhost:3000`
3. Make sure platform is "Single-page application"

### Issue: "User has not consented" error
**Fix**:
1. Go to Azure Portal → App registrations → Your app → API permissions
2. Click "Grant admin consent for 3w2lyf"
3. Refresh the application

### Issue: "CORS error" in console
**Fix**:
1. Make sure you're running through a web server
2. Don't open index.html directly in browser
3. Use http://localhost:3000, not file:///

### Issue: SharePoint sites not loading
**Fix**:
1. Verify SharePoint URLs in config.js are correct
2. Check that user has access to SharePoint sites
3. Verify API permissions are granted

### Issue: Application not loading
**Fix**:
1. Check browser console (F12) for errors
2. Verify config.js has correct Client ID and Tenant ID
3. Make sure web server is running on port 3000

## 📞 Need Help?

1. Check browser console (F12) for error messages
2. Review [README.md](../README.md) for detailed instructions
3. See [02-Azure-Setup-Guide.md](02-Azure-Setup-Guide.md) for Azure configuration
4. Check [03-Implementation-Guide.md](03-Implementation-Guide.md) for technical details

## 🔄 Reset and Start Over

If something goes wrong and you want to start fresh:

1. **Clear Browser Data**
   - Open browser settings
   - Clear cookies and cache for localhost
   - Close all browser tabs

2. **Reset Azure App**
   - Delete the app registration in Azure Portal
   - Create a new one following the checklist

3. **Reset Configuration**
   - Restore config.js to original state
   - Update with new Client ID and Tenant ID

## ⏱️ Estimated Time

- **First-time setup**: 30-40 minutes
- **Subsequent runs**: 2-3 minutes (just start server and open browser)

## 📝 Notes

- Keep your Client ID and Tenant ID secure
- Don't commit config.js with real credentials to version control
- Use HTTPS in production environments
- Test with all three user accounts to verify different permission levels

---

**Last Updated**: 2026-03-13  
**Version**: 1.0