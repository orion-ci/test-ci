FROM nginx

RUN rm /etc/nginx/nginx.conf

ADD default.conf /etc/nginx/nginx.conf

COPY dist/  /usr/share/nginx/html/
