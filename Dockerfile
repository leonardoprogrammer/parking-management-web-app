# Etapa 1: Construção da aplicação Angular
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build -- --configuration=production

# Etapa 2: Configuração do servidor para servir a aplicação
FROM nginx:1.25

# Remove a página padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos compilados para o diretório padrão do Nginx
COPY --from=build /app/dist/parkingmanagementweb/browser /usr/share/nginx/html

# Copia o arquivo de configuração personalizado do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]