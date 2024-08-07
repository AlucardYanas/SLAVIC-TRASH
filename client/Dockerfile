FROM node:20

WORKDIR /opt/app
COPY . .
RUN npm i \
    && mv vite.config.docker.ts vite.config.ts
EXPOSE 5147

CMD ["npm", "run", "dev"]