<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Courier;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $users = User::where('role', '!=', 'customer')
            ->with('courierProfile')
            ->when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->orderBy('name')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users'   => $users,
            'filters' => $request->only('search'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Users/Form', ['user' => null]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatedData($request, isUpdate: false);

        $user = User::create([
            'name'              => $data['name'],
            'email'             => $data['email'],
            'phone'             => $data['phone'] ?? null,
            'role'              => $data['role'],
            'password'          => Hash::make($data['password']),
            'email_verified_at' => now(),
        ]);

        if ($data['role'] === 'kurir') {
            $this->syncCourierProfile($user, $data, statusAktif: true);
        }

        return redirect()->route('admin.pengguna.index')->with('success', "Pengguna \"{$user->name}\" berhasil ditambahkan.");
    }

    public function edit(User $user): Response
    {
        abort_if($user->role === 'customer', 404);

        return Inertia::render('Admin/Users/Form', ['user' => $user->load('courierProfile')]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        abort_if($user->role === 'customer', 404);

        $data = $this->validatedData($request, isUpdate: true, userId: $user->id);

        $user->update([
            'name'  => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'role'  => $data['role'],
            ...($data['password'] ? ['password' => Hash::make($data['password'])] : []),
        ]);

        if ($data['role'] === 'kurir') {
            $this->syncCourierProfile($user, $data, statusAktif: $request->boolean('status_aktif', true));
        } elseif ($user->courierProfile) {
            // Role diubah dari kurir ke lainnya: NONAKTIFKAN profil kurir, JANGAN dihapus —
            // supaya riwayat rute (courier_routes) dan kas (cash_reconciliations) lama tetap utuh.
            $user->courierProfile->update(['status_aktif' => false]);
        }

        return redirect()->route('admin.pengguna.index')->with('success', "Pengguna \"{$user->name}\" berhasil diperbarui.");
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        abort_if($user->role === 'customer', 404);

        if ($user->id === $request->user()->id) {
            return back()->with('error', 'Anda tidak bisa menghapus akun Anda sendiri.');
        }

        try {
            $user->delete();
        } catch (QueryException $e) {
            // Tertahan foreign key (mis. sudah pernah mencatat transaksi kas / artikel blog) —
            // daripada error 500 membingungkan, tampilkan saran yang jelas.
            return back()->with('error', 'Pengguna ini tidak bisa dihapus karena masih punya data terkait (transaksi/aktivitas tercatat). Ubah role-nya saja kalau ingin menonaktifkan akses.');
        }

        return back()->with('success', "Pengguna \"{$user->name}\" dihapus.");
    }

    private function validatedData(Request $request, bool $isUpdate, ?int $userId = null): array
    {
        return $request->validate([
            'name'           => ['required', 'string', 'max:255'],
            'email'          => ['required', 'email', $isUpdate ? Rule::unique('users', 'email')->ignore($userId) : 'unique:users,email'],
            'phone'          => ['nullable', 'string', 'max:20'],
            'role'           => ['required', 'in:admin,staff,kurir'],
            'password'       => [$isUpdate ? 'nullable' : 'required', 'string', 'min:8'],
            'plat_motor'     => ['nullable', 'string', 'max:20'],
            'kapasitas_muat' => ['nullable', 'integer', 'min:1'],
        ]);
    }

    private function syncCourierProfile(User $user, array $data, bool $statusAktif): void
    {
        Courier::updateOrCreate(
            ['user_id' => $user->id],
            [
                'nama'           => $user->name,
                'telepon'        => $user->phone,
                'plat_motor'     => $data['plat_motor'] ?? null,
                'kapasitas_muat' => $data['kapasitas_muat'] ?? null,
                'status_aktif'   => $statusAktif,
            ]
        );
    }
}
