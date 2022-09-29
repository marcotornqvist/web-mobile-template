# **Web & Mobile Template**

- Client: NextJS
- Serevr: NestJS
- Mobile: React Native

<br>

### **Prisma Studio**

<br>

**Follow steps below to get Prisma Studio to do introspection.**

1. Run migration in Docker _server_ shell terminal:

```bash
npx prisma migrate dev --name {add/change/delete}-{title}-{row/table}
```

2. Restart Prisma Studio Docker Container

**Seed the database**

```bash
npx prisma db seed
```
