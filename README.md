# Setup Project

create .env file

```
DATABASE_URL="mysql://root:@localhost:3306/hris001"
```

```shell
npm install
npx prisma migrate dev
npx prisma generate
npm run build
npm run start
```
