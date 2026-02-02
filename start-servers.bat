@echo off
echo ========================================
echo   Starting TeamHub Servers
echo ========================================
echo.
echo Backend will start on: http://localhost:5000
echo Frontend will start on: http://localhost:5173
echo.
echo Press Ctrl+C in each window to stop the servers
echo ========================================
echo.

REM Start backend server in a new window
start "TeamHub Backend" cmd /k "cd /d %~dp0backend && npm start"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend server in a new window
start "TeamHub Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo Both servers are starting in separate windows...
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Close this window or press any key to exit this launcher.
pause >nul
