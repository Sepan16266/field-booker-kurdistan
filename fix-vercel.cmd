@echo off
echo Fixing Vercel configuration...

echo Adding updated vercel.json...
git add vercel.json

echo Creating commit...
git commit -m "Fix Vercel configuration for proper deployment"

echo Pushing to GitHub...
git push origin main

echo Done! Vercel will automatically redeploy.
echo Check your Vercel dashboard in a few minutes.
pause
