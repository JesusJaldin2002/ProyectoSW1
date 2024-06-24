<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Word;
use Illuminate\Support\Facades\Storage;

class WordController extends Controller
{
    public function index($categoryId)
    {
        $category = Category::findOrFail($categoryId);
        $words = Word::where('category_id', $categoryId)->get();
        return view('learning.words.index', compact('category', 'words'));
    }

    public function manage($categoryId)
    {
        $category = Category::findOrFail($categoryId);
        $words = Word::where('category_id', $categoryId)->get();
        return view('learning.words.manage', compact('category', 'words'));
    }

    public function create($categoryId)
    {
        $category = Category::findOrFail($categoryId);
        return view('learning.words.form', compact('category'));
    }

    public function show($categoryId, Word $word)
    {
        $category = Category::findOrFail($categoryId);
        return view('learning.words.show', compact('category', 'word'));
    }

    public function store(Request $request, $categoryId)
    {
        $request->validate([
            'name' => 'required|string|max:30|unique:words',
            'gif_path' => 'required|file|mimes:mp4',
        ]);

        $category = Category::findOrFail($categoryId);

        $videoFileName = $request->name . '.' . $request->file('gif_path')->getClientOriginalExtension();
        $videoPath = $request->file('gif_path')->storeAs('public/videos/' . $category->name, $videoFileName);

        Word::create([
            'name' => $request->name,
            'gif_path' => $videoFileName,
            'category_id' => $categoryId,
        ]);

        return redirect()->route('words.manage', $categoryId);
    }


    public function edit($categoryId, Word $word)
    {
        $category = Category::findOrFail($categoryId);
        return view('learning.words.form', compact('category', 'word'));
    }

    public function update(Request $request, $categoryId, Word $word)
    {
        $request->validate([
            'name' => 'required|string|max:30|unique:words',
            'gif_path' => 'file|mimes:mp4',
        ]);
    
        // Guardar el nombre original del archivo antes de la actualización
        $originalVideoFileName = $word->gif_path;
    
        if ($request->hasFile('gif_path')) {
            // Eliminar el video anterior si existe
            if ($word->gif_path) {
                Storage::delete('public/videos/' . $category->name . '/' . $word->gif_path);
            }
    
            // Generar el nuevo nombre del archivo de video
            $newVideoFileName = $request->name . '.' . $request->file('gif_path')->getClientOriginalExtension();
            $videoPath = $request->file('gif_path')->storeAs('public/videos/' . $category->name, $newVideoFileName);
            $word->gif_path = $newVideoFileName;
        }
    
        // Si el nombre de la palabra ha cambiado, actualizarlo
        if ($request->name !== $word->name) {
            $word->name = $request->name;
        }
    
        // Renombrar el archivo de video si el nombre de la palabra ha cambiado
        if ($originalVideoFileName !== $word->gif_path) {
            Storage::move('public/videos/' . $category->name . '/' . $originalVideoFileName, 'public/videos/' . $category->name . '/' . $word->gif_path);
        }
    
        return redirect()->route('words.manage', $categoryId);
    }

    public function destroy($categoryId, Word $word)
    {
        $category = Category::findOrFail($categoryId);
        // Eliminar el video asociado antes de eliminar la palabra
        if ($word->gif_path) {
            Storage::delete('public/videos/' . $category->name . '/' . $word->gif_path);
        }
        $word->delete();

        return redirect()->route('words.manage', $categoryId);
    }
}