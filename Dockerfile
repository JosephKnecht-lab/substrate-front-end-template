# pull the base image
FROM node:18-alpine

# set the working direction
WORKDIR /app

# install app dependencies
COPY package.json ./

# copy yarn lock
COPY yarn.lock ./

# install yarn
RUN yarn install 

# add app
COPY . ./

# expose on port 3000
EXPOSE 3000

# start app
CMD ["yarn", "start"]