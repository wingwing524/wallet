#!/usr/bin/env node

console.log('🚀 Starting build process...');

const { execSync } = require('child_process');
const path = require('path');

try {
  // Navigate to client directory and build
  console.log('📦 Installing client dependencies...');
  process.chdir(path.join(__dirname, 'client'));
  execSync('npm ci', { stdio: 'inherit' });
  
  console.log('🏗️ Building React application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Go back to root
  process.chdir(path.join(__dirname));
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
