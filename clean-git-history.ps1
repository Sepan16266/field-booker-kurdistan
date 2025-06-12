# PowerShell script to clean Git history from sensitive files
# Field Booker Kurdistan - Git Cleanup

Write-Host "🔧 تنظيف تاريخ Git من الملفات الحساسة..." -ForegroundColor Yellow

# Remove sensitive files from Git index (but keep them locally)
Write-Host "📝 إزالة الملفات الحساسة من Git index..." -ForegroundColor Cyan

# Remove from index but keep locally
git rm --cached server/firebase-service-account.json -ErrorAction SilentlyContinue
git rm --cached "attached_assets/Pasted--type-service-account-project-id-mini-football-booking-private-key-id-5465-1749679448022_1749679448025.txt" -ErrorAction SilentlyContinue
git rm --cached "attached_assets/Pasted--type-service-account-project-id-sample-firebase-ai-app-8e459-private-key-id--1749679363791_1749679363793.txt" -ErrorAction SilentlyContinue
git rm --cached .env.production -ErrorAction SilentlyContinue

Write-Host "✅ تم إزالة الملفات الحساسة من Git index" -ForegroundColor Green

# Add updated .gitignore
Write-Host "📝 إضافة .gitignore المحدث..." -ForegroundColor Cyan
git add .gitignore
git add .gitattributes

# Create commit
Write-Host "💾 إنشاء commit جديد..." -ForegroundColor Cyan
git commit -m "🔒 Security: Remove sensitive files and update .gitignore

- Remove Firebase service account files from tracking
- Remove attached_assets sensitive files
- Update .gitignore with comprehensive protection
- Add .gitattributes for additional security

Files are kept locally but not tracked in Git."

Write-Host "🚀 جاهز للرفع على GitHub!" -ForegroundColor Green
Write-Host "قم بتشغيل: git push origin main" -ForegroundColor Yellow
