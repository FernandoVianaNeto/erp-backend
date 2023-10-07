FROM public.ecr.aws/m8n7w3l2/fretehub:node-16-alpine as development

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock .

RUN yarn install

COPY . .

RUN npm run build

FROM public.ecr.aws/m8n7w3l2/fretehub:node-16-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/src/main.js"]
