<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CashReconciliation;
use App\Models\CashTransaction;
use App\Services\FinanceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class FinanceController extends Controller
{
    public function __construct(private FinanceService $finance) {}

    public function index(Request $request): Response
    {
        $dari   = $request->dari ?? now()->startOfWeek()->toDateString();
        $sampai = $request->sampai ?? now()->endOfWeek()->toDateString();

        return Inertia::render('Admin/Finance/Index', [
            'summary'         => $this->finance->summary($dari, $sampai),
            'transactions'    => CashTransaction::with('creator:id,name')
                ->whereBetween('tanggal', [$dari, $sampai])->orderByDesc('tanggal')->orderByDesc('id')->get(),
            'reconciliations' => CashReconciliation::with('courier:id,nama')
                ->whereBetween('tanggal', [$dari, $sampai])->orderByDesc('tanggal')->get(),
            'filters'         => ['dari' => $dari, 'sampai' => $sampai],
        ]);
    }

    public function storeTransaction(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'tanggal'    => ['required', 'date'],
            'tipe'       => ['required', 'in:masuk,keluar'],
            'kategori'   => ['required', 'string', 'max:100'],
            'nominal'    => ['required', 'numeric', 'min:1'],
            'keterangan' => ['nullable', 'string', 'max:255'],
        ]);

        CashTransaction::create([...$data, 'dibuat_oleh' => $request->user()->id]);

        return back()->with('success', 'Transaksi kas dicatat.');
    }

    public function destroyTransaction(CashTransaction $cashTransaction): RedirectResponse
    {
        $cashTransaction->delete();

        return back()->with('success', 'Transaksi kas dihapus.');
    }

    public function exportCsv(Request $request): StreamedResponse
    {
        $dari   = $request->dari ?? now()->startOfWeek()->toDateString();
        $sampai = $request->sampai ?? now()->endOfWeek()->toDateString();

        $transactions = CashTransaction::whereBetween('tanggal', [$dari, $sampai])->orderBy('tanggal')->get();

        return response()->streamDownload(function () use ($transactions) {
            $out = fopen('php://output', 'w');
            fputcsv($out, ['Tanggal', 'Tipe', 'Kategori', 'Nominal', 'Keterangan']);
            foreach ($transactions as $t) {
                fputcsv($out, [
                    $t->tanggal instanceof Carbon ? $t->tanggal->toDateString() : $t->tanggal,
                    $t->tipe, $t->kategori, $t->nominal, $t->keterangan,
                ]);
            }
            fclose($out);
        }, "laporan-kas-{$dari}-sampai-{$sampai}.csv");
    }
}
