# **Web & Mobile Template**

- Client: NextJS
- Serevr: NestJS
- Mobile: React Native

TODO: https://www.tomray.dev/nestjs-caching-redis

<br>

### **Environment Variables**

cd into ./server folder and copy environment variables from .env.example to .env file:

```bash
cd ./server && cp .env.example .env
```

Add values to empty environment variables in the ./server/.env file:

```bash
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
```

<br>

### **Docker**

To build and run the application with Docker run the command below in the root folder.

```bash
docker-compose up --build
```

Once the application is built, run the command below in the root folder without the --build flag to start the application.

```bash
docker-compose up
```

<br>

### **Migrations & Prisma Studio**

Prisma Migration and Prisma Studio introspection with Docker.

1. Run migration in Docker _server_ shell terminal:

```bash
npx prisma migrate dev --name {add/change/delete}-{title}-{row/table}
```

2. Restart `prisma-studio` Docker container by running the command below in the root folder:

```bash
docker-compose restart prisma-studio
```

3. Run regeneration of Prisma Client in the _server_ directory

```bash
npx prisma generate
```

**Seed the database**

```bash
npx prisma db seed
```
