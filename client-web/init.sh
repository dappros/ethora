grep -rl 'https://api.ethoradev.com' /app/public | xargs sed -i "s@https://api.ethoradev.com@$API_URL@g"
grep -rl 'domainxxx.com' /app/public | xargs sed -i "s@domainxxx.com@$APP_DOMAIN@g"

nginx -g "daemon off;"
