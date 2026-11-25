# راه‌اندازی German Daily 2.0

این نسخه ظاهر و منطق آموزشی فعلی را حفظ می‌کند و قابلیت نصب PWA، پنجره ورود، ورود ایمیلی/گوگل و پشتیبان‌گیری ابری اختیاری را اضافه می‌کند. بدون پیکربندی Supabase، برنامه همچنان در حالت مهمان و ذخیره‌سازی محلی کار می‌کند.

## صفحه معرفی و نصب

فایل `install.html` صفحه معرفی حرفه‌ای German Daily است و راهنمای نصب روی اندروید، آیفون/آیپد و کامپیوتر را نمایش می‌دهد. پس از انتشار در GitHub Pages از نشانی زیر در دسترس است:

`https://mohsennajafi.github.io/Germany-Daily/install.html`

صفحه اصلی اپلیکیشن همچنان `index.html` است و ظاهر و عملکرد آن تغییر نکرده است.

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

## تغییرات نسخه‌ی اخیر

- **گرامر A1:** چهار درس تازه‌ی «الفبای آلمانی»، «شمارش اعداد»، «ساعت و زمان» و «تاریخ، روزهای هفته و ماه‌ها» (A1-11 تا A1-14).
- **گرامر B2:** ۱۶ درس تازه (B2-01 تا B2-16) و نمایش سطح B2 در تب گرامر.
- **واژگان:** ۵۰۰ واژه‌ی مناسب سطح B2 به `words.min.json` و `words.csv` افزوده شد (مجموع ۲۱۴۶ واژه).
- **مشخصات توسعه‌دهنده:** شماره‌ی تماس به شکل `00989177662400` در تنظیمات برنامه و `install.html`.
- کش مرورگر (`gd_words_v7`، `gd_gram_v4`) و Service Worker (`gd-shell-v10`) به‌روز شد تا کاربران داده‌ی تازه را بگیرند.

## به‌روزرسانی: ۲۰۰ واژه‌ی محاوره‌ای/روزمره و سطح‌بندی A1 تا B2

- **۲۰۰ واژه‌ی تازه** در دسته‌های `Begrüßung` (سلام و احوال‌پرسی)، `Umgangssprache` (محاوره‌ای)، `Alltag` (روزمره)، `Vergleich` (مقایسه‌ای و متضادها) و `Mann und Frau` (مرد و زن، خویشاوندی، وضعیت تأهل). مجموع واژگان: ۲۳۴۶.
- **سطح‌بندی:** هر واژه فیلد `lv` (در CSV ستون `level`) با مقدار A1، A2، B1 یا B2 دارد و روی کارت واژه نمایش داده می‌شود.
- **تنظیمات ← «سطح (A1 تا B2)»:** واژه‌های روزانه را بر اساس سطح انتخاب‌شده فیلتر می‌کند و با فیلتر «فصل» هم‌زمان کار می‌کند.
- سطح ۵۰۰ واژه‌ی B2 و ۲۰۰ واژه‌ی تازه را مستقیم تعیین کرده‌ام؛ سطح ۱۶۴۶ واژه‌ی قدیمی با فهرست واژگان پایه‌ی A1/A2 تطبیق داده شده و بقیه B1 ثبت شده‌اند، پس برای بعضی واژه‌ها ممکن است دقیق نباشد و می‌توان مقدار `lv` را در `words.min.json` اصلاح کرد.
- کش مرورگر (`gd_words_v8`) و Service Worker (`gd-shell-v11`) به‌روز شد.

## به‌روزرسانی: ظاهر دکمه‌های بالا، دسته‌بندی و ۲۰۰ واژه/اصطلاح

- **دکمه‌های بالای برنامه:** نوار تب‌ها حالا آیکن گرافیکی رنگی، حالت فعال با گرادیان و درخشش، پیمایش خودکار به تب فعال و ظاهر نرم‌تر دارد؛ هدر و دکمه‌های «ورود» و «نصب» هم گرد و گرادیانی شدند.
- **دسته‌ها:** در تنظیمات هر دسته با ایموجی، نام فارسی و تعداد واژه نمایش داده می‌شود (مثلاً «🎯 Redewendungen · اصطلاحات (107)») و روی کارت واژه هم همین برچسب دیده می‌شود.
- **۲۰۰ مورد تازه:** ۱۰۷ اصطلاح در دسته‌ی جدید `Redewendungen` (با معنی فارسی، معنی تحت‌اللفظی و مثال) و ۹۳ واژه در دسته‌های کم‌واژه مثل Kultur، Medien، Technik، Umwelt، Politik. مجموع واژگان: ۲۵۴۶.
- کش مرورگر (`gd_words_v9`) و Service Worker (`gd-shell-v12`) به‌روز شد.

## به‌روزرسانی: ۳۰۰ واژه و فعل پرکاربرد

- **دسته‌های تازه:** `Obst` (میوه و آجیل، ۳۴)، `Gemüse` (سبزیجات و سبزی‌خوردن، ۳۶)، `Gewürze` (ادویه و چاشنی، ۳۳)، `Verben` (افعال پرکاربرد، ۱۱۱) و `Nützliches` (کاربردی و پرمصرف، ۸۵).
- شامل `die Urlaubsgrüße`، `reifen`، `der Wahnsinn`، `darüber` و قیدهای پرکاربرد مثل `dabei`، `dafür`، `danach`، `überhaupt`، `sowieso`.
- هر مورد IPA، ترجمه، مثال، شکل جمع (برای اسم‌ها) و سطح A1 تا B2 دارد. مجموع واژگان: ۲۸۴۶.
- کش مرورگر (`gd_words_v10`) و Service Worker (`gd-shell-v13`) به‌روز شد.

