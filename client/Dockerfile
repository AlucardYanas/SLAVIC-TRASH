FROM node:20

WORKDIR /opt/app
COPY package*.json /opt/app/
RUN npm install
COPY . .
EXPOSE 5147

CMD ["npm", "run", "dev"]