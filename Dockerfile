FROM node:20.15.0-alpine AS dependencies
USER node
WORKDIR /app
COPY --chown=node:node package*.json ./
RUN npm ci

FROM dependencies AS development
COPY --chown=node:node ./ ./
COPY --chown=node:node scripts/install-docker.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/install-docker.sh
EXPOSE 3001
ENTRYPOINT ["install-docker.sh"]
CMD ["npm", "start"]

FROM dependencies AS test
COPY --chown=node:node ./ ./
CMD ["npm", "run", "test"]