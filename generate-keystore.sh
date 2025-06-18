#!/bin/bash

# Create a new keystore file
echo "Generating a new Android keystore..."
keytool -genkey -v -keystore my-release-key.keystore \
  -alias my-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass android \
  -keypass android \
  -dname "CN=Android Debug,O=Android,C=US"

echo ""
echo "Keystore generated successfully!"
echo "File: $(pwd)/my-release-key.keystore"
echo ""
echo "IMPORTANT: Keep this keystore file safe and back it up!"
echo "You'll need it to publish updates to your app."
echo ""
echo "Add these to your Codemagic environment variables:"
echo "KEYSTORE: $(base64 my-release-key.keystore | tr -d '\n')"
echo "KEYSTORE_PASSWORD: android"
echo "KEY_ALIAS: my-key-alias"
echo "KEY_PASSWORD: android"
