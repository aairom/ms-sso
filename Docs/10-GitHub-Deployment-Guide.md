# GitHub Deployment Script

## Overview

The `github-deploy.sh` script automates the process of deploying your SharePoint SSO Demo project to GitHub. It handles both initial repository setup and subsequent updates with a single command.

## Features

- ✅ **One-shot deployment**: Handles `git init` and all required setup automatically
- ✅ **Smart detection**: Automatically detects if this is first-time setup or subsequent push
- ✅ **Automatic .gitignore**: Creates .gitignore with proper exclusions (including `_*` folders)
- ✅ **Error handling**: Exits on errors to prevent partial deployments
- ✅ **Colored output**: Clear visual feedback with colored messages
- ✅ **No manual steps**: Everything is automated

## Prerequisites

- Git installed on your system
- GitHub repository created (get the URL from GitHub)
- Terminal/Command line access

## Usage

### First Time Deployment

When deploying for the first time, provide your GitHub repository URL:

```bash
./scripts/github-deploy.sh https://github.com/username/repository.git
```

**Example:**
```bash
./scripts/github-deploy.sh https://github.com/johndoe/sharepoint-sso-demo.git
```

**What it does:**
1. Initializes Git repository (`git init`)
2. Creates `.gitignore` if it doesn't exist
3. Adds remote origin with your GitHub URL
4. Stages all files
5. Creates initial commit: "Initial commit: SharePoint SSO Demo with Microsoft Entra ID"
6. Pushes to GitHub (creates `main` branch)

### Subsequent Deployments

After the first deployment, you only need to provide a commit message:

```bash
./scripts/github-deploy.sh "Your commit message here"
```

**Examples:**
```bash
./scripts/github-deploy.sh "Fixed PKCE authentication error"
./scripts/github-deploy.sh "Updated documentation"
./scripts/github-deploy.sh "Added new SharePoint integration features"
```

**Interactive mode** (if no message provided):
```bash
./scripts/github-deploy.sh
# Script will prompt: "Enter commit message: "
```

**What it does:**
1. Stages all changes
2. Commits with your message
3. Pushes to GitHub

## Excluded Files and Folders

The script automatically excludes:

### Folders Starting with Underscore
- `_*` - Any folder starting with underscore (e.g., `_temp/`, `_backup/`)

### Sensitive Files
- `.env`, `.env.local` - Environment variables
- `config.local.js`, `secrets.js` - Local configuration

### Development Files
- `node_modules/` - Node.js dependencies
- `.vscode/`, `.idea/` - IDE settings
- `*.log` - Log files
- `.DS_Store`, `Thumbs.db` - OS files

### Build Files
- `dist/`, `build/` - Build outputs
- `*.min.js`, `*.min.css` - Minified files

## Script Output

The script provides colored output for easy reading:

- 🔵 **Blue (ℹ)**: Informational messages
- 🟢 **Green (✓)**: Success messages
- 🟡 **Yellow (⚠)**: Warnings
- 🔴 **Red (✗)**: Errors

**Example output:**
```
=== GitHub Deployment Script ===

ℹ Initializing Git repository...
✓ Git repository initialized
ℹ Adding remote origin: https://github.com/username/repo.git
✓ Remote origin added
ℹ Creating .gitignore...
✓ .gitignore created
ℹ Staging all changes...
ℹ Committing changes...
✓ Changes committed: Initial commit: SharePoint SSO Demo with Microsoft Entra ID
ℹ Pushing to GitHub (branch: main)...
✓ Successfully pushed to GitHub!

=== Repository initialized and pushed to GitHub ===
ℹ For subsequent pushes, use: ./scripts/github-deploy.sh "Your commit message"
```

## Troubleshooting

### Error: "Permission denied"

**Problem:** Script is not executable

**Solution:**
```bash
chmod +x scripts/github-deploy.sh
```

### Error: "Must be run from project root directory"

**Problem:** Script is being run from wrong directory

**Solution:** Navigate to project root (where `index.html` is located):
```bash
cd /path/to/ms-sso
./scripts/github-deploy.sh
```

### Error: "GitHub repository URL required"

**Problem:** First-time deployment without URL

**Solution:** Provide your GitHub repository URL:
```bash
./scripts/github-deploy.sh https://github.com/username/repo.git
```

### Error: "No remote origin found"

**Problem:** Git repository exists but no remote configured

**Solution:** Add remote manually:
```bash
git remote add origin https://github.com/username/repo.git
```

### Error: "Authentication failed"

**Problem:** GitHub credentials not configured

**Solution:** Configure Git credentials:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

For HTTPS, you may need a Personal Access Token (PAT):
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token with `repo` scope
3. Use token as password when prompted

### No Changes to Commit

**Message:** "No changes to commit"

**Meaning:** All files are already committed and pushed

**Action:** No action needed - everything is up to date

## Advanced Usage

### Check Git Status

Before deploying, check what will be committed:
```bash
git status
```

### View Commit History

See previous commits:
```bash
git log --oneline
```

### Force Push (Use with Caution)

If you need to force push (overwrites remote):
```bash
git push -f origin main
```

⚠️ **Warning:** Force push can cause data loss. Only use if you know what you're doing.

### Change Branch

To push to a different branch:
```bash
git checkout -b feature-branch
./scripts/github-deploy.sh "Feature update"
```

## Best Practices

1. **Commit Often**: Make small, focused commits
2. **Descriptive Messages**: Use clear commit messages
3. **Test Before Push**: Ensure code works before deploying
4. **Review Changes**: Check `git status` before committing
5. **Pull Before Push**: If working with others, pull latest changes first:
   ```bash
   git pull origin main
   ./scripts/github-deploy.sh "Your changes"
   ```

## Security Notes

- ✅ Script automatically excludes sensitive files via `.gitignore`
- ✅ Never commit real credentials or API keys
- ✅ Use environment variables for sensitive data
- ✅ Review `.gitignore` before first push

## Examples

### Complete First-Time Setup

```bash
# Navigate to project directory
cd /Users/alainairom/Devs/ms-sso

# Make script executable (if not already)
chmod +x scripts/github-deploy.sh

# Deploy to GitHub
./scripts/github-deploy.sh https://github.com/username/sharepoint-sso-demo.git
```

### Regular Updates

```bash
# After making changes to your code
./scripts/github-deploy.sh "Fixed authentication bug"

# Multiple changes
./scripts/github-deploy.sh "Updated UI and added new features"

# Quick update
./scripts/github-deploy.sh "Minor fixes"
```

## Support

If you encounter issues:
1. Check the error message (in red)
2. Review the troubleshooting section above
3. Ensure Git is properly installed: `git --version`
4. Verify GitHub repository exists and you have access

---

**Script Location:** `scripts/github-deploy.sh`  
**Created:** 2026-03-13  
**Version:** 1.0