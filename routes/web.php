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
Route::get('/faq', fn () => Inertia::render('Customer/Static/Faq'))->name('faq');
Route::get('/blog', [\App\Http\Controllers\Customer\BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{blogPost:slug}', [\App\Http\Controllers\Customer\BlogController::class, 'show'])->name('blog.show');
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
    Route::get('/akun/alamat', [\App\Http\Controllers\Customer\AddressController::class, 'index'])->name('account.addresses');

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

        Route::resource('produk', \App\Http\Controllers\Admin\ProductController::class);
        Route::resource('kategori', \App\Http\Controllers\Admin\CategoryController::class);
        Route::resource('paket', \App\Http\Controllers\Admin\PackageController::class);

        Route::get('/pesanan', [\App\Http\Controllers\Admin\OrderController::class, 'index'])->name('orders.index');
        Route::get('/pesanan/{order}', [\App\Http\Controllers\Admin\OrderController::class, 'show'])->name('orders.show');
        Route::patch('/pesanan/{order}/status', [\App\Http\Controllers\Admin\OrderController::class, 'updateStatus'])->name('orders.update-status');

        Route::get('/stok', [\App\Http\Controllers\Admin\StockController::class, 'index'])->name('stock.index');
        Route::post('/stok/{product}/movement', [\App\Http\Controllers\Admin\StockController::class, 'storeMovement'])->name('stock.movement');

        Route::get('/keuangan', [\App\Http\Controllers\Admin\FinanceController::class, 'index'])->name('finance.index');
        Route::post('/keuangan/transaksi', [\App\Http\Controllers\Admin\FinanceController::class, 'storeTransaction'])->name('finance.transaction.store');

        Route::get('/cetak', [\App\Http\Controllers\Admin\PrintController::class, 'index'])->name('print.index');

        Route::get('/pengaturan', [\App\Http\Controllers\Admin\SettingController::class, 'index'])->name('settings.index');
        Route::patch('/pengaturan', [\App\Http\Controllers\Admin\SettingController::class, 'update'])->name('settings.update');

        Route::resource('pengguna', \App\Http\Controllers\Admin\UserController::class)->except(['show']);

        Route::get('/customer', [\App\Http\Controllers\Admin\CustomerController::class, 'index'])->name('customers.index');
        Route::get('/retur', [\App\Http\Controllers\Admin\ReturnController::class, 'index'])->name('returns.index');
        Route::patch('/retur/{returnRequest}', [\App\Http\Controllers\Admin\ReturnController::class, 'update'])->name('returns.update');
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
