FROM node:20-alpine AS build

# Keep WORKDIR consistent with VPS layout (requested):
WORKDIR /opt/SENA/FrontEnd-SENA

# Allow injecting API URLs at build time
ARG VITE_API_URL
ARG VITE_API_BASE
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_API_BASE=${VITE_API_BASE}

COPY package*.json ./
# use npm ci for reproducible installs
RUN npm ci --production=false

COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
