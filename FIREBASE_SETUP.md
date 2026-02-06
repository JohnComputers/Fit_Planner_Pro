# Firebase Setup Guide for FitPlanner Pro

Follow these steps to enable cross-device user sync. This is **100% FREE** and takes about 10 minutes.

## Step 1: Create Firebase Project (2 minutes)

1. Go to https://console.firebase.google.com
2. Click **"Add project"** or **"Create a project"**
3. Project name: `FitPlanner-Pro` (or any name you like)
4. Click **Continue**
5. Disable Google Analytics (not needed) - Click **Continue**
6. Wait for project creation - Click **Continue** when done

## Step 2: Register Web App (2 minutes)

1. In your Firebase project, click the **Web icon** (`</>`) to add a web app
2. App nickname: `FitPlanner-Pro-Web`
3. **Do NOT** check "Also set up Firebase Hosting"
4. Click **Register app**
5. You'll see a code snippet with `firebaseConfig` - **KEEP THIS PAGE OPEN**

## Step 3: Enable Authentication (2 minutes)

1. In left sidebar, click **Build** → **Authentication**
2. Click **Get started**
3. Under **Sign-in method** tab, click **Email/Password**
4. **Enable** the Email/Password toggle (first one, not Email link)
5. Click **Save**

## Step 4: Enable Realtime Database (2 minutes)

1. In left sidebar, click **Build** → **Realtime Database**
2. Click **Create Database**
3. Select location: **United States (us-central1)** (or closest to you)
4. Security rules: Choose **Start in locked mode**
5. Click **Enable**

## Step 5: Configure Database Rules (2 minutes)

1. Still in Realtime Database, click the **Rules** tab
2. Replace everything with this code:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

3. Click **Publish**

## Step 6: Add Firebase Config to Your App (2 minutes)

1. Go back to the page from Step 2 (or Project Settings → Your apps)
2. Copy your `firebaseConfig` values
3. Open `firebase-config.js` in your project
4. Replace the placeholder values:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX", // Your actual API key
  authDomain: "fitplanner-pro-xxxxx.firebaseapp.com", // Your actual domain
  databaseURL: "https://fitplanner-pro-xxxxx-default-rtdb.firebaseio.com", // Your actual URL
  projectId: "fitplanner-pro-xxxxx", // Your actual project ID
  storageBucket: "fitplanner-pro-xxxxx.appspot.com", // Your actual bucket
  messagingSenderId: "123456789012", // Your actual sender ID
  appId: "1:123456789012:web:xxxxxxxxxxxxx" // Your actual app ID
};
```

## Step 7: Test It! (1 minute)

1. Save `firebase-config.js`
2. Open your app in a browser
3. Register a new account
4. Add some nutrition data
5. Open your app in a **different browser** or **incognito tab**
6. Login with the same account
7. **Your data should be there!** ✅

## What Firebase Provides (FREE Tier)

- ✅ **50,000 simultaneous connections**
- ✅ **1 GB data storage**
- ✅ **10 GB/month data transfer**
- ✅ **Unlimited authentication users**
- ✅ **Real-time sync across devices**
- ✅ **Secure user authentication**

This is **MORE than enough** for thousands of users!

## Troubleshooting

### "Firebase not configured" message
- Make sure you replaced ALL placeholder values in `firebase-config.js`
- Check that your values don't have quotes inside the quotes
- Refresh the page after saving

### Can't login after setup
- Check Authentication is enabled (Step 3)
- Verify Email/Password is toggled ON
- Check browser console for errors (F12)

### Data not syncing
- Verify Database Rules are set correctly (Step 5)
- Check databaseURL in config has `-default-rtdb` in it
- Make sure you're using the same email on both devices

### "Permission denied" errors
- Double-check Database Rules (Step 5)
- Make sure rules were Published
- Try signing out and back in

## Free vs Paid

Firebase is **100% free** for FitPlanner Pro. The free tier limits are:

| Resource | Free Tier | Typical App Usage |
|----------|-----------|-------------------|
| Storage | 1 GB | ~100 KB per user = 10,000 users |
| Bandwidth | 10 GB/month | ~1 MB per user/month = 10,000 users |
| Connections | 50,000 | More than you'll need |

You'd need **10,000+ active users** before hitting free tier limits!

## Security Notes

Your Firebase config values (API key, etc.) are **safe to put in your code**. Firebase uses:

- Security rules (users can only access their own data)
- Authentication (must be logged in)
- Domain restrictions (only your domain can use the API)

The API key is like a project ID - it's meant to be public.

## Support

If you get stuck:
1. Check the troubleshooting section above
2. Read Firebase docs: https://firebase.google.com/docs/web/setup
3. Check Firebase Console for error messages
4. Make sure all 5 setup steps are completed

---

**That's it! Your app now has:**
- ✅ Real authentication
- ✅ Cross-device sync
- ✅ Cloud data storage
- ✅ Production-ready infrastructure

All 100% FREE! 🎉
