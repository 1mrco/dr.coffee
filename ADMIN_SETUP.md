# Admin Section Setup Guide

This guide will help you set up and use the Admin Section for Dr.Coffee management.

## Prerequisites

1. **Backend API Running**: Make sure your ASP.NET Core API is running
2. **Node.js & npm**: Ensure you have Node.js installed

## Installation

### 1. Install Dependencies

```bash
cd dr.coffee
npm install
```

This will install `axios` and other required dependencies.

### 2. Configure API URL

Create a `.env.local` file in the `dr.coffee` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Or if your API is running on HTTPS:
```env
NEXT_PUBLIC_API_URL=https://localhost:5001/api
```

**Important**: Update the URL to match your ASP.NET Core API URL.

## Features

### 🔐 Authentication
- **Login Page**: `/admin/login`
- JWT token stored in localStorage
- Automatic token injection in API requests
- Role-based access control (Admin/Manager only)

### 📦 Product Management
- **Route**: `/admin/products`
- View all products in a table
- Add new products with full details
- Edit product prices via modal popup
- Delete products with confirmation
- Real-time updates

### 🛒 Order Management
- **Route**: `/admin/orders`
- View all customer orders
- Filter orders by status
- Update order status (Pending → Completed, etc.)
- View detailed order information
- Order summary with items and totals

## File Structure

```
dr.coffee/
├── app/
│   └── admin/
│       ├── layout.tsx          # Admin layout wrapper with AuthProvider
│       ├── page.tsx             # Redirects to /admin/products
│       ├── login/
│       │   └── page.tsx         # Admin login page
│       ├── products/
│       │   └── page.tsx         # Products management page
│       └── orders/
│           └── page.tsx         # Orders management page
├── components/
│   ├── AdminLayout.tsx          # Admin sidebar and layout
│   └── ProtectedRoute.tsx       # Route protection component
├── contexts/
│   └── AuthContext.tsx         # Authentication context
└── services/
    └── api.ts                   # Centralized API service with JWT
```

## Usage

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Access Admin Section

Navigate to: `http://localhost:3000/admin/login`

### 3. Login

Use the default credentials (or your custom ones):
- **Email**: `admin@drcoffee.com`
- **Password**: `Admin@123`

### 4. Manage Products

1. Click on **Products** in the sidebar
2. Click **Add New Product** to create a product
3. Click the **Edit** icon to update prices
4. Click the **Delete** icon to remove a product

### 5. Manage Orders

1. Click on **Orders** in the sidebar
2. Use the status filter to view specific orders
3. Click **View Details** to see full order information
4. Use the status dropdown to update order status

## API Service

The API service (`services/api.ts`) automatically:
- Adds JWT token to all requests
- Handles 401 errors (redirects to login)
- Provides typed methods for all endpoints

### Example Usage:

```typescript
import { apiService } from '@/services/api'

// Get all products
const products = await apiService.getProducts()

// Update order status
await apiService.updateOrderStatus(orderId, 'Completed')
```

## Protected Routes

The `/admin/*` routes are protected by:
1. **ProtectedRoute Component**: Checks authentication
2. **Role Verification**: Ensures user has Admin or Manager role
3. **Automatic Redirect**: Redirects to `/admin/login` if unauthorized

## Customization

### Change API URL

Update `services/api.ts`:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'YOUR_API_URL'
```

### Modify Admin Layout

Edit `components/AdminLayout.tsx` to customize:
- Sidebar navigation
- Header content
- User information display

### Add New Admin Pages

1. Create a new page in `app/admin/your-page/page.tsx`
2. Add navigation link in `components/AdminLayout.tsx`
3. Use `ProtectedRoute` if needed

## Troubleshooting

### API Connection Issues

1. **Check API URL**: Verify `.env.local` has the correct URL
2. **CORS**: Ensure your ASP.NET Core API allows requests from `http://localhost:3000`
3. **SSL**: If using HTTPS, ensure certificates are valid

### Authentication Issues

1. **Token Expired**: Logout and login again
2. **Invalid Credentials**: Check backend user credentials
3. **Role Issues**: Ensure user has Admin or Manager role

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

## Security Notes

1. **JWT Storage**: Tokens are stored in localStorage (consider httpOnly cookies for production)
2. **API URL**: Never commit `.env.local` with production URLs
3. **Role Validation**: Always validate roles on the backend
4. **HTTPS**: Use HTTPS in production

## Next Steps

- Add more admin features (Categories management, Analytics, etc.)
- Implement pagination for large datasets
- Add search and filtering
- Create admin user management
- Add activity logs

## Support

For issues:
1. Check browser console for errors
2. Verify API is running and accessible
3. Check network tab for failed requests
4. Review backend API logs


