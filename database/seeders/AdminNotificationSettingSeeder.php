<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class AdminNotificationSettingSeeder extends Seeder
{
    public function run(): void
    {
        Setting::set('admin_notification_email', 'admin@warungsayurpulungan.test');
    }
}
