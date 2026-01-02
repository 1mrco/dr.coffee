# Login Troubleshooting Guide

## Common Issues and Solutions

### Issue: "Login failed" Error

#### 1. Check API URL Configuration

Create a `.env.local` file in the `dr.coffee` directory:

```env
NEXT_PUBLIC_API_URL=https://localhost:7022/api
```

**Important**: 
- If your API is running on **HTTPS** (port 7022): `https://localhost:7022/api`
- If your API is running on **HTTP** (port 5091): `http://localhost:5091/api`

#### 2. Verify API is Running

1. Open your ASP.NET Core API project
2. Make sure it's running (check the terminal/console)
3. Test the login endpoint in Swagger: `https://localhost:7022/swagger`
4. Try the `/api/auth/login` endpoint directly

#### 3. Check Browser Console

Open browser DevTools (F12) → Console tab and look for:
- `🌐 API Base URL: ...` - Should show the correct URL
- `🔐 Attempting login to: ...` - Should show the full endpoint
- Any red error messages

#### 4. Check Network Tab

1. Open DevTools (F12) → Network tab
2. Try logging in
3. Look for the `/auth/login` request
4. Check:
   - **Status Code**: Should be 200 (success) or 401 (wrong credentials)
   - **Request URL**: Should match your API URL
   - **Request Headers**: Should have `Content-Type: application/json`
   - **Response**: Check the response body for error details

#### 5. Common Error Messages

**"Cannot connect to server"**
- API is not running
- Wrong API URL in `.env.local`
- CORS issue (check backend CORS configuration)

**"Invalid email or password"**
- Wrong credentials
- User doesn't exist in database
- Password doesn't match

**"API endpoint not found"**
- Wrong API URL
- API route doesn't exist
- Check `/api/auth/login` exists in Swagger

**"Unauthorized"**
- Wrong credentials
- User exists but password is incorrect

#### 6. Verify Database

1. Make sure database is set up
2. Check if admin user exists:
   - Email: `admin@drcoffee.com`
   - Password: `Admin@123`
3. If user doesn't exist, restart API to trigger seed data

#### 7. CORS Issues

If you see CORS errors in console:
- Check `Program.cs` has CORS configured
- Ensure `AllowAll` policy is active
- Verify CORS middleware is before `UseAuthorization`

#### 8. SSL Certificate Issues

If using HTTPS and getting certificate errors:
- Click "Advanced" → "Proceed to localhost" in browser
- Or use HTTP instead: `http://localhost:5091/api`

## Quick Debug Steps

1. **Check API URL**:
   ```javascript
   // In browser console:
   console.log('API URL:', process.env.NEXT_PUBLIC_API_URL)
   ```

2. **Test API directly**:
   ```bash
   # In terminal (PowerShell):
   curl -X POST https://localhost:7022/api/auth/login -H "Content-Type: application/json" -d '{\"email\":\"admin@drcoffee.com\",\"password\":\"Admin@123\"}'
   ```

3. **Check API logs**: Look at your ASP.NET Core API console for errors

4. **Verify credentials**: Try logging in via Swagger UI first

## Still Not Working?

1. Check browser console for detailed error messages
2. Check Network tab for the actual request/response
3. Verify API is running and accessible
4. Check `.env.local` file exists and has correct URL
5. Restart both frontend and backend servers


