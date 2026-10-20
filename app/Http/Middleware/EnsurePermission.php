<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePermission
{
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $user = $request->user();
        $allowed = $user?->is_active && collect(explode('|', $permission))->contains(function (string $required) use ($user): bool {
            [$module, $action] = array_pad(explode('.', $required, 2), 2, null);

            return $module !== null && $action !== null && $user->hasPermission($module, $action);
        });

        abort_unless($allowed, 403);

        return $next($request);
    }
}
