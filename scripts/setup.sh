#!/bin/bash

# SharePoint SSO Demo - Setup Script
# This script helps you set up the project quickly

set -e

echo "🚀 SharePoint SSO Demo - Setup Script"
echo "======================================"
echo ""

# Check if .env exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled. Keeping existing .env file."
        exit 0
    fi
fi

# Copy .env.example to .env
echo "📝 Creating .env file from template..."
cp .env.example .env
echo "✅ .env file created"
echo ""

# Prompt for configuration
echo "📋 Please provide your configuration details:"
echo ""

# Client ID
read -p "Enter your Azure AD Client ID: " client_id
if [ -n "$client_id" ]; then
    sed -i.bak "s/CLIENT_ID=.*/CLIENT_ID=$client_id/" .env
    echo "✅ Client ID configured"
fi

# Tenant ID
read -p "Enter your Azure AD Tenant ID: " tenant_id
if [ -n "$tenant_id" ]; then
    sed -i.bak "s/TENANT_ID=.*/TENANT_ID=$tenant_id/" .env
    echo "✅ Tenant ID configured"
fi

# Tenant Name
read -p "Enter your SharePoint tenant name (e.g., contoso): " tenant_name
if [ -n "$tenant_name" ]; then
    sed -i.bak "s/TENANT_NAME=.*/TENANT_NAME=$tenant_name/" .env
    sed -i.bak "s/TENANT_DOMAIN=.*/TENANT_DOMAIN=$tenant_name.sharepoint.com/" .env
    echo "✅ Tenant name configured"
fi

# Clean up backup files
rm -f .env.bak

echo ""
echo "✅ Setup complete!"
echo ""
echo "📖 Next steps:"
echo "   1. Review and update .env file with your SharePoint site URLs"
echo "   2. Start a local web server: python -m http.server 3000"
echo "   3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 Documentation: See Docs/12-Environment-Variables-Setup.md"
echo ""

# Made with Bob
