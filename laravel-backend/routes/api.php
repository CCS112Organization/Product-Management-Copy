<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware([App\Http\Middleware\AuthMiddleware::class])->group(function () {
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });
});

Route::apiResource('products', App\Http\Controllers\api\ProductController::class)
    ->parameters(['products' => 'barcode']);

Route::post('/register', [App\Http\Controllers\auth\AuthController::class, 'register']);
Route::post('/login', [App\Http\Controllers\auth\AuthController::class, 'login']);
