FROM node:12.18-alpine as build-stage

WORKDIR /builder

COPY . .

# Disable Telemetry
ENV NEXT_TELEMETRY_DISABLED=1

RUN yarn install

RUN yarn build

RUN yarn install --production --ignore-scripts --prefer-offline

FROM node:12.18-alpine as extract-stage

WORKDIR /app

COPY --from=build-stage /builder/package.json /builder/next.config.js ./
COPY --from=build-stage /builder/build ./build
COPY --from=build-stage /builder/public ./public
COPY --from=build-stage /builder/node_modules ./node_modules

ENV PORT=3030

EXPOSE 3030

CMD [ "yarn", "start:prod" ]