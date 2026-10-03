#!/bin/bash

# خطوتك ربح - سكريبت البدء السريع
# Quick Start Script for Khotwatak Real

echo "👟 خطوتك ربح - عداد الخطوات الذكي"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 16+ from nodejs.org"
    exit 1
fi

echo "✅ Node.js detected: $(node -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Build the app
echo "🔨 Building the app..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ App built successfully"
echo ""

# Check if Capacitor CLI is installed
if ! command -v npx &> /dev/null || ! npm list -g @capacitor/cli &> /dev/null; then
    echo "📥 Installing Capacitor CLI..."
    npm install -g @capacitor/cli
fi

echo "✅ Capacitor CLI ready"
echo ""

# Add Android platform
echo "🤖 Adding Android platform..."
npx cap add android

if [ $? -ne 0 ]; then
    echo "⚠️  Could not add Android. Make sure Android SDK is installed."
    echo "    Or run manually: npx cap add android"
fi

echo "✅ Android platform added"
echo ""

# Copy web files
echo "📋 Copying web files..."
npx cap copy

if [ $? -ne 0 ]; then
    echo "❌ Failed to copy files"
    exit 1
fi

echo "✅ Web files copied"
echo ""

# Final instructions
echo "================================"
echo "🎉 Setup Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Open Android Studio:"
echo "   npx cap open android"
echo ""
echo "2. In Android Studio:"
echo "   - Wait for Gradle to sync"
echo "   - Connect your device or start an emulator"
echo "   - Click 'Run' or press Shift+F10"
echo ""
echo "3. Or build APK directly:"
echo "   npx cap open android"
echo "   Then: Build → Generate Signed Bundle/APK"
echo ""
echo "📖 Full guide: see BUILD_AND_DEPLOY.md"
echo ""
