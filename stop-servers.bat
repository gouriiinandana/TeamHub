@echo off
echo ========================================
echo   Stopping TeamHub Servers
echo ========================================
echo.
echo Killing Node.js processes...
echo.

REM Kill all node processes (this will stop both servers)
taskkill /F /IM node.exe 2>nul

if %errorlevel% equ 0 (
    echo Successfully stopped all Node.js servers
) else (
    echo No Node.js servers were running
)

echo.
pause
