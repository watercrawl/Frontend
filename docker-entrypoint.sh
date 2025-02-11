#!/bin/sh

# Replace the dummy URL with the actual API URL in all JS files
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|http://DUMMY_URL_FOR_REPLACE|${VITE_API_URL}|g" {} +

find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|DUMMY_GOOGLE_ANALYTICS_ID|${VITE_GOOGLE_ANALYTICS_ID}|g" {} +


# Start nginx
exec nginx -g 'daemon off;'
