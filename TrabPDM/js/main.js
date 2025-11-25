
// Registrando o service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            let reg = await navigator.serviceWorker.register('/sw.js', { type: "module" });
            console.log("Service worker registrado! 🎉", reg);
        } catch (err) {
            console.log("❌ Service worker falhou: ", err);
        }
    });
}

// Configurando as constraints do vídeo (câmera frontal)
let constraints = { video: { facingMode: "user" }, audio: false };

// Capturando elementos da tela
const cameraView = document.querySelector("#camera--view");
const cameraOutput = document.querySelector("#camera--output");
const cameraSensor = document.querySelector("#camera--sensor");
const cameraTrigger = document.querySelector("#camera--trigger");

// Função que inicia a câmera
function cameraStart() {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
            let track = stream.getTracks()[0];
            cameraView.srcObject = stream;
        })
        .catch((error) => {
            console.error("❌ Ocorreu um erro ao acessar a câmera:", error);
        });
}

// Função para tirar foto
cameraTrigger.onclick = function () {
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;

    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);

    cameraOutput.src = cameraSensor.toDataURL("image/webp");
    cameraOutput.classList.add("taken");
};

// Iniciar câmera quando a página carregar
window.addEventListener("load", cameraStart);
