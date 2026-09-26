@echo off
setlocal

echo ============================================
echo   RoboKit.ma - Mise a jour et deploiement
echo ============================================
echo.

git add .

git diff --cached --quiet
if %errorlevel%==0 (
    echo Aucun changement detecte - rien a envoyer.
    echo.
    pause
    exit /b 0
)

for /f "tokens=1-3 delims=/ " %%a in ('date /t') do set today=%%a-%%b-%%c
for /f "tokens=1-2 delims=: " %%a in ('time /t') do set now=%%a-%%b

git commit -m "Mise a jour du site - %today% %now%"

echo.
echo Envoi vers GitHub (Netlify redeploiera automatiquement)...
echo.

git push

if %errorlevel% neq 0 (
    echo.
    echo ============================================
    echo   ERREUR : le push a echoue.
    echo   Verifiez votre connexion ou vos identifiants Git.
    echo ============================================
) else (
    echo.
    echo ============================================
    echo   Termine ! Netlify va redeployer le site
    echo   dans les prochaines minutes.
    echo ============================================
)

echo.
pause
