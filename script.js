function predict() {
    var formData = {
        sepalLength: $('#sepalLength').val(),
        sepalWidth: $('#sepalWidth').val(),
        petalLength: $('#petalLength').val(),
        petalWidth: $('#petalWidth').val()
    };

    $.ajax({
        type: 'POST',
        url: '/predict',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            $('#predictionResult').text('Clase predicha: ' + response.clase_predicha);
        },
        error: function(xhr, status, error) {
            alert('Error al realizar la predicción');
            console.error(error);
        }
    });
}
