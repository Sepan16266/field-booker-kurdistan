@echo off
echo Adding updated gitignore and gitattributes...
git add .gitignore
git add .gitattributes
echo Creating commit...
git commit -m "Security: Update gitignore and add gitattributes for sensitive files protection"
echo Pushing to GitHub...
git push origin main
echo Done!
pause
