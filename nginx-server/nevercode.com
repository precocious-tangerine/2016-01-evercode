server {
    listen 80 default_server;
    listen [::]:80 default_server ipv6only=on;


    server_name nevercode.com;

    #access_log  /var/log/nginx/log/host.access.log  main;

    location / {
      root /home
    }

    location /files {
      proxy_pass http://127.0.0.1:3002;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_cache_bypass $http_upgrade;
    }

    location /user {
      proxy_pass http://127.0.0.1:3003;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_cache_bypass $http_upgrade;
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }

}

