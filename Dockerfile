FROM node:18-alpine

WORKDIR /app

# Copy everything into the container
COPY . .

# If .yarnrc.yml.old exists, copy it and append its content to .yarnrc.yml
# This is necessary only if the file exists, otherwise, it skips this step
RUN if [ -f ".yarnrc.yml.old" ]; then cat .yarnrc.yml.old >> .yarnrc.yml; fi

# Enable Corepack and prepare Yarn 3.3.0
RUN corepack enable \
    && corepack prepare yarn@stable --activate \
    && yarn set version 3.3.0

# Install Git and clean up cache
RUN apk update && \
    apk add --update git && \
    rm -rf /var/cache/apk/* || true

# Install dependencies
RUN yarn install

# Expose port 8000
EXPOSE 8000

# Start the application
CMD ["yarn", "start"]