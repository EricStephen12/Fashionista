@echo off
echo Generating a new Android keystore...

set KEYSTORE_FILE=my-release-key.keystore
set KEY_ALIAS=my-key-alias
set STORE_PASS=android
set KEY_PASS=android

keytool -genkey -v ^
  -keystore %KEYSTORE_FILE% ^
  -alias %KEY_ALIAS% ^
  -keyalg RSA ^
  -keysize 2048 ^
  -validity 10000 ^
  -storepass %STORE_PASS% ^
  -keypass %KEY_PASS% ^
  -dname "CN=Android Debug,O=Android,C=US"

if %ERRORLEVEL% NEQ 0 (
    echo Error generating keystore. Make sure Java is installed and in your PATH.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo Keystore generated successfully!
echo File: %cd%\%KEYSTORE_FILE%
echo.
echo IMPORTANT: Keep this keystore file safe and back it up!
echo You'll need it to publish updates to your app.
echo.
echo Add these to your Codemagic environment variables:
echo KEYSTORE: 
certutil -encode "%CD%\%KEYSTORE_FILE%" temp.txt >nul & type temp.txt & del temp.txt
echo KEYSTORE_PASSWORD: %STORE_PASS%
echo KEY_ALIAS: %KEY_ALIAS%
echo KEY_PASSWORD: %KEY_PASS%
echo.
pause
