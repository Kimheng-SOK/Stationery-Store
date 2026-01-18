/**
 * Script to create an admin account
 * 
 * Usage: node scripts/createAdmin.js
 * 
 * This script creates a default admin account if one doesn't exist.
 * You can modify the credentials below or pass them as environment variables.
 */

const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// Admin credentials - Change these or use environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin User';

async function createAdmin() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      $or: [
        { email: ADMIN_EMAIL.toLowerCase() },
        { role: 'admin' }
      ]
    });

    if (existingAdmin) {
      if (existingAdmin.email === ADMIN_EMAIL.toLowerCase()) {
        console.log(`⚠️  Admin account with email "${ADMIN_EMAIL}" already exists!`);
        console.log(`   Name: ${existingAdmin.name}`);
        console.log(`   Role: ${existingAdmin.role}`);
        console.log(`   Active: ${existingAdmin.isActive}`);
        console.log('\n💡 If you want to reset the password, delete the user first or update manually.');
      } else {
        console.log(`⚠️  An admin account already exists with email: ${existingAdmin.email}`);
      }
      process.exit(0);
    }

    // Create admin user
    console.log('\n📝 Creating admin account...');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Name: ${ADMIN_NAME}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    
    const admin = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL.toLowerCase(),
      password: ADMIN_PASSWORD, // Will be hashed automatically by pre-save hook
      role: 'admin',
      isActive: true
    });

    console.log('\n✅ Admin account created successfully!');
    console.log('\n📋 Account Details:');
    console.log(`   ID: ${admin._id}`);
    console.log(`   Name: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Active: ${admin.isActive}`);
    console.log(`   Created: ${admin.createdAt}`);
    
    console.log('\n🔐 Login Credentials:');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating admin account:');
    console.error(error.message);
    
    if (error.code === 11000) {
      console.error('\n💡 Email already exists. Use a different email or delete the existing user.');
    }
    
    process.exit(1);
  }
}

// Run the script
createAdmin();
