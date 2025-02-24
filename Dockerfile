# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.10.0

################################################################################
# 1️⃣ Базовый образ
FROM node:${NODE_VERSION}-alpine as base

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

################################################################################
# 2️⃣ Установка зависимостей
FROM base as deps

# Копируем package.json и package-lock.json перед установкой зависимостей
COPY package.json package-lock.json ./

# Устанавливаем все зависимости, включая devDependencies (чтобы не потерять @types/...)
RUN npm ci

################################################################################
# 3️⃣ Сборка приложения
FROM deps as build

# Копируем весь код проекта
COPY . .

# Генерируем Prisma Client
RUN npx prisma generate

# Собираем TypeScript в JavaScript
RUN npm run build

################################################################################
# 4️⃣ Финальный образ для продакшена
FROM base as final

# Устанавливаем переменную окружения в продакшн
ENV NODE_ENV production

# Запускаем сервер от пользователя node
USER node

# Копируем package.json для работы с package manager
COPY package.json ./

# Копируем production-зависимости и собранное приложение
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# Открываем порт приложения
EXPOSE 4200

# Запускаем сервер
CMD ["npm", "start"]
