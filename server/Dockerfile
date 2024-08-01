FROM node:20

ENV PATH /opt/app/node_modules/.bin:$PATH

WORKDIR /opt/app
COPY ./package*.json /opt/app/
RUN npm i
COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start" ]