function imagem1(file) {
    var input = file.target;
    var reader = new FileReader();
    reader.onload = function(evt) {
        var dataURL = reader.result;
        var output = document.getElementById('first-image');
        output.src = dataURL;

        var row = document.querySelector('.row-images');
        row.classList.remove('d-none');
    }
    reader.readAsDataURL(input.files[0]);
}

function imagem2(file) {
    var input = file.target;
    var reader = new FileReader();
    reader.onload = function(evt) {
        var dataURL = reader.result;
        var output = document.getElementById('second-image');
        output.src = dataURL;

        var row = document.querySelector('.row-images');
        row.classList.remove('d-none');
    }
    reader.readAsDataURL(input.files[0]);
}

function inverterImagem() {
    var input = document.getElementById('arquivoInput');
    if (!input.files[0]) {
        alert('Selecione uma imagem para processar.');
        return;
    }

    var reader = new FileReader();
    reader.onload = function(evt) {
        var dataURL = reader.result;
        var output = document.getElementById('output');
        output.src = dataURL;

        var img = new Image();

        document.querySelector('.inversao').classList.remove('d-none');
        img.onload = function() {
            var canvas = document.getElementById('canvasOutput');
            var ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);

            var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var pixels = imageData.data;

            var matrix_inv = [];
            for (var y = 0; y < canvas.height; y++) {
                var row = [];
                for (var x = 0; x < canvas.width; x++) {
                    var index = (y * canvas.width + x) * 4;
                    var r = 255 - pixels[index];
                    var g = 255 - pixels[index + 1];
                    var b = 255 - pixels[index + 2];
                    row.push([r, g, b]);
                }
                matrix_inv.push(row);
            }


            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (var y = 0; y < canvas.height; y++) {
                for (var x = 0; x < canvas.width; x++) {
                    var pixel = matrix_inv[y][x];
                    ctx.fillStyle = 'rgb(' + pixel[0] + ',' + pixel[1] + ',' + pixel[2] + ')';
                    ctx.fillRect(x, y, 1, 1);
                }
            }
        };
        img.src = dataURL;
    };
    reader.readAsDataURL(input.files[0]);
}

function somarImagens() {
    var input1 = document.getElementById('arquivoInput').files[0];
    var input2 = document.getElementById('arquivoInput2').files[0];

    if (!input1 || !input2) {
        alert('Selecione duas imagens para somar.');
        return;
    }

    var reader1 = new FileReader();
    var reader2 = new FileReader();

    reader1.onload = function(evt) {
        reader2.onload = function(evt2) {
            var img1 = new Image();
            var img2 = new Image();

            img1.onload = function() {
                img2.onload = function() {
                    var maxWidth = Math.max(img1.width, img2.width);
                    var maxHeight = Math.max(img1.height, img2.height);

                    var resizedImage1 = resizeImageToMatchSize(img1, maxWidth, maxHeight);
                    var resizedImage2 = resizeImageToMatchSize(img2, maxWidth, maxHeight);

                    var ctx1 = resizedImage1.getContext('2d');
                    var ctx2 = resizedImage2.getContext('2d');

                    var imageData1 = ctx1.getImageData(0, 0, maxWidth, maxHeight);
                    var imageData2 = ctx2.getImageData(0, 0, maxWidth, maxHeight);

                    var pixels1 = imageData1.data;
                    var pixels2 = imageData2.data;

                    var matrixSubt = [];
                    for (var y = 0; y < maxHeight; y++) {
                        var row = [];
                        for (var x = 0; x < maxWidth; x++) {
                            var index = (y * maxWidth + x) * 4;
                            var r = Math.max(0, Math.min(255, pixels1[index] + pixels2[index]));
                            var g = Math.max(0, Math.min(255, pixels1[index + 1] + pixels2[index + 1]));
                            var b = Math.max(0, Math.min(255, pixels1[index + 2] + pixels2[index + 2]));
                            row.push([r, g, b]);
                        }
                        matrixSubt.push(row);
                    }

                    var canvas = document.getElementById('canvasSoma');
                    var ctx = canvas.getContext('2d');

                    canvas.width = maxWidth;
                    canvas.height = maxHeight;

                    ctx.clearRect(0, 0, maxWidth, maxHeight);
                    for (var y = 0; y < maxHeight; y++) {
                        for (var x = 0; x < maxWidth; x++) {
                            var pixel = matrixSubt[y][x];
                            ctx.fillStyle = 'rgb(' + pixel[0] + ',' + pixel[1] + ',' + pixel[2] + ')';
                            ctx.fillRect(x, y, 1, 1);
                        }
                    }
                    document.querySelector('.soma').classList.remove('d-none');
                };

                img2.src = evt2.target.result;
            };

            img1.src = evt.target.result;
        };

        reader2.readAsDataURL(input2);
    };

    reader1.readAsDataURL(input1);
}

