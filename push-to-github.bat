@echo off
title Push to GitHub - The Pavilions Phuket
echo ====================================================
echo   Pushing code to: https://github.com/bubblebao/TPP-Small-Lucky-Draw
echo ====================================================
echo.
git push -u origin main
echo.
if %ERRORLEVEL% equ 0 (
    echo ====================================================
    echo   SUCCESS! Pushed successfully to GitHub!
    echo ====================================================
) else (
    echo ====================================================
    echo   Push encountered an error. Please check your GitHub login.
    echo ====================================================
)
echo.
pause
