from flask import Flask, request
from flask_cors import CORS

from tensorflow.keras.models import Sequential
from tensorflow.keras import layers
from PIL import Image
import numpy as np
import gradio as gr

# Crear la arquitectura del modelo
model = Sequential([
    layers.Rescaling(1./255, input_shape=(180, 180, 3)),
    layers.Conv2D(16, 3, padding='same', activation='relu'),
    layers.MaxPooling2D(),
    layers.Conv2D(32, 3, padding='same', activation='relu'),
    layers.MaxPooling2D(),
    layers.Conv2D(64, 3, padding='same', activation='relu'),
    layers.MaxPooling2D(),
    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dense(5, activation='softmax')
])

# Cargar los pesos del modelo
model.load_weights('flower_model_weights.h5')

def predict_image(img):
    img = Image.fromarray((img * 255).astype(np.uint8))  # Convertir de 0-1 a 0-255
    img = img.resize((180, 180))  # Ajustar el tamaño de la imagen según el modelo
    img_array = np.array(img) / 255.0  # Normalizar los píxeles
    img_array = np.expand_dims(img_array, axis=0)  # Agregar una dimensión para el lote
    
    # Realizar la predicción
    predictions = model.predict(img_array)
    predicted_class = np.argmax(predictions)
    
    # Convertir el índice de la clase predicha a una etiqueta de tipo string
    labels = ['Margarita', 'Diente de león', 'Rosa', 'Girasol', 'Tulipanes']  # Reemplaza esto con tus etiquetas reales
    predicted_label = labels[predicted_class]
    
    return {predicted_label: predictions[0][predicted_class]}


# Iniciar el servidor Flask labels = ['Margarita', 'Diente de león', 'Rosa', 'Girasol', 'Tulipanes']
app = Flask(__name__)
CORS(app)  # Configurar CORS en la aplicación Flask

@app.route('/')
def index():
    return '¡El servidor Flask está en funcionamiento!'

# Definir la interfaz de usuario
image_input = gr.components.Image()
label_output = gr.Label(num_top_classes=5)
interface = gr.Interface(fn=predict_image, inputs=image_input, outputs=label_output)

if __name__ == '__main__':
    interface.launch()
    app.run(debug=True)
