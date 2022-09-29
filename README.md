# **Web & Mobile Template**

- Client: NextJS
- Serevr: NestJS
- Mobile: React Native

TODO: https://www.tomray.dev/nestjs-caching-redis

<br>

### **Prisma Studio**

<br>

**Prisma Migration and Prisma Studio introspection.**

1. Run migration in Docker _server_ shell terminal:

```bash
npx prisma migrate dev --name {add/change/delete}-{title}-{row/table}
```

2. Restart Prisma Studio Docker Container

3. Run regeneration of Prisma Client in the _server_ directory

```bash
npx prisma generate
```

**Seed the database**

```bash
npx prisma db seed
```
