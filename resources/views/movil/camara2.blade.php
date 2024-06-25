<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Laravel</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />

    <!-- Styles -->
    <link rel="stylesheet" type="text/css" href="{{ asset('css/movil.css') }}">

    <!-- Todo esto es necesario para la detección de las señas -->
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/holistic/holistic.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm/dist/tf-backend-wasm.js"></script>
    <!-- Todo esto es necesario para la detección de las señas -->

</head>

<body class="antialiased">
    <div class="container">
        <div id="loading" class="loading">
            Cargando...
        </div>
        <div id="video-container" style="position: relative; width: 100%; max-width: 640px; margin: auto;">
            <video id="webcam" autoplay playsinline style="width: 100%;"></video>
            <canvas id="output_canvas" class="output_canvas" style="position: absolute; left: 0; top: 0;"></canvas>
        </div>
        <textarea id="gesture_output" readonly style="width: 100%; height: 30px; text-align: center;"></textarea>
        <div style="display: flex; justify-content: center; margin-top: 10px;">
            <button id="webcamButton" class="btn btn-primary">Enable Webcam</button>
            <button id="toggle-camera" class="btn btn-secondary" style="margin-left: 10px;">Toggle Camera</button>
        </div>
    </div>

    <!-- Este es el script.js principal para lenguaje de señas -->
    <script type="module" src="{{ asset('js/scriptmovil2.js') }}"></script>
</body>

</html>
