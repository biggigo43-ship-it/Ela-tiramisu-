# Ela Tiramisu — جاهز للنشر

## الواجهات
- `customer/index.html?client=NAME` واجهة الزبون.
- `admin/index.html` لوحة الإدارة.

## الخادم
داخل `server`:
```bash
npm install
npm start
```
ثم ضع عنوان الخادم في localStorage باسم `ELA_API_URL` (مثل https://api.example.com).

## مهم
هذا الإصدار يستخدم ذاكرة الخادم لتخزين الطلبات، لذلك هو مناسب للتجربة. للإنتاج يجب استبدالها بقاعدة بيانات دائمة (PostgreSQL/Supabase/Firebase مثلًا) وإضافة تسجيل دخول للوحة الإدارة، وحماية HTTPS، وربط رابط العميل الفريد بقاعدة بيانات العملاء.
