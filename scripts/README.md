# Admin Account Creation Script

## Quick Start

Create an admin account with default credentials:

```bash
npm run create-admin
```

Or run directly:

```bash
node scripts/createAdmin.js
```

## Default Admin Credentials

- **Email:** `admin@example.com`
- **Password:** `admin123`
- **Name:** `Admin User`

## Custom Credentials

You can set custom credentials using environment variables:

### Option 1: Environment Variables

Create a `.env` file in the Backend directory:

```env
ADMIN_EMAIL=your-admin@example.com
ADMIN_PASSWORD=your-secure-password
ADMIN_NAME=Your Admin Name
```

Then run:

```bash
npm run create-admin
```

### Option 2: Command Line

```bash
ADMIN_EMAIL=admin@mysite.com ADMIN_PASSWORD=secure123 npm run create-admin
```

## What the Script Does

1. ✅ Connects to MongoDB
2. ✅ Checks if admin account already exists
3. ✅ Creates admin user with hashed password
4. ✅ Displays account details and credentials

## Security Notes

⚠️ **IMPORTANT:**
- Change the default password after first login!
- Keep admin credentials secure
- Don't commit `.env` file with real credentials
- Use strong passwords in production

## Troubleshooting

### "Email already exists"
- The admin account already exists
- Delete the existing user or use a different email

### "Connection failed"
- Make sure MongoDB is running
- Check `MONGODB_URI` in `.env` file
- Default: `mongodb://localhost:27017/ecommerce`

### "Role validation error"
- Make sure User model is correct
- Role must be either 'customer' or 'admin'

## Example Output

```
🔌 Connecting to MongoDB...
✅ Connected to MongoDB successfully

📝 Creating admin account...
   Email: admin@example.com
   Name: Admin User
   Password: admin123

✅ Admin account created successfully!

📋 Account Details:
   ID: 507f1f77bcf86cd799439011
   Name: Admin User
   Email: admin@example.com
   Role: admin
   Active: true
   Created: 2024-01-01T12:00:00.000Z

🔐 Login Credentials:
   Email: admin@example.com
   Password: admin123

⚠️  IMPORTANT: Change the password after first login!
```
