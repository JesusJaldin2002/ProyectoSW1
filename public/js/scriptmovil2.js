import { GestureRecognizer, FilesetResolver, DrawingUtils } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

let demosSection = document.getElementById("demos");
let gestureRecognizer;
let runningMode = "IMAGE";
let enableWebcamButton;
let toggleCameraButton;
let webcamRunning = false;
let useFrontCamera = true;
const videoHeight = "480px";
const videoWidth = "360px";  // Ajustado para vista móvil vertical

// Before we can use HandLandmarker class we must wait for it to finish loading. Machine Learning models can be large and take a moment to get everything needed to run.
const createGestureRecognizer = async () => {
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    );
    gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: "/models/alfabeto.task",
            delegate: "GPU"
        },
        runningMode: runningMode
    });
    if (demosSection) {
        demosSection.classList.remove("invisible");
    }
};
createGestureRecognizer();

/********************************************************************
// Demo 1: Detect hand gestures in images
********************************************************************/

const imageContainers = document.getElementsByClassName("detectOnClick");

for (let i = 0; i < imageContainers.length; i++) {
    imageContainers[i].children[0].addEventListener("click", handleClick);
}

async function handleClick(event) {
    if (!gestureRecognizer) {
        alert("Please wait for gestureRecognizer to load");
        return;
    }

    if (runningMode === "VIDEO") {
        runningMode = "IMAGE";
        await gestureRecognizer.setOptions({ runningMode: "IMAGE" });
    }
    // Remove all previous landmarks
    const allCanvas = event.target.parentNode.getElementsByClassName("canvas");
    for (var i = allCanvas.length - 1; i >= 0; i--) {
        const n = allCanvas[i];
        n.parentNode.removeChild(n);
    }

    const results = gestureRecognizer.recognize(event.target);

    // View results in the console to see their format
    console.log(results);
    if (results.gestures.length > 0) {
        const p = event.target.parentNode.childNodes[3];
        p.setAttribute("class", "info");

        const categoryName = results.gestures[0][0].categoryName;
        const categoryScore = parseFloat(
            results.gestures[0][0].score * 100
        ).toFixed(2);
        const handedness = results.handednesses[0][0].displayName;

        p.innerText = `GestureRecognizer: ${categoryName}\n Confidence: ${categoryScore}%\n Handedness: ${handedness}`;
        p.style =
            "left: 0px;" +
            "top: " +
            event.target.height +
            "px; " +
            "width: " +
            (event.target.width - 10) +
            "px;";

        const canvas = document.createElement("canvas");
        canvas.setAttribute("class", "canvas");
        canvas.setAttribute("width", event.target.naturalWidth + "px");
        canvas.setAttribute("height", event.target.naturalHeight + "px");
        canvas.style =
            "left: 0px;" +
            "top: 0px;" +
            "width: " +
            event.target.width +
            "px;" +
            "height: " +
            event.target.height +
            "px;";

        event.target.parentNode.appendChild(canvas);
        const canvasCtx = canvas.getContext("2d");
        const drawingUtils = new DrawingUtils(canvasCtx);
        for (const landmarks of results.landmarks) {
            drawingUtils.drawConnectors(
                landmarks,
                GestureRecognizer.HAND_CONNECTIONS,
                {
                    color: "#00FF00",
                    lineWidth: 2  // Reducido el ancho de línea
                }
            );
            drawingUtils.drawLandmarks(landmarks, {
                color: "#FF0000",
                lineWidth: 1,  // Reducido el ancho de los puntos
                radius: 3  // Reducido el tamaño de los puntos
            });
        }
    }
}

/********************************************************************
// Demo 2: Continuously grab image from webcam stream and detect it.
********************************************************************/

const video = document.getElementById("webcam");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");
const gestureOutput = document.getElementById("gesture_output");

// Check if webcam access is supported.
function hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

// If webcam supported, add event listener to button for when user wants to activate it.
if (hasGetUserMedia()) {
    enableWebcamButton = document.getElementById("webcamButton");
    toggleCameraButton = document.getElementById("toggle-camera");
    enableWebcamButton.addEventListener("click", enableCam);
    toggleCameraButton.addEventListener("click", toggleCamera);
} else {
    console.warn("getUserMedia() is not supported by your browser");
}

// Enable the live webcam view and start detection.
function enableCam(event) {
    if (!gestureRecognizer) {
        alert("Please wait for gestureRecognizer to load");
        return;
    }

    // getUsermedia parameters.
    const constraints = {
        video: { facingMode: useFrontCamera ? "user" : "environment" }
    };

    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        video.srcObject = stream;
        video.addEventListener("loadeddata", () => {
            predictWebcam();
            document.getElementById("loading").style.display = "none";  // Ocultar "Cargando..."
        });
        webcamRunning = true;
    });
}

// Toggle camera between front and back
function toggleCamera() {
    useFrontCamera = !useFrontCamera;
    if (webcamRunning) {
        enableCam();
    }
}

let lastVideoTime = -1;
let results = undefined;
async function predictWebcam() {
    // Now let's start detecting the stream.
    if (runningMode === "IMAGE") {
        runningMode = "VIDEO";
        await gestureRecognizer.setOptions({ runningMode: "VIDEO" });
    }
    let nowInMs = Date.now();
    if (video.currentTime !== lastVideoTime) {
        lastVideoTime = video.currentTime;
        results = gestureRecognizer.recognizeForVideo(video, nowInMs);
    }

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    const drawingUtils = new DrawingUtils(canvasCtx);

    canvasElement.style.height = videoHeight;
    video.style.height = videoHeight;
    canvasElement.style.width = videoWidth;
    video.style.width = videoWidth;

    if (results.landmarks) {
        for (const landmarks of results.landmarks) {
            drawingUtils.drawConnectors(
                landmarks,
                GestureRecognizer.HAND_CONNECTIONS,
                {
                    color: "#00FF00",
                    lineWidth: 4  // Reducido el ancho de línea
                }
            );
            drawingUtils.drawLandmarks(landmarks, {
                color: "#FF0000",
                lineWidth: 1,  // Reducido el ancho de los puntos
                radius: 4  // Reducido el tamaño de los puntos
            });
        }
    }
    canvasCtx.restore();
    if (results.gestures.length > 0) {
        gestureOutput.style.display = "block";
        gestureOutput.style.width = videoWidth;
        const categoryName = results.gestures[0][0].categoryName;
        const categoryScore = parseFloat(
            results.gestures[0][0].score * 100
        ).toFixed(2);
        const handedness = results.handednesses[0][0].displayName;
        gestureOutput.innerText = `${categoryName}\n`;
    }

    // Call this function again to keep predicting when the browser is ready.
    if (webcamRunning === true) {
        window.requestAnimationFrame(predictWebcam);
    }
}
