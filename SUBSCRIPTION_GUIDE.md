# 🔐 Руководство по внедрению системы подписок

Полное руководство по настройке и внедрению системы подписок в CraftRuv Web

## 📋 Содержание

1. [Обзор системы](#обзор-системы)
2. [Настройка Stripe](#настройка-stripe)
3. [Конфигурация базы данных](#конфигурация-базы-данных)
4. [API endpoints](#api-endpoints)
5. [Тестирование](#тестирование)
6. [Развертывание](#развертывание)
7. [Мониторинг](#мониторинг)

## 🎯 Обзор системы

### Архитектура

```
Frontend (React) 
    ↓
SubscriptionContext 
    ↓
API Layer 
    ↓
Stripe Integration 
    ↓
Database (PostgreSQL)
```

### Компоненты

- **Типы подписок**: 4 тарифа (Free, Pro, Business, Enterprise)
- **Защита контента**: SubscriptionGate компонент
- **Управление**: SubscriptionManager для пользователей
- **Интеграция с Stripe**: Автоматические платежи и управление

## 🏦 Настройка Stripe

### 1. Создание аккаунта Stripe

```bash
# 1. Зарегистрируйтесь на https://stripe.com
# 2. Получите API ключи из Dashboard > Developers > API keys
```

### 2. Создание продуктов и цен

```javascript
// Скрипт для создания продуктов в Stripe
const stripe = require('stripe')('sk_test_...');

async function createProducts() {
  // Pro план
  const proProduct = await stripe.products.create({
    name: 'Профессиональный',
    description: 'Для дизайнеров и малого бизнеса',
    metadata: {
      planId: 'pro'
    }
  });

  // Цены для Pro плана
  await stripe.prices.create({
    product: proProduct.id,
    unit_amount: 2900, // $29.00
    currency: 'usd',
    recurring: { interval: 'month' },
    lookup_key: 'pro_monthly'
  });

  await stripe.prices.create({
    product: proProduct.id,
    unit_amount: 29000, // $290.00
    currency: 'usd',
    recurring: { interval: 'year' },
    lookup_key: 'pro_yearly'
  });

  // Повторите для Business и Enterprise планов
}
```

### 3. Настройка вебхуков

```javascript
// Обязательные события для подписки на вебхуки:
const requiredEvents = [
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
  'customer.created',
  'customer.updated'
];
```

URL для вебхука: `https://yourdomain.com/api/webhooks/stripe`

## 🗄️ Конфигурация базы данных

### Таблицы PostgreSQL

```sql
-- Пользователи
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Подписки
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_id VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  current_period_start TIMESTAMP NOT NULL,
  current_period_end TIMESTAMP NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  payment_provider VARCHAR(50) DEFAULT 'stripe',
  provider_subscription_id VARCHAR(255) UNIQUE,
  provider_customer_id VARCHAR(255),
  trial_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Использование ресурсов
CREATE TABLE usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  period_start TIMESTAMP NOT NULL,
  period_end TIMESTAMP NOT NULL,
  projects_count INTEGER DEFAULT 0,
  ai_generations_count INTEGER DEFAULT 0,
  storage_used_gb DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- История платежей
CREATE TABLE billing_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- в центах
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) NOT NULL,
  invoice_id VARCHAR(255),
  payment_date TIMESTAMP NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Индексы для производительности
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_usage_tracking_user_period ON usage_tracking(user_id, period_start, period_end);
CREATE INDEX idx_billing_history_user_id ON billing_history(user_id);
```

## 🔌 API Endpoints

### Создание бэкенда (Express.js + TypeScript)

```javascript
// src/routes/subscriptions.ts
import express from 'express';
import Stripe from 'stripe';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Создание checkout сессии
router.post('/create-checkout-session', authenticateUser, async (req, res) => {
  try {
    const { planId, billingCycle, userId } = req.body;
    
    // Найти цену в Stripe
    const priceId = await getPriceId(planId, billingCycle);
    
    // Создать или получить клиента
    const customer = await getOrCreateStripeCustomer(userId);
    
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing`,
      subscription_data: {
        trial_period_days: 7, // 7 дней пробного периода
        metadata: {
          userId,
          planId
        }
      }
    });

    res.json({ checkoutUrl: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Получение данных подписки
router.get('/:userId', authenticateUser, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const subscription = await db.query(
      'SELECT * FROM subscriptions WHERE user_id = $1 AND status = $2',
      [userId, 'active']
    );
    
    const usage = await db.query(
      'SELECT * FROM usage_tracking WHERE user_id = $1 ORDER BY period_start DESC LIMIT 1',
      [userId]
    );

    res.json({
      subscription: subscription.rows[0] || null,
      usage: usage.rows[0] || { projects: 0, aiGenerations: 0, storageGB: 0 }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Отмена подписки
router.post('/:subscriptionId/cancel', authenticateUser, async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    
    const subscription = await db.query(
      'SELECT provider_subscription_id FROM subscriptions WHERE id = $1',
      [subscriptionId]
    );

    if (subscription.rows[0]) {
      await stripe.subscriptions.update(
        subscription.rows[0].provider_subscription_id,
        { cancel_at_period_end: true }
      );
      
      await db.query(
        'UPDATE subscriptions SET cancel_at_period_end = TRUE WHERE id = $1',
        [subscriptionId]
      );
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Обработка вебхуков Stripe

```javascript
// src/routes/webhooks.ts
router.post('/stripe', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook signature verification failed.`);
  }

  switch (event.type) {
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object);
      break;
    
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object);
      break;
    
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object);
      break;
    
    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object);
      break;
    
    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;
  }

  res.json({received: true});
});

async function handleSubscriptionCreated(subscription) {
  const { userId, planId } = subscription.metadata;
  
  await db.query(
    `INSERT INTO subscriptions 
     (user_id, plan_id, status, current_period_start, current_period_end, 
      provider_subscription_id, provider_customer_id) 
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      userId,
      planId,
      subscription.status,
      new Date(subscription.current_period_start * 1000),
      new Date(subscription.current_period_end * 1000),
      subscription.id,
      subscription.customer
    ]
  );
}
```

## 🧪 Тестирование

### Настройка тестового режима

```bash
# .env файл
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Тестовые карты Stripe

```javascript
// Успешные платежи
const testCards = {
  visa: '4242424242424242',
  visaDebit: '4000056655665556',
  mastercard: '5555555555554444',
  amex: '378282246310005'
};

// Отклоненные платежи
const declinedCards = {
  generic: '4000000000000002',
  insufficientFunds: '4000000000009995',
  lostCard: '4000000000009987'
};
```

### Автоматические тесты

```javascript
// tests/subscription.test.js
describe('Subscription System', () => {
  test('should create checkout session', async () => {
    const response = await request(app)
      .post('/api/subscriptions/create-checkout-session')
      .send({
        planId: 'pro',
        billingCycle: 'monthly',
        userId: testUser.id
      })
      .expect(200);

    expect(response.body.checkoutUrl).toContain('checkout.stripe.com');
  });

  test('should handle subscription webhook', async () => {
    const webhookPayload = createMockWebhook('customer.subscription.created');
    
    await request(app)
      .post('/api/webhooks/stripe')
      .send(webhookPayload)
      .expect(200);

    const subscription = await db.query(
      'SELECT * FROM subscriptions WHERE provider_subscription_id = $1',
      [webhookPayload.data.object.id]
    );

    expect(subscription.rows).toHaveLength(1);
  });
});
```

## 🚀 Развертывание

### Переменные окружения

```bash
# Production .env
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
DATABASE_URL=postgresql://...
FRONTEND_URL=https://yourdomain.com
```

### Docker Compose

```yaml
# docker-compose.production.yml
version: '3.8'
services:
  app:
    build: .
    environment:
      - NODE_ENV=production
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - DATABASE_URL=${DATABASE_URL}
    ports:
      - "3000:3000"
    depends_on:
      - postgres

  postgres:
    image: postgres:14
    environment:
      - POSTGRES_DB=craftruv
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy Subscription System

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: |
          npm install
          npm run test:subscription
          
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          # Ваш скрипт развертывания
```

## 📊 Мониторинг

### Ключевые метрики

```javascript
// analytics/subscription-metrics.js
const metrics = {
  // Бизнес метрики
  mrr: 'Monthly Recurring Revenue',
  arr: 'Annual Recurring Revenue',
  churnRate: 'Процент оттока клиентов',
  ltv: 'Lifetime Value',
  
  // Технические метрики
  webhookLatency: 'Время обработки вебхуков',
  paymentSuccessRate: 'Процент успешных платежей',
  apiResponseTime: 'Время ответа API'
};

// Отслеживание в реальном времени
function trackSubscriptionEvent(event, data) {
  analytics.track(event, {
    ...data,
    timestamp: new Date(),
    source: 'subscription_system'
  });
}
```

### Алерты

```javascript
// monitoring/alerts.js
const alerts = {
  paymentFailure: {
    condition: 'payment_failed_rate > 5%',
    action: 'notify_team',
    channels: ['slack', 'email']
  },
  
  webhookDelay: {
    condition: 'webhook_processing_time > 30s',
    action: 'notify_devops',
    channels: ['pagerduty']
  },
  
  subscriptionChurn: {
    condition: 'daily_churn_rate > 2%',
    action: 'notify_business_team',
    channels: ['slack']
  }
};
```

## 🔧 Maintenance

### Регулярные задачи

```javascript
// tasks/subscription-maintenance.js

// Ежедневно: Синхронизация данных с Stripe
async function syncSubscriptions() {
  const subscriptions = await stripe.subscriptions.list({ limit: 100 });
  
  for (const sub of subscriptions.data) {
    await updateLocalSubscription(sub);
  }
}

// Еженедельно: Очистка устаревших данных
async function cleanupOldData() {
  await db.query(
    'DELETE FROM usage_tracking WHERE period_end < NOW() - INTERVAL \'2 years\''
  );
}

// Ежемесячно: Анализ метрик
async function generateMetricsReport() {
  const metrics = await calculateSubscriptionMetrics();
  await sendMetricsReport(metrics);
}
```

### Бэкапы

```bash
#!/bin/bash
# backup-subscriptions.sh

# Бэкап базы данных
pg_dump $DATABASE_URL > "backup-$(date +%Y%m%d).sql"

# Бэкап конфигурации Stripe
curl -X GET "https://api.stripe.com/v1/products" \
  -H "Authorization: Bearer $STRIPE_SECRET_KEY" \
  > "stripe-products-$(date +%Y%m%d).json"
```

## 🚨 Troubleshooting

### Частые проблемы

1. **Вебхуки не доходят**
   - Проверьте URL эндпоинта
   - Убедитесь в корректности Webhook Secret
   - Проверьте логи Stripe Dashboard

2. **Платежи отклоняются**
   - Проверьте настройки Radar (антифрод)
   - Убедитесь в корректности настройки 3D Secure
   - Проверьте лимиты аккаунта

3. **Подписка не активируется**
   - Проверьте обработку webhook `customer.subscription.created`
   - Убедитесь в корректности маппинга planId
   - Проверьте статус подписки в Stripe

### Логирование

```javascript
// utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'subscription-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'subscription-combined.log' })
  ]
});

// Логирование событий подписки
function logSubscriptionEvent(event, data) {
  logger.info('Subscription event', {
    event,
    data,
    timestamp: new Date().toISOString()
  });
}
```

## 📞 Поддержка

### Контакты

- **Техническая поддержка**: dev@craftruv.com
- **Billing вопросы**: billing@craftruv.com
- **Документация**: [subscription-docs.craftruv.com]

### Полезные ссылки

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Subscription Lifecycle](https://stripe.com/docs/billing/subscriptions/lifecycle)
- [Testing Stripe](https://stripe.com/docs/testing)

---

## ✅ Чек-лист запуска

- [ ] Stripe аккаунт настроен и верифицирован
- [ ] Продукты и цены созданы в Stripe
- [ ] Вебхуки настроены и тестируются
- [ ] База данных развернута и мигрирована
- [ ] API endpoints реализованы и протестированы
- [ ] Frontend интеграция завершена
- [ ] Юридические документы подготовлены
- [ ] Мониторинг и алерты настроены
- [ ] Процедуры бэкапа налажены
- [ ] Команда обучена работе с системой

**Система подписок готова к запуску! 🚀**