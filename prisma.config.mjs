// นำเข้า dotenv เพื่อให้มันอ่านไฟล์ .env ก่อน
import 'dotenv/config' 
import { defineConfig } from '@prisma/config'



export default defineConfig({
    migrations: {
        seed: 'node ./prisma/seed.js',
      },
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrate: {
    url: process.env.DATABASE_URL,
  },
})