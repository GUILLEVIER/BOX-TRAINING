FROM node:22-alpine
WORKDIR /box-training
RUN node -v
RUN npm -v
RUN npm install -g npm@11.5.1
RUN npm install -g @angular/cli@17