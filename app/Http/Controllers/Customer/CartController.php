<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(Request $request): Response
    {
        $cart = Cart::firstOrCreate(['user_id' => $request->user()->id]);
        $cartItems = $cart->items()->with('product.category')->get();

        $items = $cartItems->map(fn (CartItem $item) => [
            'id'       => $item->id,
            'qty'      => $item->qty,
            'subtotal' => $item->qty * $item->product->harga_jual,
            'product'  => [
                'id'          => $item->product->id,
                'nama'        => $item->product->nama,
                'slug'        => $item->product->slug,
                'gambar'      => $item->product->gambar,
                'satuan'      => $item->product->satuan,
                'harga_jual'  => $item->product->harga_jual,
                'stok'        => $item->product->stok,
                'status'      => $item->product->status,
                'kategori'    => $item->product->category?->nama,
            ],
        ]);

        return Inertia::render('Customer/Cart/Index', [
            'items'    => $items,
            'subtotal' => $items->sum('subtotal'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'qty'        => ['nullable', 'integer', 'min:1', 'max:99'],
        ]);

        $product = Product::findOrFail($data['product_id']);

        if ($product->status !== 'aktif' || $product->stok < 1) {
            return back()->with('error', "{$product->nama} sedang habis.");
        }

        $cart = Cart::firstOrCreate(['user_id' => $request->user()->id]);
        $item = $cart->items()->firstOrNew(['product_id' => $product->id]);

        $newQty = ($item->exists ? $item->qty : 0) + ($data['qty'] ?? 1);

        if ($newQty > $product->stok) {
            return back()->with('error', "Stok {$product->nama} hanya tersisa {$product->stok}.");
        }

        $item->qty = $newQty;
        $item->save();

        return back()->with('success', "{$product->nama} ditambahkan ke keranjang.");
    }

    public function update(Request $request, CartItem $cartItem): RedirectResponse
    {
        $this->authorizeItem($request, $cartItem);

        $data = $request->validate(['qty' => ['required', 'integer', 'min:1', 'max:99']]);

        if ($data['qty'] > $cartItem->product->stok) {
            return back()->with('error', "Stok {$cartItem->product->nama} hanya tersisa {$cartItem->product->stok}.");
        }

        $cartItem->update(['qty' => $data['qty']]);

        return back();
    }

    public function destroy(Request $request, CartItem $cartItem): RedirectResponse
    {
        $this->authorizeItem($request, $cartItem);

        $cartItem->delete();

        return back()->with('success', 'Produk dihapus dari keranjang.');
    }

    /** Mencegah pelanggan A mengubah keranjang pelanggan B dengan menebak ID. */
    private function authorizeItem(Request $request, CartItem $cartItem): void
    {
        abort_unless($cartItem->cart->user_id === $request->user()->id, 403);
    }
}
