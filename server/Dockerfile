FROM node:20

ENV PATH /opt/app/node_modules/.bin:$PATH

WORKDIR /opt/app
COPY . .
RUN npm i

EXPOSE 3000

CMD [ "npm", "run", "start" ]