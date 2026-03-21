// นำเข้า dotenv เพื่อให้มันอ่านไฟล์ .env ก่อน
import 'dotenv/config' 
import { defineConfig } from '@prisma/config'

// (ใส่ console.log ไว้เช็คด้วยว่ามันดึงค่ามาได้จริงไหม)
console.log("🔍 Checking DATABASE_URL:", process.env.DATABASE_URL)

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