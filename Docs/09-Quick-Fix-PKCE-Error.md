# 🚨 Quick Fix: PKCE Error

## The Error You're Seeing

```
❌ The PKCE code challenge and verifier could not be generated.
Detail: TypeError: Cannot read properties of undefined (reading 'digest')
pkce_not_created
```

## ✅ 3-Step Fix (5 minutes)

### Step 1: Enable Implicit Flow in Azure Portal (2 minutes)

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to: **Azure Active Directory** → **App registrations** → **SharePoint SSO Demo**
3. Click **Authentication** in left menu
4. Scroll to **Implicit grant and hybrid flows**
5. Check BOTH boxes:
   - ☑ **Access tokens** (used for implicit flows)
   - ☑ **ID tokens** (used for implicit and hybrid flows)
6. Click **Save** at the top

**Visual guide:**
```
Implicit grant and hybrid flows
☑ Access tokens (used for implicit flows)      ← CHECK THIS
☑ ID tokens (used for implicit and hybrid flows) ← CHECK THIS
```

### Step 2: Clear Browser Cache (1 minute)

**Option A - Hard Refresh (Easiest):**
- Windows/Linux: Press `Ctrl + Shift + R` or `Ctrl + F5`
- Mac: Press `Cmd + Shift + R`

**Option B - Clear Cache:**
- Windows/Linux: Press `Ctrl + Shift + Delete`
- Mac: Press `Cmd + Shift + Delete`
- Select "Cookies" and "Cache"
- Click "Clear data"

**Option C - Use Incognito (Fastest):**
- Windows/Linux: Press `Ctrl + Shift + N`
- Mac: Press `Cmd + Shift + N`
- Navigate to http://localhost:3000

### Step 3: Test (1 minute)

1. Go to http://localhost:3000
2. Click "Sign In with Microsoft"
3. You should see Azure sign-in dialog (no error!)
4. Sign in with your credentials
5. ✅ Success! You'll see your profile and SharePoint sites

## 🎯 What Changed

The application now uses **Implicit Flow** instead of **Authorization Code Flow with PKCE**:

- ✅ Works in all browsers
- ✅ No Web Crypto API required
- ✅ Simpler authentication
- ✅ No PKCE errors

## 🔍 Verify It's Working

After signing in, you should see:
- ✅ Your name and email
- ✅ Your profile picture
- ✅ Two SharePoint site cards
- ✅ No error messages

## ❌ Still Not Working?

### If you still see PKCE error:

1. **Verify Azure Portal settings are saved:**
   - Go back to Azure Portal → Authentication
   - Confirm both checkboxes are still checked
   - Click Save again

2. **Clear ALL browser data:**
   - Close ALL browser tabs
   - Clear all cookies and cache
   - Restart browser
   - Try again

3. **Try different browser:**
   - Chrome (recommended)
   - Edge (recommended)
   - Firefox

4. **Check browser console:**
   - Press F12
   - Look for errors in Console tab
   - Share any errors you see

### If you see "Invalid redirect URI":

1. Go to Azure Portal → Authentication
2. Verify redirect URI is exactly: `http://localhost:3000`
3. Click Save

### If sign-in dialog doesn't appear:

1. Check browser console (F12) for errors
2. Verify you're accessing http://localhost:3000 (not https)
3. Ensure local server is running

## 📚 More Information

For detailed technical explanation, see:
- **Docs/08-PKCE-Complete-Fix.md** - Complete technical guide
- **Docs/02-Azure-Setup-Guide.md** - Full Azure setup
- **Docs/07-Clear-Cache-Instructions.md** - Detailed cache clearing

## 💡 Why This Happened

MSAL.js 2.x uses PKCE by default, which requires the browser's Web Crypto API. Some browsers or environments don't support this, causing the error. We fixed it by switching to implicit flow, which works everywhere.

---

**Need help?** Check the detailed guides in the Docs folder or review browser console errors.