# Google Authentication Setup for Keepie Upie

To enable Google Sign-In for cross-device progress syncing, you'll need to set up Google OAuth credentials.

## Quick Setup (5 minutes):

### 1. Create Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client IDs"
5. Choose "Web application"
6. Add your domain to "Authorized JavaScript origins":
   - For local testing: `http://localhost:3000` or `http://127.0.0.1:5500`
   - For production: `https://yourdomain.com`

### 2. Update the Code
1. Copy your Client ID from Google Cloud Console
2. Open `index.html` and replace `YOUR_GOOGLE_CLIENT_ID` with your actual client ID
3. Open `game.js` and replace `YOUR_GOOGLE_CLIENT_ID` with your actual client ID

### 3. Test Locally
- Serve the files using a local web server (not file:// protocol)
- Try: `python -m http.server 3000` or Live Server in VS Code

## Features:

✅ **Cross-Device Sync**: Play on any device, keep your progress  
✅ **Cloud Save**: Best scores, coins, unlocked items, shield ownership  
✅ **Automatic Backup**: Local storage + cloud storage for redundancy  
✅ **Privacy Focused**: Only basic profile info (name, email, picture) is used  

## How it Works:

- **Signed Out**: Progress saved locally only
- **Signed In**: Progress synced to cloud + local backup
- **First Sign-In**: Uploads current local progress to cloud
- **Returning User**: Downloads cloud progress, overwrites local

## Production Deployment:

For production use, replace the simple `cloudData` object in `game.js` with a real backend:
- **Firebase Firestore** (recommended for easy setup)
- **Supabase** (open source alternative)
- **Custom API** with your preferred database

## Security Notes:

- Client ID is public and safe to expose
- No sensitive data - only game progress
- Users control their own data through Google account
- Local fallback always available

---

**Need help?** Check Google's [Sign-In documentation](https://developers.google.com/identity/gsi/web/guides/overview)
