# Konfigurasi Fortify (config/fortify.php)

Setelah `php artisan vendor:publish --provider="Laravel\Fortify\FortifyServiceProvider"`,
edit bagian `features` di `config/fortify.php` jadi **hanya** mengaktifkan 2FA:

```php
'features' => [
    Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]),
],
```

**Jangan** aktifkan `Features::registration()`, `Features::resetPasswords()`, `Features::updateProfileInformation()`,
dsb di sini — semua itu SUDAH ditangani oleh Breeze. Mengaktifkannya di Fortify hanya akan bikin rute dobel/bentrok.

Daftarkan provider di `bootstrap/providers.php` (Laravel 12):

```php
return [
    App\Providers\AppServiceProvider::class,
    App\Providers\FortifyServiceProvider::class, // tambahkan baris ini
];
```

Terakhir, tambahkan komponen toggle 2FA di halaman `resources/js/Pages/Profile/Edit.jsx`
(Breeze biasanya sudah menyediakan slot untuk ini kalau kamu pilih opsi 2FA saat `breeze:install`).
Kalau belum, bisa ditambahkan manual — beri tahu saya kalau mau saya buatkan komponennya.
