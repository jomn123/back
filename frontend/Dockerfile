# Build stage
FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

# Set the API URL for production
ENV VITE_API_URL=http://backend:3000

RUN npm run build

# Production stage with Nginx
FROM nginx:alpine

# Copy built files from the build stage
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Copy custom Nginx config
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]