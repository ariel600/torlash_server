# server — NestJS + MongoDB

- **התקנה:** בשורש: `npm run install:all` (או `npm install` בתוך `server/`)
- **Env:** צור `server/.env` מ־`.env.example` והפעל MongoDB מקומי (`MONGODB_URI`).
- **פיתוח:** `npm run dev:server` (מהשורש) או `cd server && npm run start:dev`
- **Build:** `npm run build:server` או `cd server && npm run build`
- **Students API:** `GET/POST` ו־`PATCH/DELETE` על `/entities/Student` — ראו `src/students/`

## אבטחה (אל תסיר בטעות)

המערכת משתמשת ב־**Rate limiting** (מגבלת בקשות לפי IP, ‎`ThrottlerModule` / ‎`ThrottlerGuard`), ‎**Helmet** (כותרות HTTP מקשחות, ב־`main.ts`) ו־**Sanitization** של גוף בקשות/שאילתות מול NoSQL (Interceptor + שירותי Mongo; ראו ‎`common/security`, ‎`common/interceptors`). הסרה או עקיפה של אלה פותחת פירצות (הצפה, NoSQL-injection, כותרות חלשות). בפרוד מומלץ גם לבדוק ‎`npm audit` ו־CSP/פרונט.
