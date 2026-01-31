@echo off
echo ==========================================
echo   MedStore Dependency Installer
echo ==========================================
echo.

echo [1/2] Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies!
    pause
    exit /b %errorlevel%
)
cd ..

echo.
echo [2/2] Installing Frontend Dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies!
    pause
    exit /b %errorlevel%
)
cd ..

echo.
echo ==========================================
echo   Installation Complete!
echo ==========================================
echo You can now run 'start.bat' to launch the application.
pause
