// Firebase Configuration
// Configured with production credentials

const firebaseConfig = {
  apiKey: "AIzaSyC6rDODs6I0R9vr6AI1OOUBe229sVx0lq0",
  authDomain: "fitplanner-pro-638ea.firebaseapp.com",
  databaseURL: "https://fitplanner-pro-638ea-default-rtdb.firebaseio.com",
  projectId: "fitplanner-pro-638ea",
  storageBucket: "fitplanner-pro-638ea.firebasestorage.app",
  messagingSenderId: "519608386811",
  appId: "1:519608386811:web:6e210e607b12b13451dc5e",
  measurementId: "G-239YBSGPXK"
};

// Initialize Firebase
let firebaseInitialized = false;

try {
  if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    firebaseInitialized = true;
    console.log('✅ Firebase initialized and ready!');
  } else {
    console.warn('⚠️ Firebase SDK not loaded. Using local storage only.');
  }
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  console.warn('Falling back to local storage only');
}

// Helper function to check if Firebase is ready
function isFirebaseReady() {
  return firebaseInitialized;
}

// Export for use in other files
window.isFirebaseReady = isFirebaseReady;
