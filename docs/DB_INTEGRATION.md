# 🔌 ربط Next.js بقاعدة البيانات (Prisma + PostgreSQL)

تم ربط التطبيق فعلياً بقاعدة البيانات عبر **Prisma ORM**، مع **تراجع آمن** إلى بيانات الديمو عند غياب `DATABASE_URL` — فيبقى المشروع يعمل في كل الحالات.

## المكوّنات
| الملف | الدور |
|---|---|
| `prisma/schema.prisma` | نموذج البيانات (Organization, User, Role, Project, Investment, Wallet, ...) |
| `prisma/migrations/0001_init/` | أول Migration (مولّدة من المخطط) |
| `prisma/seed.js` | بيانات أولية (مؤسسة، أدوار، مشروع) |
| `lib/prisma.js` | Prisma Client (Singleton، آمن وقت البناء) |
| `lib/db.js` | طبقة وصول: Prisma عند توفّر القاعدة، وإلا بيانات الديمو |
| `app/api/*` | مسارات API تستخدم `lib/db.js` وتعيد `source: database \| demo` |

## التشغيل مع قاعدة بيانات حقيقية
```bash
cp .env.example .env            # ثم عدّل DATABASE_URL
npm install                     # يولّد Prisma Client تلقائياً (postinstall)
npm run db:migrate              # تطبيق الـ migrations (prisma migrate deploy)
npm run db:seed                 # بيانات أولية (اختياري)
npm run dev
```
بدون `DATABASE_URL` يعمل التطبيق مباشرة على بيانات الديمو.

## سكربتات npm
- `db:generate` — توليد Prisma Client.
- `db:migrate` / `db:migrate:dev` — تطبيق/إنشاء Migrations.
- `db:seed` — تعبئة بيانات أولية.
- `db:studio` — واجهة Prisma Studio.

## بدائل أدوات الـ Migration
- **Prisma** (المعتمد هنا): تكامل مثالي مع Next.js/TypeScript.
- **Drizzle**: بديل خفيف type-safe — يمكن توليد المخطط من نفس جداول `db/01_schema.sql`.
- **Flyway**: مناسب للفرق التي تفضّل SQL خام — استخدم ملفات `db/*.sql` كـ `V1__init.sql`, `V2__indexes.sql`, ...

## العلاقة بـ `db/*.sql`
ملفات `db/*.sql` هي المصدر المرجعي الكامل (40+ جدولاً، RLS، Triggers). مخطط Prisma يغطي النواة التشغيلية للتطبيق ويتوسّع تدريجياً ليطابق التصميم الكامل.
