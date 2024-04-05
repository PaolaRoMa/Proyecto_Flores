//script.js
const class_names = ['Margarita', 'Diente de Leon', 'Rosa', 'Girasol', 'Tulipan']; 

async function predecirImagen() {
    // Obtener la referencia al elemento de entrada de archivo
    const inputElement = document.getElementById("fileInput");
    // Obtener el archivo seleccionado por el usuario
    const file = inputElement.files[0];
    
    // Verificar si se seleccionó un archivo
    if (file) {
        // Crear un objeto de tipo FileReader para leer el archivo
        const reader = new FileReader();
        
        // Definir una función de devolución de llamada para ejecutar cuando se complete la lectura del archivo
        reader.onload = async function() {
            // Crear un objeto de imagen en TensorFlow.js desde los datos del archivo
            const img = new Image();
            img.src = reader.result;
            
            // Esperar a que la imagen se cargue completamente
            await img.decode();
            
            // Mostrar la imagen seleccionada
            const imagenElement = document.getElementById("imagen");
            imagenElement.src = reader.result;
            
            // Convertir la imagen a un tensor
            const tensor = tf.browser.fromPixels(img).toFloat();
            
            // Expandir la dimensión del tensor para que sea compatible con el formato de entrada del modelo
            const inputTensor = tensor.expandDims();
            
            // Cargar el modelo
            const model = await tf.loadLayersModel('modelos/model.json');
            
            // Realizar la predicción
            const predictions = model.predict(inputTensor).dataSync();

            // Mostrar los resultados de la predicción
            const resultadoDiv = document.getElementById("resultado");
            resultadoDiv.innerHTML = "";
            for (let i = 0; i < predictions.length; i++) {
                const class_name = class_names[i];
                const probabilidad = predictions[i];
                const porcentaje = (probabilidad * 100).toFixed(2);
                resultadoDiv.innerHTML += `<p>${class_name}: ${porcentaje}%</p>`;
            }
        };
        
        // Leer el contenido del archivo como una URL de datos
        reader.readAsDataURL(file);
    } else {
        // Si no se seleccionó ningún archivo, mostrar un mensaje de error
        alert("Por favor, selecciona una imagen antes de hacer clic en Predecir.");
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');

    signUpButton.addEventListener('click', () => {
        container.classList.add("right-panel-active");
    });

    signInButton.addEventListener('click', () => {
        container.classList.remove("right-panel-active");
    });

});


