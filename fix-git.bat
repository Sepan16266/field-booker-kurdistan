@echo off
chcp 65001 >nul
echo Fixing Git repository...

echo Adding updated .gitignore and .gitattributes...
git add .gitignore
git add .gitattributes

echo Creating commit...
git commit -m "Security: Update .gitignore and add .gitattributes for sensitive files protection"

echo Attempting to push to GitHub...
git push origin main

echo Done!
pause
