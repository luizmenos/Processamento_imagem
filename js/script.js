function imagem1(file) {
    var input = file.target;
    var reader = new FileReader();
    reader.onload = function (evt) {
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
    reader.onload = function (evt) {
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
    reader.onload = function (evt) {
        var dataURL = reader.result;

        var img = new Image();


        img.onload = function () {
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
            var imageDataURL = canvas.toDataURL();
            document.querySelector('.inversao').classList.remove('d-none');
            downloadImage(imageDataURL, 'inversao');
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

    reader1.onload = function (evt) {
        reader2.onload = function (evt2) {
            var img1 = new Image();
            var img2 = new Image();

            img1.onload = function () {
                img2.onload = function () {
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
                    var imageDataURL = canvas.toDataURL();

                    document.querySelector('.soma').classList.remove('d-none');

                    downloadImage(imageDataURL, 'soma');
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

    reader1.onload = function (evt) {
        reader2.onload = function (evt2) {
            var img1 = new Image();
            var img2 = new Image();

            img1.onload = function () {
                img2.onload = function () {


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


                    var imageDataURL = canvas.toDataURL();

                    document.querySelector('.subtracao').classList.remove('d-none');
                    downloadImage(imageDataURL, 'subtracao');
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
    reader.onload = function (evt) {
        var dataURL = reader.result;


        var img = new Image();

        img.onload = function () {
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

            var imageDataURL = canvas.toDataURL();
            document.querySelector('.flipLR').classList.remove('d-none');
            downloadImage(imageDataURL, 'flipLR');
        };
        img.src = dataURL;
    };
    reader.readAsDataURL(input.files[0]);
}

function flipUD() {
    var input = document.getElementById('arquivoInput');
    if (!input.files[0]) {
        alert('Selecione uma imagem para processar.');
        return;
    }

    var reader = new FileReader();
    reader.onload = function (evt) {
        var dataURL = reader.result;

        var img = new Image();

        img.onload = function () {
            var canvas = document.getElementById('canvasFlipUD');
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
                    var indexUp = ((canvas.height - 1 - y) * canvas.width + x) * 4;

                    var r = pixels[indexUp];
                    var g = pixels[indexUp + 1];
                    var b = pixels[indexUp + 2];
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

            var imageDataURL = canvas.toDataURL();

            document.querySelector('.flipUD').classList.remove('d-none');
            downloadImage(imageDataURL, 'flipUD');
        };
        img.src = dataURL;
    };
    reader.readAsDataURL(input.files[0]);
}

function concatenarImagens() {
    var input1 = document.getElementById('arquivoInput').files[0];
    var input2 = document.getElementById('arquivoInput2').files[0];

    if (!input1 || !input2) {
        alert('Selecione duas imagens para concatenar.');
        return;
    }

    var reader1 = new FileReader();
    var reader2 = new FileReader();

    reader1.onload = function (evt) {
        reader2.onload = function (evt2) {
            var img1 = new Image();
            var img2 = new Image();

            img1.onload = function () {
                img2.onload = function () {
                    var maxWidth = Math.max(img1.width, img2.width);
                    var maxHeight = Math.max(img1.height, img2.height);
                    var widthRatio1 = maxWidth / img1.width;
                    var heightRatio1 = maxHeight / img1.height;
                    var widthRatio2 = maxWidth / img2.width;
                    var heightRatio2 = maxHeight / img2.height;

                    var canvas = document.getElementById('canvasConcatenacao');
                    var ctx = canvas.getContext('2d');

                    canvas.width = maxWidth * 2;
                    canvas.height = maxHeight;

                    ctx.drawImage(img1, 0, 0, img1.width * widthRatio1, img1.height * heightRatio1);
                    ctx.drawImage(img2, maxWidth, 0, img2.width * widthRatio2, img2.height * heightRatio2);

                    var imageDataURL = canvas.toDataURL();

                    document.querySelector('.concatenacao').classList.remove('d-none');
                    downloadImage(imageDataURL, 'concatenacao');
                };
                img2.src = evt2.target.result;
            };
            img1.src = evt.target.result;
        };
        reader2.readAsDataURL(input2);
    };
    reader1.readAsDataURL(input1);
}

function recortarImagem() {
    var input = document.getElementById('arquivoInput');

    if (!input.files[0]) {
        alert('Selecione uma imagem para processar.');
        return;
    }

    var linhas = prompt("Insira a linha inicial e final do arranjo (Ex: 0:5)");
    var colunas = prompt("Insira a coluna inicial e final do arranjo (Ex: 0:5)");

    linhas = linhas.split(':');
    colunas = colunas.split(':');

    if (linhas.length !== 2 || colunas.length !== 2) {
        alert("Por favor, insira um intervalo válido para linhas e colunas.");
        return false;
    }

    var width = 0, height = 0;

    var linhaInicial = linhas[0] === "" ? 0 : parseInt(linhas[0]);
    var linhaFinal = linhas[1] === "" ? undefined : parseInt(linhas[1]);

    var colunaInicial = colunas[0] === "" ? 0 : parseInt(colunas[0]);
    var colunaFinal = colunas[1] === "" ? undefined : parseInt(colunas[1]);

    if (linhaFinal != undefined & linhaInicial != 0) {
        if (linhaInicial > linhaFinal) { alert("Por favor, insira um intervalo válido para linhas."); return false; }
    }
    if (colunaFinal != undefined & colunaInicial != 0) {
        if (colunaInicial > colunaFinal) { alert("Por favor, insira um intervalo válido para colunas."); return false; }
    }


    var fileReader = new FileReader();
    fileReader.onload = function (evt) {
        var image = new Image();
        image.onload = function () {

            var canvas = document.getElementById('canvasRecorte');
            var context = canvas.getContext('2d');

            width = colunaFinal !== undefined ? colunaFinal - colunaInicial : image.width - colunaInicial;
            height = linhaFinal !== undefined ? linhaFinal - linhaInicial : image.height - linhaInicial;
            canvas.width = width;
            canvas.height = height;

            context.drawImage(image, colunaInicial, linhaInicial, width, height, 0, 0, width, height);
            document.querySelector('.recorte').classList.remove('d-none');

            var imageDataURL = canvas.toDataURL();
            downloadImage(imageDataURL, 'recorte');

        };
        image.src = evt.target.result;

    };
    fileReader.readAsDataURL(input.files[0]);
}

function limializarImagem() {
    var input = document.getElementById('arquivoInput');
    if (!input.files[0]) {
        alert('Selecione uma imagem para processar.');
        return;
    }

    var inputNumber = prompt("Insira o valor do limiar, sendo de 0 à 255");
    var limiar = parseInt(inputNumber);
    if (isNaN(limiar) || (limiar > 255 || limiar < 0)) {
        alert('Digite um número válido.');
        return;
    }

    var reader = new FileReader();
    reader.onload = function (evt) {
        var dataURL = reader.result;

        var img = new Image();


        img.onload = function () {
            var canvas = document.getElementById('canvasLimiar');
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
                    var r = pixels[index];
                    var g = pixels[index + 1];
                    var b = pixels[index + 2];

                    var gray = (r + g + b) / 3;
                    if (gray >= limiar) {
                        gray = 255;
                    } else {
                        gray = 0;
                    }

                    row.push([gray, gray, gray]);
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
            var imageDataURL = canvas.toDataURL();
            document.querySelector('.limiar').classList.remove('d-none');
            downloadImage(imageDataURL, 'limiar');
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

function downloadImage(imageData, metodo) {
    var link = document.querySelector('.' + metodo + ' #salvarImagem');
    link.download = 'imagem_' + metodo + '.jpg';
    link.href = imageData;
}