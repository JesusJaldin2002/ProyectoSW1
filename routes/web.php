<?php

use App\Http\Controllers\ChatController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

// Rutas que requieren autenticación
Route::middleware(['auth'])->group(function () {

    Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
    
    //Chats
    Route::get('/chats/show/{id}',[ChatController::class, 'show'])->name('chats.show');
    Route::post('/chats', [ChatController::class,'store'])->name('chats.store');
    Route::post('/chats/add', [ChatController::class,'add'])->name('chats.add');
    Route::post('chats/{chat}/send',[ChatController::class,'sendMessage'])->name('chats.send');
    
});
