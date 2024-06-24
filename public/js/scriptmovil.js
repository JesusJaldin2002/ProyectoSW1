import { updateSentenceDisplay, formatSentences, thereHand, extractKeypoints, drawGuidelines } from './helpers.js';

const canvasElement = document.getElementById('output_canvas');
const canvasCtx = canvasElement.getContext('2d');

// Selecciona el elemento HTML donde deseas mostrar las palabras de la oración
const sentenceContainer = document.getElementById('sentence-container');
const sentenceList = document.createElement('div'); // Creamos un contenedor para las palabras
sentenceContainer.appendChild(sentenceList);

const detectedWordsElement = document.getElementById('detected-words');
const sendMessageButton = document.getElementById('send-message');
const toggleCameraButton = document.getElementById('toggle-camera');

let camera = null;
let kpSequence = []; // Variable para almacenar la secuencia de keypoints
let countFrame = 0;
const actions = ['A', 'gracias', 'L', 'mi', 'nombre', 'por favor'];
let repeSent = 1;
let sentence = [];
const threshold = 0.7;
const MAX_LENGTH_FRAMES = 15;
const MIN_LENGTH_FRAMES = 5;

const loadingElement = document.getElementById('loading');

tf.setBackend('wasm').then(async () => {
    const model = await tf.loadLayersModel('./models/model.json');

    loadingElement.style.display = 'none';
    canvasElement.style.display = 'block';

    function onResults(results) {
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height); // Borra el contenido del lienzo.

        // Dibujar la imagen original en el canvas
        canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

        // Actualizar la secuencia de keypoints
        const newKeypoints = extractKeypoints(results);
        kpSequence.push(newKeypoints);

        // Realizar la evaluación del modelo
        if (kpSequence.length > MAX_LENGTH_FRAMES && thereHand(results)) {
            countFrame += 1;
        } else {
            if (countFrame >= MIN_LENGTH_FRAMES) {
                const lastKeypoints = kpSequence.slice(-MAX_LENGTH_FRAMES); // Obtener los últimos MAX_LENGTH_FRAMES keypoints
                const inputTensor = tf.tensor([lastKeypoints]); // Crear un tensor con los keypoints
                const prediction = model.predict(inputTensor); // Realizar la predicción con el modelo TensorFlow.js
                const res = prediction.dataSync(); // Obtener los resultados de la predicción

                if (Math.max(...res) > threshold) {
                    const maxIndex = res.indexOf(Math.max(...res));
                    const sent = actions[maxIndex];

                    // Enviar mensaje si la palabra es "mi"
                    if (sent === 'mi') {
                        sendMessage();
                    } else if (sent === 'L') {
                        // Borrar palabra si la palabra es "L"
                        deleteLastWord();
                    } else {
                        sentence.unshift(sent);
                        [sentence, repeSent] = formatSentences(sent, sentence, repeSent);
                        // Agregar la palabra detectada al área de texto
                        detectedWordsElement.value += sent + ' ';
                    }
                }

                countFrame = 0;
                kpSequence = [];
            }
        }

        // Dibujar los landmarks de la pose
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 4 });
        drawLandmarks(canvasCtx, results.poseLandmarks, { color: '#FF0000', lineWidth: 2 });

        // Dibujar los landmarks del rostro
        drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, { color: '#C0C0C070', lineWidth: 1 });

        // Dibujar los landmarks de la mano izquierda
        drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, { color: '#CC0000', lineWidth: 5 });
        drawLandmarks(canvasCtx, results.leftHandLandmarks, { color: '#00FF00', lineWidth: 2 });

        // Dibujar los landmarks de la mano derecha
        drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, { color: '#00CC00', lineWidth: 5 });
        drawLandmarks(canvasCtx, results.rightHandLandmarks, { color: '#FF0000', lineWidth: 2 });

        // Llamar a drawGuidelines para dibujar las guías
        drawGuidelines(canvasCtx, canvasElement.width, canvasElement.height);
    }

    const holistic = new Holistic({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
    });

    holistic.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: true,
        refineFaceLandmarks: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    holistic.onResults(onResults);

    function startCamera() {
        camera = new Camera(videoElement, {
            onFrame: async () => {
                await holistic.send({ image: videoElement });
            },
            width: 640,
            height: 480
        });
        camera.start();
    }

    function stopCamera() {
        if (camera) {
            camera.stop();
        }
    }

    toggleCameraButton.addEventListener('click', () => {
        if (camera) {
            stopCamera();
            camera = null;
        } else {
            startCamera();
        }
    });

    const videoElement = document.createElement('video');
    videoElement.width = 640;
    videoElement.height = 480;
    videoElement.autoplay = true;
    videoElement.muted = true;
    videoElement.playsInline = true;
    videoElement.style.display = 'none';
    document.body.appendChild(videoElement);

    startCamera();
});

function sendMessage() {
    const message = detectedWordsElement.value.trim();
    if (message) {
        console.log('Mensaje enviado:', message);
        detectedWordsElement.value = '';
    }
}

function deleteLastWord() {
    let words = detectedWordsElement.value.trim().split(' ');
    words.pop();
    detectedWordsElement.value = words.join(' ') + ' ';
}

sendMessageButton.addEventListener('click', sendMessage);
