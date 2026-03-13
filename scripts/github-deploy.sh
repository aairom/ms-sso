#!/bin/bash

# GitHub Deployment Script
# Usage: 
#   First time: ./scripts/github-deploy.sh <github-repo-url>
#   Subsequent: ./scripts/github-deploy.sh [commit-message]

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
print_info() {
    echo -e "${BLUE}ℹ ${1}${NC}"
}

print_success() {
    echo -e "${GREEN}✓ ${1}${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ ${1}${NC}"
}

print_error() {
    echo -e "${RED}✗ ${1}${NC}"
}

# Function to check if git is initialized
is_git_initialized() {
    if [ -d ".git" ]; then
        return 0
    else
        return 1
    fi
}

# Function to check if remote exists
has_remote() {
    if git remote | grep -q "origin"; then
        return 0
    else
        return 1
    fi
}

# Function to initialize git repository
init_git_repo() {
    local repo_url=$1
    
    print_info "Initializing Git repository..."
    git init
    print_success "Git repository initialized"
    
    print_info "Adding remote origin: ${repo_url}"
    git remote add origin "${repo_url}"
    print_success "Remote origin added"
    
    # Create .gitignore if it doesn't exist
    if [ ! -f ".gitignore" ]; then
        print_info "Creating .gitignore..."
        cat > .gitignore << 'EOF'
# Folders starting with underscore
_*/

# Node modules
node_modules/

# Environment variables
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/
*.min.js
*.min.css

# Temporary files
tmp/
temp/
*.tmp

# Cache
.cache/
.parcel-cache/
EOF
        print_success ".gitignore created"
    fi
}

# Function to stage and commit changes
commit_changes() {
    local commit_msg=$1
    
    print_info "Staging all changes..."
    git add .
    
    # Check if there are changes to commit
    if git diff --staged --quiet; then
        print_warning "No changes to commit"
        return 1
    fi
    
    print_info "Committing changes..."
    git commit -m "${commit_msg}"
    print_success "Changes committed: ${commit_msg}"
    return 0
}

# Function to push to GitHub
push_to_github() {
    local branch=$(git branch --show-current)
    
    if [ -z "$branch" ]; then
        branch="main"
        print_info "Creating main branch..."
        git checkout -b main
    fi
    
    print_info "Pushing to GitHub (branch: ${branch})..."
    
    # Check if branch exists on remote
    if git ls-remote --heads origin "${branch}" | grep -q "${branch}"; then
        # Branch exists, normal push
        git push origin "${branch}"
    else
        # First push, set upstream
        git push -u origin "${branch}"
    fi
    
    print_success "Successfully pushed to GitHub!"
}

# Main script logic
main() {
    echo ""
    print_info "=== GitHub Deployment Script ==="
    echo ""
    
    # Check if we're in the project directory
    if [ ! -f "index.html" ]; then
        print_error "Error: Must be run from project root directory"
        exit 1
    fi
    
    # Determine if this is first-time setup or subsequent push
    if ! is_git_initialized; then
        # First time setup
        if [ -z "$1" ]; then
            print_error "Error: GitHub repository URL required for first-time setup"
            echo "Usage: ./scripts/github-deploy.sh <github-repo-url>"
            echo "Example: ./scripts/github-deploy.sh https://github.com/username/repo.git"
            exit 1
        fi
        
        repo_url=$1
        init_git_repo "${repo_url}"
        
        # Initial commit
        commit_msg="Initial commit: SharePoint SSO Demo with Microsoft Entra ID"
        if commit_changes "${commit_msg}"; then
            push_to_github
        fi
        
        echo ""
        print_success "=== Repository initialized and pushed to GitHub ==="
        print_info "For subsequent pushes, use: ./scripts/github-deploy.sh \"Your commit message\""
        
    else
        # Subsequent pushes
        if ! has_remote; then
            print_error "Error: No remote origin found"
            print_info "Add remote with: git remote add origin <github-repo-url>"
            exit 1
        fi
        
        # Get commit message
        if [ -z "$1" ]; then
            # No message provided, prompt user
            echo -n "Enter commit message: "
            read commit_msg
            
            if [ -z "$commit_msg" ]; then
                commit_msg="Update: $(date '+%Y-%m-%d %H:%M:%S')"
                print_warning "No message provided, using: ${commit_msg}"
            fi
        else
            commit_msg=$1
        fi
        
        # Commit and push
        if commit_changes "${commit_msg}"; then
            push_to_github
            echo ""
            print_success "=== Changes successfully deployed to GitHub ==="
        else
            echo ""
            print_warning "=== No changes to deploy ==="
        fi
    fi
    
    echo ""
}

# Run main function
main "$@"

# Made with Bob
