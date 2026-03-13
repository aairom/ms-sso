#!/bin/bash

# Sanitize Documentation Script
# Replaces real tenant names, usernames, and URLs with generic examples

set -e

echo "🔒 Sanitizing documentation files..."

# Define replacements
declare -A replacements=(
    # Tenant and domain
    ["3w2lyf"]="contoso"
    ["3w2lyf.onmicrosoft.com"]="contoso.onmicrosoft.com"
    ["3w2lyf.sharepoint.com"]="contoso.sharepoint.com"
    
    # User emails
    ["adminAlainAirom@3w2lyf.onmicrosoft.com"]="admin@contoso.onmicrosoft.com"
    ["user1@3w2lyf.onmicrosoft.com"]="user1@contoso.onmicrosoft.com"
    ["user2@3w2lyf.onmicrosoft.com"]="user2@contoso.onmicrosoft.com"
    
    # Site names
    ["aamSite"]="siteA"
    ["aamSiteNumber2"]="siteB"
    ["AAM Site"]="Site A"
    ["AAM Site Number 2"]="Site B"
)

# Files to sanitize
files=(
    "Docs/01-SSO-Overview.md"
    "Docs/02-Azure-Setup-Guide.md"
    "Docs/03-Implementation-Guide.md"
    "Docs/04-Quick-Start-Checklist.md"
    "index.html"
    "README.md"
)

# Perform replacements
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  Processing: $file"
        
        for search in "${!replacements[@]}"; do
            replace="${replacements[$search]}"
            # Use sed with backup
            sed -i.bak "s|$search|$replace|g" "$file"
        done
        
        # Remove backup file
        rm -f "${file}.bak"
        
        echo "  ✓ Sanitized: $file"
    else
        echo "  ⚠ Skipped (not found): $file"
    fi
done

echo ""
echo "✅ Documentation sanitization complete!"
echo ""
echo "Replacements made:"
echo "  • 3w2lyf → contoso"
echo "  • adminAlainAirom@3w2lyf.onmicrosoft.com → admin@contoso.onmicrosoft.com"
echo "  • user1@3w2lyf.onmicrosoft.com → user1@contoso.onmicrosoft.com"
echo "  • user2@3w2lyf.onmicrosoft.com → user2@contoso.onmicrosoft.com"
echo "  • aamSite → siteA"
echo "  • aamSiteNumber2 → siteB"
echo ""

# Made with Bob
