# CraftRuv Web - AI-Powered Interior Design Platform

Современное веб-приложение для дизайна интерьеров с поддержкой AI/CV технологий (TensorFlow.js, MediaPipe, Three.js).

## 🚀 Быстрый старт

### Локальная разработка

```bash
# Установка зависимостей
pnpm install

# Запуск в режиме разработки (http://localhost:5173)
pnpm dev

# Сборка для продакшена
pnpm build

# Предварительный просмотр сборки (http://localhost:4173)
pnpm preview
```

### 🛠 Технологический стек

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, Radix UI, Lucide Icons
- **3D**: Three.js, React Three Fiber
- **AI/CV**: TensorFlow.js, MediaPipe
- **Routing**: React Router Dom
- **Forms**: React Hook Form, Zod validation

## 📦 Развертывание

Приложение готово к развертыванию на следующих платформах:

### 1. Netlify (рекомендуется)
```bash
# Автоматическое развертывание через Git
# Настройки уже в netlify.toml

# Или ручное развертывание
npm install -g netlify-cli
pnpm build
netlify deploy --prod --dir=dist
```

### 2. Vercel
```bash
# Автоматическое развертывание через Git
# Настройки уже в vercel.json

# Или ручное развертывание
npm install -g vercel
vercel --prod
```

### 3. Docker
```bash
# Локальный запуск
docker build -t craftruv-web .
docker run -p 3000:80 craftruv-web

# Или с docker-compose
docker-compose up -d
```

### 4. Другие платформы
- **GitHub Pages**: `pnpm add -D gh-pages && pnpm run deploy`
- **Firebase Hosting**: См. DEPLOYMENT.md
- **AWS S3 + CloudFront**: См. DEPLOYMENT.md

## 🔧 Конфигурация

### Переменные окружения
Создайте `.env` файл в корне проекта:

```env
VITE_API_URL=https://your-api.com
VITE_APP_TITLE=CraftRuv Web
```

### Важные особенности
- Переменные должны начинаться с `VITE_`
- Для AI функций требуется HTTPS
- WebGL необходим для 3D функций

## 📊 Статистика сборки

- **Общий размер**: ~2.8MB (сжато: ~659KB)
- **CSS**: ~94KB (сжато: ~15KB)
- **Время сборки**: ~8-10 секунд

## 🔍 Автоматизация (CI/CD)

GitHub Actions настроен для автоматического развертывания:
- **Тестирование**: Автоматически при push/PR
- **Netlify**: Автоматическое развертывание на main
- **Docker**: Сборка и публикация образа

### Настройка секретов GitHub:
- `NETLIFY_SITE_ID` и `NETLIFY_AUTH_TOKEN`
- `DOCKER_USERNAME` и `DOCKER_PASSWORD`

## 📱 Поддерживаемые браузеры

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari 14+

## 🆘 Решение проблем

### Большой размер бандла
Рассмотрите динамические импорты для AI библиотек:
```javascript
const loadAI = async () => {
  const tf = await import('@tensorflow/tfjs');
  return tf;
};
```

### Проблемы с MediaPipe/TensorFlow
- Убедитесь в наличии HTTPS
- Проверьте поддержку WebGL
- Проверьте CORS настройки

### Ошибки сборки
- Убедитесь в правильности версий Node.js (18+)
- Очистите кэш: `pnpm store prune`
- Переустановите зависимости: `rm -rf node_modules pnpm-lock.yaml && pnpm install`

## 📚 Документация

- **Полное руководство**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **API документация**: В разработке
- **Компоненты**: Storybook (планируется)

## 🤝 Участие в разработке

```bash
git clone <repository>
cd craftruv-web
pnpm install
pnpm dev
```

## 📄 Лицензия

Частный проект. Все права защищены.

---

**Статус**: ✅ Готово к развертыванию  
**Версия**: 0.1.0  
**Последнее обновление**: $(date +'%Y-%m-%d')
