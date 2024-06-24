@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>Category: {{ $category->name }}</span>
                </div>

                <div class="card-body">
                    <div>
                        <video width="100%" autoplay loop muted>
                            <source src="{{ asset('storage/videos/' . $word->gif_path) }}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <p>{{ $word->name }}</p>
                </div>
            </div>
        </div>
        
        <div class="col-md-6">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>Cámara</span>
                    <a href="{{ URL::previous() }}" class="btn btn-primary">Back</a>
                </div>
                    <div class="card-body">
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection