# TON Spin Mini App (TypeScript)

Телеграм-бот + mini app с вертикальной рулеткой, где:

- **ставка = 1 TON**
- **рандом 50/50 только на сервере**
- **клиент получает готовый результат и только красиво проигрывает анимацию**
- архитектура разнесена по приложениям и фичам, чтобы проект можно было спокойно расширять

## Стек

- **Bot:** grammy + TypeScript
- **Server API:** Express + TypeScript
- **Mini App:** React + Vite + TypeScript
- **Storage:** in-memory store (для MVP), но вынесен отдельно и легко заменяется на БД

## Структура

```text
apps/
  bot/
    src/
      config/
      features/
      keyboards/
      index.ts
  server/
    src/
      config/
      middleware/
      modules/
        session/
        spin/
        user/
      routes/
      app.ts
      index.ts
  miniapp/
    index.html
    src/
      api/
      components/
      features/spin/
      lib/
      styles/
shared/
  prize-catalog.ts
  reel.ts
```

## Как работает спин

1. Миниапп жмет `Крутить за 1 TON`
2. Клиент отправляет `POST /api/spin`
3. **Сервер**:
   - валидирует Telegram init data или пускает dev-пользователя
   - выбирает **win/lose bucket строго 50/50**
   - внутри выбранного bucket'а выбирает конкретный приз по весам
   - находит подходящую плитку на виртуальной ленте
   - сохраняет баланс
4. Клиент получает:
   - `prizeAmount`
   - `outcome`
   - `targetVirtualIndex`
   - `newBalance`
5. Клиент **не генерирует случайный результат**, а только анимирует прокрутку до уже выбранной сервером плитки

## Быстрый старт

```bash
npm install
cp .env.example .env
npm run dev
```

Поднимется:

- server: `http://localhost:3000`
- mini app: `http://localhost:5173`
- bot: polling mode

## Что настроить

### 1. BotFather
Создай бота и вставь токен в `.env`

### 2. MINI_APP_URL
Для продакшена укажи публичный URL миниаппа.  
Например, если сервер раздает собранный фронт:

```env
MINI_APP_URL=https://your-domain.com
```

### 3. Dev auth
Для локальной разработки:

```env
ALLOW_DEV_AUTH=true
```

Тогда API будет использовать тестового пользователя, если mini app открыт не внутри Telegram.

## Продакшен-сборка

```bash
npm run build
```

## Где менять механику

### Стоимость спина
`shared/reel.ts`

### Каталог призов / веса / цвета плиток
`shared/prize-catalog.ts`

### Логика RNG
`apps/server/src/modules/spin/spin.service.ts`

### Анимация ленты
`apps/miniapp/src/features/spin/components/SpinMachine.tsx`
`apps/miniapp/src/styles/global.css`

## Как расширять

Самые логичные следующие шаги:

- заменить `InMemoryUserStore` на PostgreSQL / Redis
- добавить историю спинов
- добавить топ игроков
- добавить разные режимы барабана
- подключить TON Connect / кошелек
- добавить серверные подписи результата и аудит

## Важно

Сейчас проект сделан как **качественный MVP-скелет**, а не мусорный одностраничник:
- TypeScript везде
- код разложен по зонам ответственности
- сервер и клиент разделены
- UI уже анимирован и выглядит как миниапп, а не сырой прототип
