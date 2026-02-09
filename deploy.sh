#!/bin/bash

# Configuration
SOURCE_DIR="/Users/aravindhsampathkumar/ai_playground/hobbyboard_website/"
REMOTE_DEST="root@49.12.190.41:/home/caddy/hobbyboard/"
KEY_PATH="/Users/aravindhsampathkumar/.ssh/id_rsa_aravindh.net"

# Absolute paths to binaries
RSYNC="/usr/bin/rsync"
SSH="/usr/bin/ssh"

echo "🚀 Starting deployment to HobbyBoard web server..."

# Run rsync with absolute paths
$RSYNC -avz --delete \
    --exclude=".git/" \
    --exclude=".DS_Store" \
    -e "$SSH -i $KEY_PATH" \
    "$SOURCE_DIR" "$REMOTE_DEST"

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
else
    echo "❌ Deployment failed!"
    exit 1
fi
