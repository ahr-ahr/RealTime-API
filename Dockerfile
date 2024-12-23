# Gunakan image Node.js
FROM node:18

# Direktori kerja di dalam container
WORKDIR /usr/src/app

# Salin package.json dan package-lock.json
COPY package*.json ./

# Instal dependensi
RUN npm install

# Salin seluruh kode aplikasi
COPY . .

# Ekspos port aplikasi
EXPOSE 4000

# Jalankan aplikasi
CMD ["node", "/usr/src/app/src/apis/prayer-times-api/index.js"]

