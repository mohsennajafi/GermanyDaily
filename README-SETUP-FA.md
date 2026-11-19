# راه‌اندازی German Daily 2.0

این نسخه ظاهر و منطق آموزشی فعلی را حفظ می‌کند و قابلیت نصب PWA، پنجره ورود، ورود ایمیلی/گوگل و پشتیبان‌گیری ابری اختیاری را اضافه می‌کند. بدون پیکربندی Supabase، برنامه همچنان در حالت مهمان و ذخیره‌سازی محلی کار می‌کند.

## ۱) انتشار روی GitHub Pages

تمام فایل‌ها و پوشه‌ها را در ریشه مخزن `Germany-Daily` قرار دهید و Commit کنید. مسیر فعلی پروژه حفظ شده است:

`https://mohsennajafi.github.io/Germany-Daily/`

## ۲) فعال‌سازی Supabase

1. در https://supabase.com یک پروژه بسازید.
2. از Project Settings → API، مقدار Project URL و کلید `anon` یا `publishable` را بردارید.
3. فایل `js/supabase-config.js` را باز کنید و فقط این دو مقدار عمومی را جایگزین کنید:
   - `https://YOUR-PROJECT.supabase.co`
   - `YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY`
4. فایل `supabase-schema.sql` را در SQL Editor پروژه Supabase اجرا کنید.
5. در Authentication → URL Configuration، آدرس زیر را به Site URL و Redirect URLs اضافه کنید:
   `https://mohsennajafi.github.io/Germany-Daily/`
6. در Authentication → Providers، Email را فعال کنید.
7. برای Google، Provider گوگل را فعال و Client ID/Secret را طبق راهنمای Supabase وارد کنید. در Google Cloud Console نیز callback URL نمایش‌داده‌شده توسط Supabase را ثبت کنید.

**مهم:** کلید `service_role` را هرگز در فایل‌های این مخزن قرار ندهید. کلید anon/publishable برای مرورگر طراحی شده و امنیت داده با RLS اعمال می‌شود.

## ۳) رفتار همگام‌سازی

- کاربر مهمان: برنامه فقط روی همان دستگاه کار می‌کند.
- کاربر واردشده: تنظیمات، پیشرفت یادگیری (از جمله known و Leitner) و واژه‌های شخصی در جدول `user_data` ذخیره می‌شود.
- داده‌های محلی حذف نمی‌شوند. هنگام ورود، داده‌های یادگیری ادغام و ترجیحات ساده از نسخه ابری دریافت می‌شوند.
- در حالت آفلاین، استفاده محلی ادامه دارد؛ همگام‌سازی پس از اتصال دوباره انجام می‌شود.

## ۴) نصب PWA

- Android/Chrome: دکمه «نصب برنامه» پس از اعلام قابلیت نصب مرورگر ظاهر می‌شود.
- iPhone/iPad: سایت را در Safari باز کنید، Share → Add to Home Screen را انتخاب کنید.
- برای نصب‌پذیری و Service Worker، سایت باید از HTTPS ارائه شود؛ GitHub Pages این شرط را دارد.

## ۵) محدوده این نسخه

این نسخه شامل ورود و پشتیبان‌گیری ابری است؛ هنوز شامل پرداخت، اشتراک پولی، لایسنس، پنل مدیریت یا AI Gateway نیست. این بخش‌ها باید در مرحله بعد با Edge Functions و تأیید پرداخت سمت سرور ساخته شوند. حالت AI فعلی با کلید شخصی کاربر بدون تغییر باقی مانده است.

## فایل‌های افزوده/تغییریافته

- `index.html`: دکمه نصب، پنجره حساب و بارگذاری ماژول‌های جدید
- `manifest.json`: آیکون‌های PNG و scope/start URL
- `sw.js`: نسخه جدید کش و عدم رهگیری درخواست‌های سرویس‌های ثالث
- `icons/`: آیکون‌های 192، 512 و Apple Touch
- `js/supabase-config.js`: محل تنظیم URL و کلید عمومی Supabase
- `js/auth-sync.js`: ورود، ثبت‌نام، گوگل و همگام‌سازی ابری
- `js/pwa-install.js`: نصب اندروید و راهنمای iOS
- `supabase-schema.sql`: جدول و سیاست‌های RLS
