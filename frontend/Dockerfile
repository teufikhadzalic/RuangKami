# Build stage
FROM node:18-alpine AS build

# Buat direktori aplikasi
WORKDIR /usr/src/app

# Salin package.json dan package-lock.json
COPY package*.json ./

# Install dependensi
RUN npm install

# Salin kode sumber aplikasi
COPY . .

# Build aplikasi
RUN npm run build

# Production stage
FROM nginx:alpine

# Salin hasil build ke direktori nginx
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Salin konfigurasi nginx (opsional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Command untuk menjalankan nginx
CMD ["nginx", "-g", "daemon off;"]
