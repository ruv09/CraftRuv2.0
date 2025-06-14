# Руководство по развертыванию CraftRuv Web

Это приложение React + Vite с поддержкой AI/CV технологий (TensorFlow.js, MediaPipe, Three.js).

## Локальная разработка

### Требования
- Node.js 18+
- pnpm

### Запуск
```bash
# Установка зависимостей
pnpm install

# Запуск в режиме разработки
pnpm dev

# Сборка для продакшена
pnpm build

# Предварительный просмотр сборки
pnpm preview
```

Приложение будет доступно по адресу: http://localhost:5173

## Развертывание на платформах

### 1. Netlify

#### Автоматическое развертывание:
1. Подключите ваш GitHub репозиторий к Netlify
2. Настройки сборки уже настроены в `netlify.toml`
3. Установите переменные окружения при необходимости

#### Ручное развертывание:
```bash
# Установите Netlify CLI
npm install -g netlify-cli

# Сборка проекта
pnpm build

# Развертывание
netlify deploy --prod --dir=dist
```

### 2. Vercel

#### Автоматическое развертывание:
1. Импортируйте проект в Vercel
2. Конфигурация уже настроена в `vercel.json`
3. Vercel автоматически определит Vite framework

#### Ручное развертывание:
```bash
# Установите Vercel CLI
npm install -g vercel

# В корне проекта
vercel

# Для продакшена
vercel --prod
```

### 3. GitHub Pages

```bash
# Установите gh-pages
pnpm add -D gh-pages

# Добавьте в package.json scripts:
"deploy": "pnpm build && gh-pages -d dist"

# Развертывание
pnpm deploy
```

### 4. Firebase Hosting

```bash
# Установите Firebase CLI
npm install -g firebase-tools

# Инициализация
firebase init hosting

# Настройте:
# - Public directory: dist
# - Single-page app: Yes
# - Automatic builds: No

# Сборка и развертывание
pnpm build
firebase deploy
```

## Docker развертывание

### Локальный запуск с Docker

```bash
# Сборка образа
docker build -t craftruv-web .

# Запуск контейнера
docker run -p 3000:80 craftruv-web
```

### Docker Compose

```bash
# Запуск с docker-compose
docker-compose up -d

# Остановка
docker-compose down
```

Приложение будет доступно по адресу: http://localhost:3000

### Развертывание на облачных платформах

#### AWS ECS / Fargate
1. Соберите и загрузите образ в ECR
2. Создайте task definition с нашим образом
3. Настройте Application Load Balancer
4. Запустите ECS сервис

#### Google Cloud Run
```bash
# Сборка и отправка в Container Registry
gcloud builds submit --tag gcr.io/PROJECT-ID/craftruv-web

# Развертывание в Cloud Run
gcloud run deploy --image gcr.io/PROJECT-ID/craftruv-web --platform managed
```

#### DigitalOcean App Platform
1. Подключите GitHub репозиторий
2. Настройте как Docker приложение
3. Укажите Dockerfile

## CI/CD с GitHub Actions

Файл `.github/workflows/deploy.yml` настроен для автоматического развертывания.

### Настройка секретов в GitHub:

#### Для Netlify:
- `NETLIFY_SITE_ID`: ID сайта в Netlify
- `NETLIFY_AUTH_TOKEN`: Personal Access Token

#### Для Docker Hub:
- `DOCKER_USERNAME`: Имя пользователя Docker Hub
- `DOCKER_PASSWORD`: Пароль или Access Token

## Переменные окружения

При необходимости создайте `.env` файл:

```env
# Пример переменных окружения
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=CraftRuv Web
```

**Важно**: Переменные в Vite должны начинаться с `VITE_`

## Оптимизация для продакшена

### 1. Анализ размера бандла
```bash
pnpm add -D rollup-plugin-visualizer
pnpm build
```

### 2. Кэширование
- Статические ресурсы кэшируются на 1 год
- HTML файлы не кэшируются для мгновенных обновлений

### 3. Компрессия
- Включен gzip для всех текстовых ресурсов
- Оптимизация изображений автоматическая

## Мониторинг и логи

### Логи в Docker
```bash
# Просмотр логов
docker logs craftruv-web

# Мониторинг в реальном времени
docker logs -f craftruv-web
```

### Healthcheck endpoint
Добавьте в nginx.conf если нужен healthcheck:
```nginx
location /health {
    access_log off;
    return 200 "healthy\n";
    add_header Content-Type text/plain;
}
```

## Решение проблем

### Проблемы с MediaPipe/TensorFlow
- Убедитесь, что HTTPS включен (требуется для WebGL)
- Проверьте CORS политики для AI моделей
- Установите правильные заголовки безопасности

### Проблемы с Three.js
- Проверьте поддержку WebGL в браузере
- Убедитесь в наличии аппаратного ускорения

### Большой размер бандла
- Используйте динамические импорты для AI библиотек
- Рассмотрите code splitting для Three.js сцен

```javascript
// Пример динамического импорта
const loadTensorFlow = async () => {
  const tf = await import('@tensorflow/tfjs');
  return tf;
};
```

## Поддержка

Для получения помощи:
1. Проверьте логи браузера (Console)
2. Проверьте логи сервера/контейнера
3. Убедитесь в правильности переменных окружения