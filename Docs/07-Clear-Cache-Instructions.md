# Clear Browser Cache - Quick Instructions

## ✅ Good News!
The application works! You saw the Azure sign-in dialog in a clean session, which means the fix is working.

## ❌ The Problem
Your normal browser session has **old cached authentication data** from before the fix. This cached data is trying to use PKCE, which causes the error.

## 🔧 Solution: Clear Browser Cache

### Option 1: Clear Cache for localhost Only (Recommended)

#### Chrome/Edge:
1. Press **F12** to open Developer Tools
2. **Right-click** the refresh button (next to address bar)
3. Select **"Empty Cache and Hard Reload"**
4. Close Developer Tools
5. Try signing in again

#### Firefox:
1. Press **Ctrl+Shift+Delete** (Windows) or **Cmd+Shift+Delete** (Mac)
2. Select **"Cookies and Site Data"** and **"Cached Web Content"**
3. Time range: **"Last Hour"**
4. Click **"Clear Now"**
5. Refresh the page

### Option 2: Clear All Browser Data

#### Chrome/Edge:
1. Press **Ctrl+Shift+Delete** (Windows) or **Cmd+Shift+Delete** (Mac)
2. Select:
   - ✅ Cookies and other site data
   - ✅ Cached images and files
3. Time range: **"All time"** or **"Last hour"**
4. Click **"Clear data"**
5. Refresh the page

#### Firefox:
1. Press **Ctrl+Shift+Delete** (Windows) or **Cmd+Shift+Delete** (Mac)
2. Select:
   - ✅ Cookies
   - ✅ Cache
3. Time range: **"Everything"**
4. Click **"Clear Now"**
5. Refresh the page

### Option 3: Use Incognito/Private Mode (Easiest!)

1. Open a **new incognito/private window**:
   - Chrome/Edge: **Ctrl+Shift+N** (Windows) or **Cmd+Shift+N** (Mac)
   - Firefox: **Ctrl+Shift+P** (Windows) or **Cmd+Shift+P** (Mac)
2. Navigate to **http://localhost:3000**
3. Sign in - it will work!

### Option 4: Close All Tabs and Restart Browser

1. **Close ALL browser tabs** (including other websites)
2. **Close the browser completely**
3. **Reopen the browser**
4. Navigate to **http://localhost:3000**
5. Try signing in

## 🎯 After Clearing Cache

1. Go to **http://localhost:3000**
2. Click **"Sign In with Microsoft"**
3. You should see the **Azure sign-in dialog** (like you did in the clean session)
4. Enter your credentials
5. After signing in, you'll see your profile and SharePoint sites

## ✅ Success Indicators

You'll know it's working when:
- No PKCE error appears
- Azure sign-in dialog shows up
- After signing in, you see your profile
- SharePoint sites load

## 📝 Why This Happens

MSAL (Microsoft Authentication Library) caches authentication data in your browser's storage. When we changed from PKCE to implicit flow, the old cached data still tried to use PKCE. Clearing the cache removes this old data and lets the new configuration work.

## 🔄 For Future Development

If you make changes to authentication configuration, always:
1. Clear browser cache
2. Or use incognito mode for testing
3. Or close all tabs and restart browser

---

**Quick Fix**: Just use **incognito mode** - it's the fastest solution!