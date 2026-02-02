@echo off
echo ========================================
echo   Installing Backend Dependencies
echo ========================================
cd backend
call npm install
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Installing Frontend Dependencies
echo ========================================
cd ..
call npm install
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Installation Complete!
echo ========================================
echo.
echo All dependencies have been installed successfully.
echo You can now run start-servers.bat to start both servers.
echo.
pause
