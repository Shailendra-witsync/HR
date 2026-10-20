<?php

namespace App\Support;

class HrModules
{
    public const ALL = [
        'dashboard' => 'Dashboard',
        'add_employees' => 'Add HR + Drafts',
        'modify_employees' => 'Modify Details',
        'list_employees' => 'List Of HR',
        'manage_access' => 'Manage Access',
        'reports' => 'Reports',
        'settings' => 'Settings',
    ];

    public static function names(): array
    {
        return array_keys(self::ALL);
    }
}