function subtrairImagens() {
    var input1 = document.getElementById('arquivoInput').files[0];
    var input2 = document.getElementById('arquivoInput2').files[0];

    if (!input1 || !input2) {
        alert('Selecione duas imagens para subtrair.');
        return;
    }

    var reader1 = new FileReader();
    var reader2 = new FileReader();

    reader1.onload = function(evt) {
        reader2.onload = function(evt2) {
            var img1 = new Image();
            var img2 = new Image();

            img1.onload = function() {
                img2.onload = function() {


                    var maxWidth = Math.max(img1.width, img2.width);
                    var maxHeight = Math.max(img1.height, img2.height);

                    var resizedImage1 = resizeImageToMatchSize(img1, maxWidth, maxHeight);
                    var resizedImage2 = resizeImageToMatchSize(img2, maxWidth, maxHeight);

                    var ctx1 = resizedImage1.getContext('2d');
                    var ctx2 = resizedImage2.getContext('2d');

                    var imageData1 = ctx1.getImageData(0, 0, maxWidth, maxHeight);
                    var imageData2 = ctx2.getImageData(0, 0, maxWidth, maxHeight);

                    var pixels1 = imageData1.data;
                    var pixels2 = imageData2.data;

                    var matrixSubt = [];
                    for (var y = 0; y < maxHeight; y++) {
                        var row = [];
                        for (var x = 0; x < maxWidth; x++) {
                            var index = (y * maxWidth + x) * 4;
                            var r = Math.max(0, Math.min(255, pixels1[index] - pixels2[index]));
                            var g = Math.max(0, Math.min(255, pixels1[index + 1] - pixels2[index + 1]));
                            var b = Math.max(0, Math.min(255, pixels1[index + 2] - pixels2[index + 2]));
                            row.push([r, g, b]);
                        }
                        matrixSubt.push(row);
                    }

                    var canvas = document.getElementById('canvasSubtracao');
                    var ctx = canvas.getContext('2d');

                    canvas.width = maxWidth;
                    canvas.height = maxHeight;

                    ctx.clearRect(0, 0, maxWidth, maxHeight);
                    for (var y = 0; y < maxHeight; y++) {
                        for (var x = 0; x < maxWidth; x++) {
                            var pixel = matrixSubt[y][x];
                            ctx.fillStyle = 'rgb(' + pixel[0] + ',' + pixel[1] + ',' + pixel[2] + ')';
                            ctx.fillRect(x, y, 1, 1);
                        }
                    }

                    document.querySelector('.subtracao').classList.remove('d-none');
                };
                img2.src = evt2.target.result;
            };
            img1.src = evt.target.result;
        };
        reader2.readAsDataURL(input2);
    };
    reader1.readAsDataURL(input1);
}

function flipLR() {
    var input = document.getElementById('arquivoInput');
    if (!input.files[0]) {
        alert('Selecione uma imagem para processar.');
        return;
    }

    var reader = new FileReader();
    reader.onload = function(evt) {
        var dataURL = reader.result;


        var img = new Image();

        img.onload = function() {
            var canvas = document.getElementById('canvasFlipLR');
            var ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);

            var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var pixels = imageData.data;

            var matrix_inv = [];
            for (var y = 0; y < canvas.height; y++) {
                var row = [];
                for (var x = 0; x < canvas.width; x++) {
                    var indexDireita = (y * canvas.width + (canvas.width - 1 - x)) * 4;

                    var r = pixels[indexDireita];
                    var g = pixels[indexDireita + 1];
                    var b = pixels[indexDireita + 2];
                    row.push([r, g, b]);
                }
                matrix_inv.push(row);
            }


            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (var y = 0; y < canvas.height; y++) {
                for (var x = 0; x < canvas.width; x++) {
                    var pixel = matrix_inv[y][x];
                    ctx.fillStyle = 'rgb(' + pixel[0] + ',' + pixel[1] + ',' + pixel[2] + ')';
                    ctx.fillRect(x, y, 1, 1);
                }
            }

            document.querySelector('.flipLR').classList.remove('d-none');
        };
        img.src = dataURL;
    };
    reader.readAsDataURL(input.files[0]);
}

function resizeImageToMatchSize(image, maxWidth, maxHeight) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    var width = image.width;
    var height = image.height;

    var ratio = 1;
    if (width > maxWidth || height > maxHeight) {
        ratio = Math.min(maxWidth / width, maxHeight / height);
    }

    canvas.width = maxWidth * ratio;
    canvas.height = maxHeight * ratio;

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    return canvas;
}