// Firebase Configuration
// This file initializes Firebase for cross-device user sync

// SETUP INSTRUCTIONS:
// 1. Go to https://console.firebase.google.com
// 2. Click "Add Project" (it's 100% free)
// 3. Name it "FitPlanner-Pro" and follow the steps
// 4. In Project Settings > Your apps, click Web (</>)
// 5. Register app, copy the firebaseConfig values below
// 6. Enable Authentication: Go to Build > Authentication > Get Started > Email/Password
// 7. Enable Realtime Database: Go to Build > Realtime Database > Create Database
// 8. Set Database Rules to:
/*
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
*/

// YOUR FIREBASE CONFIG (Replace with your actual values from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyC6rDODs6I0R9vr6AI1OOUBe229sVx0lq0",
  authDomain: "fitplanner-pro-638ea.firebaseapp.com",
  databaseURL: "https://fitplanner-pro-638ea-default-rtdb.firebaseio.com",
  projectId: "fitplanner-pro-638ea",
  storageBucket: "fitplanner-pro-638ea.appspot.com",
  messagingSenderId: "519608386811",
  appId: "1:519608386811:web:85985a56be151ac151dc5e"
};

// Initialize Firebase
let firebaseInitialized = false;

try {
  if (typeof firebase !== 'undefined' && firebaseConfig.apiKey !== "YOUR_API_KEY_HERE") {
    firebase.initializeApp(firebaseConfig);
    firebaseInitialized = true;
    console.log('✅ Firebase initialized successfully');
  } else {
    console.warn('⚠️ Firebase not configured. Using local storage only.');
    console.warn('To enable cross-device sync, follow setup instructions in firebase-config.js');
  }
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  console.warn('Falling back to local storage only');
}

// Helper function to check if Firebase is ready
function isFirebaseReady() {
  return firebaseInitialized && firebaseConfig.apiKey !== "YOUR_API_KEY_HERE";
}

// Export for use in other files
window.isFirebaseReady = isFirebaseReady;
