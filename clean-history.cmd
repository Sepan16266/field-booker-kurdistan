@echo off
echo Cleaning Git history from sensitive files...

echo Step 1: Remove sensitive files from Git index
git rm --cached server/firebase-service-account.json
git rm --cached "attached_assets/Pasted--type-service-account-project-id-mini-football-booking-private-key-id-5465-1749679448022_1749679448025.txt"
git rm --cached "attached_assets/Pasted--type-service-account-project-id-sample-firebase-ai-app-8e459-private-key-id--1749679363791_1749679363793.txt"

echo Step 2: Add updated gitignore
git add .gitignore
git add .gitattributes

echo Step 3: Commit changes
git commit -m "Remove sensitive files from Git tracking"

echo Step 4: Create new clean branch
git checkout --orphan main-clean

echo Step 5: Add all files to new branch
git add .

echo Step 6: Create initial commit on clean branch
git commit -m "Initial commit: Field Booker Kurdistan - Clean version"

echo Step 7: Delete old main branch
git branch -D main

echo Step 8: Rename clean branch to main
git branch -m main

echo Step 9: Force push to GitHub
git push -f origin main

echo Done! Repository cleaned successfully.
pause
