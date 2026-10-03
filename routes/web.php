<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Kurir\DashboardController as KurirDashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Customer\HomeController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Halaman Publik (Customer, bisa diakses tanpa login)
|--------------------------------------------------------------------------
*/
Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/katalog', [\App\Http\Controllers\Customer\CatalogController::class, 'index'])->name('catalog.index');
Route::get('/produk/{product:slug}', [\App\Http\Controllers\Customer\ProductController::class, 'show'])->name('product.show');
Route::get('/tentang-kami', fn () => Inertia::render('Customer/Static/About'))->name('about');
Route::get('/kontak', fn () => Inertia::render('Customer/Static/Contact'))->name('contact');
Route::post('/kontak', [\App\Http\Controllers\Customer\ContactController::class, 'store'])->name('contact.store');
Route::get('/faq', [\App\Http\Controllers\Customer\FaqController::class, 'index'])->name('faq');
Route::get('/blog', [\App\Http\Controllers\Customer\BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{blogPost:slug}', [\App\Http\Controllers\Customer\BlogController::class, 'show'])->name('blog.show');
Route::get('/promo', [\App\Http\Controllers\Customer\PromoController::class, 'index'])->name('promo.index');
Route::get('/syarat-ketentuan', fn () => Inertia::render('Customer/Static/Terms'))->name('terms');
Route::get('/kebijakan-privasi', fn () => Inertia::render('Customer/Static/Privacy'))->name('privacy');

/*
|--------------------------------------------------------------------------
| Redirect Setelah Login — arahkan sesuai role
|--------------------------------------------------------------------------
*/
Route::get('/dashboard', function () {
    $user = auth()->user();

    return match ($user->role) {
        'admin' => redirect()->route('admin.dashboard'),
        'kurir' => redirect()->route('kurir.dashboard'),
        default => redirect()->route('home'),
    };
})->middleware(['auth', 'verified'])->name('dashboard');

/*
|--------------------------------------------------------------------------
| Area Pelanggan (butuh login, role apa saja yang sudah login)
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    Route::get('/keranjang', [\App\Http\Controllers\Customer\CartController::class, 'index'])->name('cart.index');
    Route::post('/keranjang', [\App\Http\Controllers\Customer\CartController::class, 'store'])->name('cart.store');
    Route::patch('/keranjang/{cartItem}', [\App\Http\Controllers\Customer\CartController::class, 'update'])->name('cart.update');
    Route::delete('/keranjang/{cartItem}', [\App\Http\Controllers\Customer\CartController::class, 'destroy'])->name('cart.destroy');

    Route::get('/checkout', [\App\Http\Controllers\Customer\CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout', [\App\Http\Controllers\Customer\CheckoutController::class, 'store'])->name('checkout.store');
    Route::get('/checkout/{order}/sukses', [\App\Http\Controllers\Customer\CheckoutController::class, 'success'])->name('checkout.success');

    Route::get('/wishlist', [\App\Http\Controllers\Customer\WishlistController::class, 'index'])->name('wishlist.index');
    Route::post('/wishlist/{product}', [\App\Http\Controllers\Customer\WishlistController::class, 'store'])->name('wishlist.store');
    Route::delete('/wishlist/{product}', [\App\Http\Controllers\Customer\WishlistController::class, 'destroy'])->name('wishlist.destroy');

    Route::get('/akun/pesanan', [\App\Http\Controllers\Customer\OrderHistoryController::class, 'index'])->name('account.orders');
    Route::get('/akun/pesanan/{order}', [\App\Http\Controllers\Customer\OrderHistoryController::class, 'show'])->name('account.orders.show');
    Route::post('/akun/pesanan/{order}/retur', [\App\Http\Controllers\Customer\ReturnController::class, 'store'])->name('account.orders.return.store');
    Route::get('/akun/alamat', [\App\Http\Controllers\Customer\AddressController::class, 'index'])->name('account.addresses');

    Route::get('/akun/ulasan', [\App\Http\Controllers\Customer\TestimonialController::class, 'index'])->name('account.testimonials.index');
    Route::post('/akun/ulasan', [\App\Http\Controllers\Customer\TestimonialController::class, 'store'])->name('account.testimonials.store');

    // Profile bawaan Breeze
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| Area Admin — HANYA role admin
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

        Route::resource('produk', \App\Http\Controllers\Admin\ProductController::class)
                        ->parameters(['produk' => 'product']);
        Route::resource('kategori', \App\Http\Controllers\Admin\CategoryController::class)
                        ->parameters(['kategori' => 'category']);
        Route::resource('paket', \App\Http\Controllers\Admin\PackageController::class)
                        ->parameters(['paket' => 'package']);

        Route::get('/pesanan', [\App\Http\Controllers\Admin\OrderController::class, 'index'])->name('orders.index');
        Route::get('/pesanan/{order}', [\App\Http\Controllers\Admin\OrderController::class, 'show'])->name('orders.show');
        Route::patch('/pesanan/{order}/status', [\App\Http\Controllers\Admin\OrderController::class, 'updateStatus'])->name('orders.update-status');
        Route::post('/pesanan/{order}/assign-kurir', [\App\Http\Controllers\Admin\OrderController::class, 'assignCourier'])->name('orders.assign-courier');
        Route::post('/pesanan/generate-rute', [\App\Http\Controllers\Admin\OrderController::class, 'generateRoute'])->name('orders.generate-route');

        Route::get('/stok', [\App\Http\Controllers\Admin\StockController::class, 'index'])->name('stock.index');
        Route::post('/stok/{product}/movement', [\App\Http\Controllers\Admin\StockController::class, 'storeMovement'])->name('stock.movement');

        Route::get('/keuangan', [\App\Http\Controllers\Admin\FinanceController::class, 'index'])->name('finance.index');
        Route::post('/keuangan/transaksi', [\App\Http\Controllers\Admin\FinanceController::class, 'storeTransaction'])->name('finance.transaction.store');
        Route::delete('/keuangan/transaksi/{cashTransaction}', [\App\Http\Controllers\Admin\FinanceController::class, 'destroyTransaction'])->name('finance.transaction.destroy');
        Route::get('/keuangan/export', [\App\Http\Controllers\Admin\FinanceController::class, 'exportCsv'])->name('finance.export');

        Route::get('/cetak', [\App\Http\Controllers\Admin\PrintController::class, 'index'])->name('print.index');
        Route::get('/cetak/struk/{order}', [\App\Http\Controllers\Admin\PrintController::class, 'struk'])->name('print.struk');
        Route::get('/cetak/struk-batch', [\App\Http\Controllers\Admin\PrintController::class, 'strukBatch'])->name('print.struk-batch');

        Route::get('/pengaturan', [\App\Http\Controllers\Admin\SettingController::class, 'index'])->name('settings.index');
        Route::patch('/pengaturan', [\App\Http\Controllers\Admin\SettingController::class, 'update'])->name('settings.update');
        Route::post('/pengaturan/kloter', [\App\Http\Controllers\Admin\SettingController::class, 'storeBatch'])->name('settings.kloter.store');
        Route::patch('/pengaturan/kloter/{batch}', [\App\Http\Controllers\Admin\SettingController::class, 'updateBatch'])->name('settings.kloter.update');
        Route::delete('/pengaturan/kloter/{batch}', [\App\Http\Controllers\Admin\SettingController::class, 'destroyBatch'])->name('settings.kloter.destroy');

        Route::resource('pengguna', \App\Http\Controllers\Admin\UserController::class)
        ->except(['show'])
        ->parameters(['pengguna' => 'user']);

        Route::get('/analitik', [\App\Http\Controllers\Admin\AnalyticsController::class, 'index'])->name('analytics.index');

        Route::get('/customer', [\App\Http\Controllers\Admin\CustomerController::class, 'index'])->name('customers.index');
        Route::get('/customer/{user}', [\App\Http\Controllers\Admin\CustomerController::class, 'show'])->name('customers.show');
        Route::get('/retur', [\App\Http\Controllers\Admin\ReturnController::class, 'index'])->name('returns.index');
        Route::patch('/retur/{returnRequest}', [\App\Http\Controllers\Admin\ReturnController::class, 'update'])->name('returns.update');

        Route::resource('blog', \App\Http\Controllers\Admin\BlogController::class)->except(['show']);

        Route::get('/faq', [\App\Http\Controllers\Admin\FaqController::class, 'index'])->name('faq.index');
        Route::post('/faq', [\App\Http\Controllers\Admin\FaqController::class, 'store'])->name('faq.store');
        Route::patch('/faq/{faq}', [\App\Http\Controllers\Admin\FaqController::class, 'update'])->name('faq.update');
        Route::delete('/faq/{faq}', [\App\Http\Controllers\Admin\FaqController::class, 'destroy'])->name('faq.destroy');

        Route::get('/testimoni', [\App\Http\Controllers\Admin\TestimonialController::class, 'index'])->name('testimonials.index');
        Route::post('/testimoni', [\App\Http\Controllers\Admin\TestimonialController::class, 'store'])->name('testimonials.store');
        Route::patch('/testimoni/{testimonial}/toggle', [\App\Http\Controllers\Admin\TestimonialController::class, 'toggleTampil'])->name('testimonials.toggle');
        Route::delete('/testimoni/{testimonial}', [\App\Http\Controllers\Admin\TestimonialController::class, 'destroy'])->name('testimonials.destroy');

        Route::get('/banner', [\App\Http\Controllers\Admin\BannerController::class, 'index'])->name('banners.index');
        Route::post('/banner', [\App\Http\Controllers\Admin\BannerController::class, 'store'])->name('banners.store');
        Route::patch('/banner/{banner}', [\App\Http\Controllers\Admin\BannerController::class, 'update'])->name('banners.update');
        Route::delete('/banner/{banner}', [\App\Http\Controllers\Admin\BannerController::class, 'destroy'])->name('banners.destroy');
    });

/*
|--------------------------------------------------------------------------
| Area Kurir — HANYA role kurir
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified', 'role:kurir'])
    ->prefix('kurir')
    ->name('kurir.')
    ->group(function () {
        Route::get('/', [KurirDashboardController::class, 'index'])->name('dashboard');
        Route::get('/rute', [\App\Http\Controllers\Kurir\RouteController::class, 'index'])->name('route.index');
        Route::patch('/pesanan/{order}/selesai', [\App\Http\Controllers\Kurir\RouteController::class, 'complete'])->name('order.complete');
        Route::get('/kas', [\App\Http\Controllers\Kurir\CashController::class, 'index'])->name('cash.index');
        Route::post('/kas/setor', [\App\Http\Controllers\Kurir\CashController::class, 'store'])->name('cash.store');
    });

/*
|--------------------------------------------------------------------------
| Webhook Midtrans — tanpa middleware auth (dipanggil server Midtrans)
|--------------------------------------------------------------------------
*/
Route::post('/midtrans/callback', [\App\Http\Controllers\Customer\MidtransCallbackController::class, 'handle'])
    ->name('midtrans.callback')
    ->withoutMiddleware(['auth', 'verified']);

require __DIR__.'/auth.php'; // rute login/register/reset bawaan Breeze, JANGAN dihapus
