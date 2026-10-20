<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreHrCodificationRequest;
use App\Http\Requests\UpdateHrCodificationRequest;
use App\Models\HrCodification;
use App\Services\HrAdministrationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function __construct(private HrAdministrationService $administration) {}

    public function index(Request $request): Response
    {
        return Inertia::render('Settings/Index', [
            'codifications' => $this->administration->codifications(),
            'departments' => $this->administration->departments(),
            'canManage' => $request->user()->hasPermission('settings', 'manage'),
        ]);
    }

    public function store(StoreHrCodificationRequest $request): RedirectResponse
    {
        $this->administration->storeCodification($request->validated());

        return to_route('settings.index')->with('status', 'HR codification added successfully.');
    }

    public function update(UpdateHrCodificationRequest $request, HrCodification $codification): RedirectResponse
    {
        $this->administration->updateCodification($codification, $request->validated());

        return to_route('settings.index')->with('status', 'HR codification updated successfully.');
    }

    public function destroy(HrCodification $codification): RedirectResponse
    {
        $this->administration->deleteCodification($codification);

        return to_route('settings.index')->with('status', 'HR codification deleted successfully.');
    }
}
