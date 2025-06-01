#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';

console.log('🚀 Building SplashCamper for Android...');

try {
  // 1. Set environment variable for Android build
  process.env.CAPACITOR_PLATFORM = 'android';
  
  // 2. Vérifier que le dossier android existe
  if (!fs.existsSync('android')) {
    console.log('📱 Initializing Android platform...');
    execSync('npx cap add android', { stdio: 'inherit' });
  }
  
  console.log('📦 Building Next.js app for Android...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // 3. Vérifier que le build a créé les fichiers
  const buildDir = '.next';
  if (!fs.existsSync(buildDir)) {
    throw new Error(`Build directory ${buildDir} not found`);
  }
  
  console.log('📱 Copying web assets to Capacitor...');
  execSync('npx cap copy android', { stdio: 'inherit' });
  
  console.log('🔄 Syncing Capacitor plugins...');
  execSync('npx cap sync android', { stdio: 'inherit' });
  
  console.log('✅ Android build completed successfully!');
  console.log('💡 You can now run: npx cap open android');
  console.log('🔧 Or build APK with: npx cap build android');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  console.error('💡 Try running: npm install && npx cap sync');
  process.exit(1);
} 