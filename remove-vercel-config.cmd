@echo off
echo Removing vercel.json to use Dashboard settings...

echo Adding changes...
git add .

echo Creating commit...
git commit -m "Remove vercel.json to use Dashboard build settings"

echo Pushing to GitHub...
git push origin main

echo Done! Now configure in Vercel Dashboard.
pause
