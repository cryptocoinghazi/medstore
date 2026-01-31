@echo off
echo ==========================================
echo   Starting MedStore Application
echo ==========================================
echo.

echo Starting Backend Server (NestJS)...
start "MedStore Backend" cmd /k "cd backend && npm run start:dev"

echo Starting Frontend Server (Next.js)...
start "MedStore Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Servers are launching in separate windows.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000 (or 3001/3002 if busy)
echo.
pause
