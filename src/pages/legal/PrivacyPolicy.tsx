import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, Lock, Database } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-2">
              <Shield className="h-8 w-8 text-blue-600" />
              Политика конфиденциальности
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Действует с 1 января 2024 года • Соответствует GDPR
            </p>
          </CardHeader>
          
          <CardContent className="space-y-8 text-sm leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" />
                1. Общие положения
              </h2>
              <div className="space-y-4">
                <p>
                  1.1. Настоящая Политика конфиденциальности описывает, как мы собираем, используем, 
                  храним и защищаем ваши персональные данные при использовании платформы CraftRuv Web.
                </p>
                <p>
                  1.2. Мы серьезно относимся к защите ваших персональных данных и соблюдаем требования 
                  Общего регламента по защите данных (GDPR) и других применимых законов о защите данных.
                </p>
                <p>
                  1.3. Используя наш Сервис, вы соглашаетесь с условиями данной Политики конфиденциальности.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                2. Какие данные мы собираем
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">2.1. Данные, предоставляемые вами</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Регистрационные данные:</strong> имя, email, пароль</li>
                    <li><strong>Профильная информация:</strong> фото профиля, описание, настройки</li>
                    <li><strong>Платежная информация:</strong> данные для выставления счетов (обрабатываются через Stripe)</li>
                    <li><strong>Контент:</strong> ваши дизайн-проекты, изображения, комментарии</li>
                    <li><strong>Обратная связь:</strong> сообщения в поддержку, отзывы, предложения</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">2.2. Автоматически собираемые данные</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Технические данные:</strong> IP-адрес, тип устройства, браузер, операционная система</li>
                    <li><strong>Данные использования:</strong> страницы, которые вы посещаете, время использования, действия в интерфейсе</li>
                    <li><strong>Файлы cookie:</strong> предпочтения, настройки, данные сессии</li>
                    <li><strong>Аналитические данные:</strong> статистика использования функций</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">2.3. Данные от третьих лиц</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Социальные сети:</strong> при входе через Google, Facebook (только с вашего разрешения)</li>
                    <li><strong>Платежные системы:</strong> информация о транзакциях от Stripe, PayPal</li>
                    <li><strong>Аналитические сервисы:</strong> данные от Google Analytics (анонимизированные)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">3. Как мы используем ваши данные</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-3">3.1. Основные цели</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Предоставление и улучшение наших услуг</li>
                    <li>Обработка ваших платежей и управление подпиской</li>
                    <li>Персонализация пользовательского опыта</li>
                    <li>Техническая поддержка и обслуживание клиентов</li>
                    <li>Уведомления о важных изменениях в сервисе</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">3.2. Маркетинг (только с согласия)</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Информирование о новых функциях и обновлениях</li>
                    <li>Специальные предложения и скидки</li>
                    <li>Образовательный контент и советы по дизайну</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">3.3. Аналитика и улучшения</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Анализ использования функций для их улучшения</li>
                    <li>Выявление и устранение технических проблем</li>
                    <li>Исследования пользовательского опыта</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">4. Правовые основания обработки (GDPR)</h2>
              <div className="space-y-3">
                <p><strong>Исполнение договора:</strong> для предоставления услуг по подписке</p>
                <p><strong>Согласие:</strong> для маркетинговых коммуникаций и аналитики</p>
                <p><strong>Законные интересы:</strong> для улучшения сервиса и предотвращения мошенничества</p>
                <p><strong>Юридические обязательства:</strong> для соблюдения налогового законодательства</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Lock className="h-5 w-5 text-blue-600" />
                5. Как мы защищаем ваши данные
              </h2>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="text-lg font-medium mb-3 text-green-800">Технические меры безопасности</h3>
                  <ul className="list-disc pl-6 space-y-1 text-green-700">
                    <li>Шифрование данных при передаче (TLS/SSL)</li>
                    <li>Шифрование чувствительных данных при хранении</li>
                    <li>Регулярные резервные копии</li>
                    <li>Мониторинг безопасности 24/7</li>
                    <li>Двухфакторная аутентификация для администраторов</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-medium mb-3 text-blue-800">Организационные меры</h3>
                  <ul className="list-disc pl-6 space-y-1 text-blue-700">
                    <li>Доступ к данным только для уполномоченного персонала</li>
                    <li>Регулярное обучение сотрудников по безопасности</li>
                    <li>Соглашения о конфиденциальности с третьими лицами</li>
                    <li>Регулярные аудиты безопасности</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">6. Передача данных третьим лицам</h2>
              <div className="space-y-4">
                <p>
                  Мы не продаем и не передаем ваши персональные данные третьим лицам для их 
                  маркетинговых целей. Мы можем передавать данные только:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Поставщикам услуг:</strong> Stripe (платежи), AWS (хостинг), SendGrid (email)</li>
                  <li><strong>По закону:</strong> при наличии судебного предписания или требования регулятора</li>
                  <li><strong>При продаже бизнеса:</strong> новому владельцу (с уведомлением пользователей)</li>
                  <li><strong>С вашего согласия:</strong> в других случаях только с вашего явного согласия</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">7. Ваши права (GDPR)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">🔍 Право на доступ</h3>
                  <p className="text-sm">Получить копию ваших данных</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">✏️ Право на исправление</h3>
                  <p className="text-sm">Исправить неточные данные</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">🗑️ Право на удаление</h3>
                  <p className="text-sm">Удалить ваши данные</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">⏸️ Право на ограничение</h3>
                  <p className="text-sm">Ограничить обработку</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">📦 Право на портируемость</h3>
                  <p className="text-sm">Перенести данные в другой сервис</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">❌ Право на возражение</h3>
                  <p className="text-sm">Возражать против обработки</p>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-800">
                  <strong>Как воспользоваться правами:</strong> Напишите нам на 
                  <a href="mailto:privacy@craftruv.com" className="underline ml-1">privacy@craftruv.com</a> 
                  или используйте настройки в личном кабинете.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">8. Файлы cookie</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-3">Типы cookie, которые мы используем:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 border rounded">
                      <h4 className="font-medium text-green-600">Необходимые</h4>
                      <p className="text-sm">Аутентификация, безопасность</p>
                    </div>
                    <div className="p-3 border rounded">
                      <h4 className="font-medium text-blue-600">Функциональные</h4>
                      <p className="text-sm">Настройки, предпочтения</p>
                    </div>
                    <div className="p-3 border rounded">
                      <h4 className="font-medium text-purple-600">Аналитические</h4>
                      <p className="text-sm">Google Analytics (анонимно)</p>
                    </div>
                    <div className="p-3 border rounded">
                      <h4 className="font-medium text-orange-600">Маркетинговые</h4>
                      <p className="text-sm">Реклама (только с согласия)</p>
                    </div>
                  </div>
                </div>
                <p>
                  Вы можете управлять cookie в настройках браузера или в нашем центре управления cookie.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">9. Хранение данных</h2>
              <div className="space-y-4">
                <p>
                  <strong>Данные аккаунта:</strong> До удаления аккаунта + 30 дней для возможности восстановления
                </p>
                <p>
                  <strong>Платежные данные:</strong> 7 лет (требования налогового законодательства)
                </p>
                <p>
                  <strong>Контент проектов:</strong> До удаления вами или аккаунта
                </p>
                <p>
                  <strong>Логи безопасности:</strong> 2 года для расследования инцидентов
                </p>
                <p>
                  <strong>Аналитические данные:</strong> 26 месяцев (анонимизированные)
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">10. Международные передачи</h2>
              <div className="space-y-4">
                <p>
                  Ваши данные могут обрабатываться в других странах (США, ЕС) нашими поставщиками услуг. 
                  Мы обеспечиваем adequate level of protection через:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Standard Contractual Clauses (SCC)</li>
                  <li>Privacy Shield сертификацию (где применимо)</li>
                  <li>Adequacy decisions Европейской комиссии</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">11. Дети и конфиденциальность</h2>
              <div className="space-y-4">
                <p>
                  Наш сервис не предназначен для детей младше 16 лет. Мы сознательно не собираем 
                  персональные данные детей младше 16 лет. Если вы узнали, что ребенок предоставил 
                  нам персональные данные, пожалуйста, свяжитесь с нами.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">12. Изменения в политике</h2>
              <div className="space-y-4">
                <p>
                  Мы можем обновлять эту Политику конфиденциальности. О существенных изменениях 
                  мы уведомим вас по email или через уведомление в сервисе за 30 дней до вступления 
                  изменений в силу.
                </p>
              </div>
            </section>

            <section className="border-t pt-8">
              <h2 className="text-xl font-semibold mb-4">Контакты по вопросам конфиденциальности</h2>
              <div className="space-y-2">
                <p><strong>Email:</strong> <a href="mailto:privacy@craftruv.com" className="text-blue-600 underline">privacy@craftruv.com</a></p>
                <p><strong>Почтовый адрес:</strong> [Указать адрес для GDPR запросов]</p>
                <p><strong>Контролирующий орган:</strong> [Указать соответствующий DPA]</p>
                <p><strong>Время ответа:</strong> В течение 30 дней (GDPR требование)</p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}