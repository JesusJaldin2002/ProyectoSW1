@extends('layouts.app')

@section('scripts2')
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/holistic/holistic.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm/dist/tf-backend-wasm.js"></script>
    <script type="module" src="{{ asset('js/script4.js') }}"></script>
@endsection

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <!-- Card para el video -->
        <div class="col-md-6">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>Categoría: {{ $category->name }}</span>
                    <a href="{{ URL::previous() }}" class="btn btn-primary btn-sm">Back</a>
                </div>
                <div class="card-body">
                    <div>
                        <video width="100%" autoplay loop muted>
                            <source src="{{ asset('storage/videos/' . $word->gif_path) }}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <h3 style="text-align: center;">{{ $word->name }}</h3>
                </div>
            </div>
        </div>

        <!-- Card para la detección -->
        <div class="col-md-6">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>Detection</span>
                    <button id="toggle-camera" class="btn btn-primary">Toggle Camera</button>
                </div>
                {{-- <div class="card-body"> --}}
                    {{-- <div id="loading">Loading...</div>
                    <canvas id="output_canvas" style="display: none;"></canvas>
                    <div id="sentence-container"></div>
                    <p> </p>
                    <textarea id="detected-words" readonly style="width: 100%; height: 30px;"></textarea>
                    <button id="toggle-camera" class="btn btn-secondary">Toggle Camera</button> --}}
                {{-- </div> --}}
                <br>
                <div id="loading">Loading...</div>
                    <canvas id="output_canvas" style="display: none;"></canvas>
                    <div id="sentence-container"></div>
                    <div style="margin-top: 15px;"></div>  
                    <textarea id="detected-words" readonly style="width: 100%; height: 30px; text-align: center;"></textarea>
                    <div style="margin-top: 20px;"></div>               
            </div>
        </div>
    </div>
</div>
@endsection
