FROM node:22

WORKDIR /discord/bot

COPY . .

RUN npm install

RUN apt-get -y update && apt-get -y upgrade && apt-get install -y ffmpeg

CMD [ "npm", "run", "bot" ]