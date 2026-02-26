## Tarot project (Frontend + Backend)

Проект: SPA (React) + Backend (Spring Boot). Реализованы регистрация/авторизация, роли (USER/ADMIN), CRUD сущности в БД, логирование, централизованная обработка ошибок, Docker.

## Запуск без Docker (локально)

### Backend

```bash
cd "backend"
chmod +x start.sh
./start.sh
```

Проверка: `http://localhost:8080/api/tarot-cards`

H2 Console: `http://localhost:8080/h2-console`  
JDBC URL: `jdbc:h2:file:./data/tarot-db`, user `sa`, пароль пустой.

### Frontend

```bash
cd "frontend"
npm install
npm start
```

Открыть: `http://localhost:3000`

## Запуск через Docker

```bash
docker compose build
docker compose up
```

Frontend: `http://localhost:3000`  
Backend: `http://localhost:8080`