## به‌روزرسانی: ۱۰۰ فعل پرکاربرد با صرف کامل

- ۱۰۰ فعل تازه (مثل `heißen`، `wohnen`، `anrufen`، `einkaufen`، `gefallen`، `studieren`، `sich vorstellen`، `aufmachen`، `fernsehen`) در دسته‌ی `Verben` اضافه شد؛ مجموع واژگان ۲۹۴۶.
- هر فعل در تب «افعال» دیده می‌شود و صرف کامل دارد: حال، گذشته‌ی ساده، ماضی نقلی، ماضی بعید و آینده، با ترجمه‌ی فارسی هر زمان و شش ضمیر (فعل‌های جداشدنی و بازتابی هم درست صرف می‌شوند).
- جدول‌های صرف را با قاعده تولید و روی چند فعل بی‌قاعده کنترل کرده‌ام، پس بهتر است یک بار مرورشان کنید.
- کش مرورگر (`gd_words_v11`) و Service Worker (`gd-shell-v14`) به‌روز شد.

## به‌روزرسانی: بازنگری مثال‌ها + تکمیل صرف افعال کلیدی (نسخه v12)

- **بهبود مثال‌ها** برای افعال: heißen، gefallen، vorhaben، stattfinden، durchfallen، sich verspäten (مثال‌های طبیعی‌تر و کاربردی‌تر برای زندگی روزمره و مهاجرت).
- **تکمیل صرف کامل** برای افعال مهم که قبلاً جدول کامل نداشتند: warten، bringen، holen، erinnern.
- **اضافه شدن** فعل lassen با صرف کامل به دستهٔ Verben.
- مجموع واژگان: ۲۹۴۷.
- کش مرورگر (`gd_words_v12`) و Service Worker (`gd-shell-v15`) به‌روز شد.

## به‌روزرسانی: حدود ۹۰ لغت جدید (ربطی + امتحان + اقامت) – v13

- **حروف ربط و اتصالات مهم**: obwohl, sodass, nachdem, bevor, sobald, solange, seitdem, weshalb, weswegen, daher, zudem, ferner, stattdessen, ansonsten, sofern, insofern, indem, wobei, wodurch, folglich, demzufolge, gleichwohl, nichtsdestotrotz, soweit, vorausgesetzt, angenommen, gesetzt den Fall, wohingegen, zumal, indessen, unterdessen, derweil و ...
- **افعال و عبارات امتحان**: bestehen (die Prüfung bestehen), ablegen, durchfallen, nachholen, bestehen aus / in
- **اقامت و اداری**: Aufenthaltserlaubnis, Niederlassungserlaubnis, Arbeitserlaubnis, Bürgeramt, Ausländeramt, Meldebescheinigung, Anmeldebestätigung, bewilligen, genehmigen
- **قیدهای زمانی و مفید**: demnächst, in Kürze, längst, fortan, künftig, binnen, innerhalb, außerhalb, sogleich, unverzüglich, umgehend و ...
- مجموع واژگان: **۳۰۳۸**
- کش: `gd_words_v13` | Service Worker: `gd-shell-v16`

## به‌روزرسانی: واژگان و جملات حوزه کامپیوتر و فناوری – v15

- **سخت‌افزار**: Bildschirm, Tastatur, Maus, Drucker, Scanner, USB-Stick, Festplatte, Speicher, Prozessor, Arbeitsspeicher, Grafikkarte, Netzteil, Ladekabel, Akku, aufladen
- **نرم‌افزار و سیستم‌عامل**: Betriebssystem, Windows, Linux, installieren, deinstallieren, aktualisieren, Update, Version, Benutzeroberfläche, Passwort, Kennwort, Benutzername, anmelden/abmelden
- **فایل و داده**: Datei, Ordner, speichern, löschen, kopieren, einfügen, ausschneiden, hochladen, herunterladen, Cloud, Sicherung, wiederherstellen
- **اینترنت**: WLAN, WLAN-Passwort, online/offline, Website, Link, klicken, Suchmaschine, Browser, Tab, Startseite, Spam
- **برنامه‌نویسی**: programmieren, Code, Fehler, debuggen, Programmiersprache, Entwicklung, Entwickler, Framework, API, testen, Bug, beheben
- **امنیت و مدرن**: Sicherheit, Firewall, Virus, Antivirensoftware, verschlüsseln, KI, Machine Learning, Datenbank, Server, Domain, IP-Adresse
- **جملات کاربردی**: Mein Computer stürzt ab. / Die Internetverbindung ist langsam. / Ich habe mein Passwort vergessen. / Bitte speichere die Datei. / Die Software muss aktualisiert werden. / Ich arbeite remote. و ...
- مجموع واژگان: **۳۲۷۶**
- کش: `gd_words_v15` | Service Worker: `gd-shell-v18`

## به‌روزرسانی: افعال و جملات بیشتر کامپیوتر و دورکاری – v16

- **افعال عملی**: starten, neu starten, trennen, synchronisieren, drucken, scannen, formatieren, komprimieren, entpacken, umbenennen, minimieren, maximieren, scrollen, zoomen
- **دورکاری و همکاری**: remote arbeiten, Homeoffice, Videokonferenz, Meeting, Bildschirm teilen, stummschalten, Kamera ein-/ausschalten, Chat, tippen
- **جملات کاربردی جدید**: Der Computer reagiert nicht. / Ich muss den Cache leeren. / Die Seite lädt nicht. / Kannst du den Bildschirm teilen? / Mein Mikrofon funktioniert nicht. / Ich habe den Fehler behoben. / Welche Programmiersprache lernst du? / Ich bin Entwickler. و ...
- مجموع واژگان: **۳۳۱۵**
- کش: `gd_words_v16` | Service Worker: `gd-shell-v19`
