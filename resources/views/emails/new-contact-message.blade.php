<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: sans-serif; color: #1E4D3B;">
    <h2>Pesan Baru dari Form Kontak</h2>
    <table cellpadding="6" style="border-collapse: collapse;">
        <tr><td><strong>Nama</strong></td><td>{{ $pesan->nama }}</td></tr>
        <tr><td><strong>Email</strong></td><td>{{ $pesan->email }}</td></tr>
        <tr><td><strong>Telepon</strong></td><td>{{ $pesan->telepon ?? '-' }}</td></tr>
        <tr><td><strong>Subjek</strong></td><td>{{ $pesan->subjek ?? '-' }}</td></tr>
    </table>
    <p><strong>Isi Pesan:</strong></p>
    <p style="white-space: pre-line;">{{ $pesan->pesan }}</p>
    <p style="color: #6B7A72; font-size: 12px;">Dikirim lewat form kontak website pada {{ $pesan->created_at->format('d/m/Y H:i') }} WIB.</p>
</body>
</html>
