FROM node

ENV WORKDIR="~/Desktop/projects/find-me-a-flat"

WORKDIR ${WORKDIR}

COPY package.json .

RUN npm install --quiet

COPY . .