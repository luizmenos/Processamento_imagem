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
            var canvas = document.getElementById('canvasResultado');
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
            document.querySelector('.resultado').classList.remove('d-none');
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

                            var f1 = pixels1[index] + pixels2[index];
                            var f2 = pixels1[index + 1] + pixels2[index + 1];
                            var f3 = pixels1[index + 2] + pixels2[index + 2];

                            var f_min = 0;
                            var f_max = 255;

                            var r = (255 / (f_max - f_min)) * (f1 - f_min);
                            var g = (255 / (f_max - f_min)) * (f2 - f_min);
                            var b = (255 / (f_max - f_min)) * (f3 - f_min);


                            r = Math.round(r);
                            g = Math.round(g);
                            b = Math.round(b);

                            //var r = Math.max(0, Math.min(255, pixels1[index] + pixels2[index]));
                            // var g = Math.max(0, Math.min(255, pixels1[index + 1] + pixels2[index + 1]));
                            //var b = Math.max(0, Math.min(255, pixels1[index + 2] + pixels2[index + 2]));
                            row.push([r, g, b]);
                        }
                        matrixSubt.push(row);
                    }


                    var canvas = document.getElementById('canvasResultado');
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

                    document.querySelector('.resultado').classList.remove('d-none');

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

                            var f1 = pixels1[index] - pixels2[index];
                            var f2 = pixels1[index + 1] - pixels2[index + 1];
                            var f3 = pixels1[index + 2] - pixels2[index + 2];

                            var f_min = 0;
                            var f_max = 255;

                            var r = (255 / (f_max - f_min)) * (f1 - f_min);
                            var g = (255 / (f_max - f_min)) * (f2 - f_min);
                            var b = (255 / (f_max - f_min)) * (f3 - f_min);


                            r = Math.round(r);
                            g = Math.round(g);
                            b = Math.round(b);

                            //    var r = Math.max(0, Math.min(255, pixels1[index] - pixels2[index]));
                            //   var g = Math.max(0, Math.min(255, pixels1[index + 1] - pixels2[index + 1]));
                            //  var b = Math.max(0, Math.min(255, pixels1[index + 2] - pixels2[index + 2]));
                            row.push([r, g, b]);
                        }
                        matrixSubt.push(row);
                    }

                    var canvas = document.getElementById('canvasResultado');
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

                    document.querySelector('.resultado').classList.remove('d-none');
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
            var canvas = document.getElementById('canvasResultado');
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
            document.querySelector('.resultado').classList.remove('d-none');
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
            var canvas = document.getElementById('canvasResultado');
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

            document.querySelector('.resultado').classList.remove('d-none');
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

                    var canvas = document.getElementById('canvasResultado');
                    var ctx = canvas.getContext('2d');

                    canvas.width = maxWidth * 2;
                    canvas.height = maxHeight;

                    ctx.drawImage(img1, 0, 0, img1.width * widthRatio1, img1.height * heightRatio1);
                    ctx.drawImage(img2, maxWidth, 0, img2.width * widthRatio2, img2.height * heightRatio2);

                    var imageDataURL = canvas.toDataURL();

                    document.querySelector('.resultado').classList.remove('d-none');
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
        alert("Por favor, insira um intervalo vÃ¡lido para linhas e colunas.");
        return false;
    }

    var width = 0, height = 0;

    var linhaInicial = linhas[0] === "" ? 0 : parseInt(linhas[0]);
    var linhaFinal = linhas[1] === "" ? undefined : parseInt(linhas[1]);

    var colunaInicial = colunas[0] === "" ? 0 : parseInt(colunas[0]);
    var colunaFinal = colunas[1] === "" ? undefined : parseInt(colunas[1]);

    if (linhaFinal != undefined & linhaInicial != 0) {
        if (linhaInicial > linhaFinal) { alert("Por favor, insira um intervalo vÃ¡lido para linhas."); return false; }
    }
    if (colunaFinal != undefined & colunaInicial != 0) {
        if (colunaInicial > colunaFinal) { alert("Por favor, insira um intervalo vÃ¡lido para colunas."); return false; }
    }


    var fileReader = new FileReader();
    fileReader.onload = function (evt) {
        var image = new Image();
        image.onload = function () {

            var canvas = document.getElementById('canvasResultado');
            var context = canvas.getContext('2d');

            width = colunaFinal !== undefined ? colunaFinal - colunaInicial : image.width - colunaInicial;
            height = linhaFinal !== undefined ? linhaFinal - linhaInicial : image.height - linhaInicial;
            canvas.width = width;
            canvas.height = height;

            context.drawImage(image, colunaInicial, linhaInicial, width, height, 0, 0, width, height);
            document.querySelector('.resultado').classList.remove('d-none');

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

    var inputNumber = prompt("Insira o valor do limiar, sendo de 0 Ã  255");
    var limiar = parseInt(inputNumber);
    if (isNaN(limiar) || (limiar > 255 || limiar < 0)) {
        alert('Digite um nÃºmero vÃ¡lido.');
        return;
    }

    var reader = new FileReader();
    reader.onload = function (evt) {
        var dataURL = reader.result;

        var img = new Image();


        img.onload = function () {
            var canvas = document.getElementById('canvasResultado');
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
            document.querySelector('.resultado').classList.remove('d-none');
            downloadImage(imageDataURL, 'limiar');
        };
        img.src = dataURL;
    };
    reader.readAsDataURL(input.files[0]);
}

function equalizarImagem() {

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
            var canvas = document.getElementById('canvasResultado');
            var ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);

            var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var histogramasPre = calcularHistograma(imageData);

            equalizarHistograma(imageData, histogramasPre);

            ctx.putImageData(imageData, 0, 0);

            var histogramasPos = calcularHistograma(imageData);
            atualizarHistogramaGrafico(histogramasPre, histogramasPos);

            var imageDataURL = canvas.toDataURL();
            document.querySelector('.resultado').classList.remove('d-none');
            downloadImage(imageDataURL, 'equalizacao');

        };
        img.src = dataURL;
    };
    reader.readAsDataURL(input.files[0]);
}

function and() {
    var input1 = document.getElementById('arquivoInput').files[0];
    var input2 = document.getElementById('arquivoInput2').files[0];

    if (!input1 || !input2) {
        alert('Selecione duas imagens para realizar a operação lógica AND.');
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

                    var matrixAnd = [];
                    for (var y = 0; y < maxHeight; y++) {
                        var row = [];
                        for (var x = 0; x < maxWidth; x++) {
                            var index = (y * maxWidth + x) * 4;

                            var pixel1 = (pixels1[index] + pixels1[index + 1] + pixels1[index + 2]) / 3 >= 128 ? 255 : 0;
                            var pixel2 = (pixels2[index] + pixels2[index + 1] + pixels2[index + 2]) / 3 >= 128 ? 255 : 0;


                            var resultPixel = pixel1 & pixel2;

                            row.push([resultPixel, resultPixel, resultPixel]);
                        }
                        matrixAnd.push(row);
                    }

                    var canvas = document.getElementById('canvasResultado');
                    var ctx = canvas.getContext('2d');

                    canvas.width = maxWidth;
                    canvas.height = maxHeight;

                    ctx.clearRect(0, 0, maxWidth, maxHeight);
                    for (var y = 0; y < maxHeight; y++) {
                        for (var x = 0; x < maxWidth; x++) {
                            var pixel = matrixAnd[y][x];
                            ctx.fillStyle = 'rgb(' + pixel[0] + ',' + pixel[1] + ',' + pixel[2] + ')';
                            ctx.fillRect(x, y, 1, 1);
                        }
                    }

                    document.querySelector('.resultado').classList.remove('d-none');
                    downloadImage(canvas.toDataURL(), 'and');
                };

                img2.src = evt2.target.result;
            };

            img1.src = evt.target.result;
        };

        reader2.readAsDataURL(input2);
    };

    reader1.readAsDataURL(input1);
}





function or() {
    var input1 = document.getElementById('arquivoInput').files[0];
    var input2 = document.getElementById('arquivoInput2').files[0];

    if (!input1 || !input2) {
        alert('Selecione duas imagens para realizar a operação lógica OR.');
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

                    var matrixOr = [];
                    for (var y = 0; y < maxHeight; y++) {
                        var row = [];
                        for (var x = 0; x < maxWidth; x++) {
                            var index = (y * maxWidth + x) * 4;

                            var pixel1 = (pixels1[index] + pixels1[index + 1] + pixels1[index + 2]) / 3 >= 128 ? 255 : 0;
                            var pixel2 = (pixels2[index] + pixels2[index + 1] + pixels2[index + 2]) / 3 >= 128 ? 255 : 0;

                            var resultPixel = pixel1 | pixel2;

                            row.push([resultPixel, resultPixel, resultPixel]);
                        }
                        matrixOr.push(row);
                    }

                    var canvas = document.getElementById('canvasResultado');
                    var ctx = canvas.getContext('2d');

                    canvas.width = maxWidth;
                    canvas.height = maxHeight;

                    ctx.clearRect(0, 0, maxWidth, maxHeight);
                    for (var y = 0; y < maxHeight; y++) {
                        for (var x = 0; x < maxWidth; x++) {
                            var pixel = matrixOr[y][x];
                            ctx.fillStyle = 'rgb(' + pixel[0] + ',' + pixel[1] + ',' + pixel[2] + ')';
                            ctx.fillRect(x, y, 1, 1);
                        }
                    }

                    document.querySelector('.resultado').classList.remove('d-none');
                    downloadImage(canvas.toDataURL(), 'or');
                };

                img2.src = evt2.target.result;
            };

            img1.src = evt.target.result;
        };

        reader2.readAsDataURL(input2);
    };

    reader1.readAsDataURL(input1);
}


function not() {
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
            var canvas = document.getElementById('canvasResultado');
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
                    if (gray <= 128) {
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
            document.querySelector('.resultado').classList.remove('d-none');
            downloadImage(imageDataURL, 'not');
        };
        img.src = dataURL;
    };
    reader.readAsDataURL(input.files[0]);
}

function xor() {
    var input1 = document.getElementById('arquivoInput').files[0];
    var input2 = document.getElementById('arquivoInput2').files[0];

    if (!input1 || !input2) {
        alert('Selecione duas imagens para realizar a operação lógica XOR.');
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

                    var matrixOr = [];
                    for (var y = 0; y < maxHeight; y++) {
                        var row = [];
                        for (var x = 0; x < maxWidth; x++) {
                            var index = (y * maxWidth + x) * 4;

                            var pixel1 = (pixels1[index] + pixels1[index + 1] + pixels1[index + 2]) / 3 >= 128 ? 255 : 0;
                            var pixel2 = (pixels2[index] + pixels2[index + 1] + pixels2[index + 2]) / 3 >= 128 ? 255 : 0;

                            var resultPixel = pixel1 ^ pixel2;

                            row.push([resultPixel, resultPixel, resultPixel]);
                        }
                        matrixOr.push(row);
                    }

                    var canvas = document.getElementById('canvasResultado');
                    var ctx = canvas.getContext('2d');

                    canvas.width = maxWidth;
                    canvas.height = maxHeight;

                    ctx.clearRect(0, 0, maxWidth, maxHeight);
                    for (var y = 0; y < maxHeight; y++) {
                        for (var x = 0; x < maxWidth; x++) {
                            var pixel = matrixOr[y][x];
                            ctx.fillStyle = 'rgb(' + pixel[0] + ',' + pixel[1] + ',' + pixel[2] + ')';
                            ctx.fillRect(x, y, 1, 1);
                        }
                    }

                    document.querySelector('.resultado').classList.remove('d-none');
                    downloadImage(canvas.toDataURL(), 'or');
                };

                img2.src = evt2.target.result;
            };

            img1.src = evt.target.result;
        };

        reader2.readAsDataURL(input2);
    };

    reader1.readAsDataURL(input1);
}


function dividirImagem() {
    var input = document.getElementById('arquivoInput');
    if (!input.files[0]) {
        alert('Selecione uma imagem para dividir.');
        return;
    }

    var divisor = parseInt(
        prompt("Insira um valor para realizar a divisão da imagem"));

    if (isNaN(divisor) || divisor > 255 || divisor < 0) {
        alert("Valor inválido");
        return;
    }
    var reader = new FileReader();
    reader.onload = function (evt) {
        var dataURL = reader.result;

        var img = new Image();
        img.onload = function () {
            var canvas = document.getElementById('canvasResultado');
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
                    var r = pixels[index] / divisor;
                    var g = pixels[index + 1] / divisor;
                    var b = pixels[index + 2] / divisor;

                    r = Math.round(r);
                    g = Math.round(g);
                    b = Math.round(b);

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
            document.querySelector('.resultado').classList.remove('d-none');
            downloadImage(imageDataURL, 'divisao');
        };
        img.src = dataURL;
    };
    reader.readAsDataURL(input.files[0]);
}

function multiplicarImagem() {

    var input = document.getElementById('arquivoInput');
    if (!input.files[0]) {
        alert('Selecione uma imagem para multiplicar.');
        return;
    }

    var divisor = parseInt(
        prompt("Insira um valor para realizar a multiplicação da imagem"));

    if (isNaN(divisor) || divisor > 255 || divisor < 0) {
        alert("Valor inválido");
        return;
    }
    var reader = new FileReader();
    reader.onload = function (evt) {
        var dataURL = reader.result;

        var img = new Image();
        img.onload = function () {
            var canvas = document.getElementById('canvasResultado');
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
                    var r = pixels[index] * divisor;
                    var g = pixels[index + 1] * divisor;
                    var b = pixels[index + 2] * divisor;

                    r = Math.round(r);
                    g = Math.round(g);
                    b = Math.round(b);

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
            document.querySelector('.resultado').classList.remove('d-none');
            downloadImage(imageDataURL, 'multiplicacao');
        };
        img.src = dataURL;
    };
    reader.readAsDataURL(input.files[0]);

}

function somarConst() {
    var input = document.getElementById('arquivoInput');
    if (!input.files[0]) {
        alert('Selecione uma imagem para processar.');
        return;
    }

    var inputNumber = prompt("Insira o valor para somar, sendo de 0 a 255");
    var somar = parseInt(inputNumber);
    if (isNaN(somar) || (somar > 255 || somar < 0)) {
        alert('Digite um número válido.');
        return;
    }

    var reader = new FileReader();
    reader.onload = function (evt) {
        var dataURL = reader.result;


        var img = new Image();

        img.onload = function () {
            var canvas = document.getElementById('canvasResultado');
            var ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);

            var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var pixels = imageData.data;

            var matrixSubt = [];
            for (var y = 0; y < canvas.height; y++) {
                var row = [];
                for (var x = 0; x < canvas.width; x++) {
                    var index = (y * canvas.width + x) * 4;

                    var f1 = pixels[index] + somar;
                    var f2 = pixels[index + 1] + somar;
                    var f3 = pixels[index + 2] + somar;

                    var f_min = 0;
                    var f_max = 255;

                    var r = (255 / (f_max - f_min)) * (f1 - f_min);
                    var g = (255 / (f_max - f_min)) * (f2 - f_min);
                    var b = (255 / (f_max - f_min)) * (f3 - f_min);


                    r = Math.round(r);
                    g = Math.round(g);
                    b = Math.round(b);

                    row.push([r, g, b]);
                }
                matrixSubt.push(row);
            }


            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (var y = 0; y < canvas.height; y++) {
                for (var x = 0; x < canvas.width; x++) {
                    var pixel = matrixSubt[y][x];
                    ctx.fillStyle = 'rgb(' + pixel[0] + ',' + pixel[1] + ',' + pixel[2] + ')';
                    ctx.fillRect(x, y, 1, 1);
                }
            }

            var imageDataURL = canvas.toDataURL();
            document.querySelector('.resultado').classList.remove('d-none');
            downloadImage(imageDataURL, 'somarConst');
        };
        img.src = dataURL;
    };
    reader.readAsDataURL(input.files[0]);
}



function subtrairConst() {
    var input = document.getElementById('arquivoInput');
    if (!input.files[0]) {
        alert('Selecione uma imagem para processar.');
        return;
    }

    var inputNumber = prompt("Insira o valor para subtrair, sendo de 0 a 255");
    var sub = parseInt(inputNumber);
    if (isNaN(sub) || (sub > 255 || sub < 0)) {
        alert('Digite um número válido.');
        return;
    }

    var reader = new FileReader();
    reader.onload = function (evt) {
        var dataURL = reader.result;


        var img = new Image();

        img.onload = function () {
            var canvas = document.getElementById('canvasResultado');
            var ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);

            var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var pixels = imageData.data;

            var matrixSubt = [];
            for (var y = 0; y < canvas.height; y++) {
                var row = [];
                for (var x = 0; x < canvas.width; x++) {
                    var index = (y * canvas.width + x) * 4;

                    var f1 = pixels[index] - sub;
                    var f2 = pixels[index + 1] - sub;
                    var f3 = pixels[index + 2] - sub;

                    var f_min = 0;
                    var f_max = 255;

                    var r = (255 / (f_max - f_min)) * (f1 - f_min);
                    var g = (255 / (f_max - f_min)) * (f2 - f_min);
                    var b = (255 / (f_max - f_min)) * (f3 - f_min);


                    r = Math.round(r);
                    g = Math.round(g);
                    b = Math.round(b);

                    row.push([r, g, b]);
                }
                matrixSubt.push(row);
            }


            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (var y = 0; y < canvas.height; y++) {
                for (var x = 0; x < canvas.width; x++) {
                    var pixel = matrixSubt[y][x];
                    ctx.fillStyle = 'rgb(' + pixel[0] + ',' + pixel[1] + ',' + pixel[2] + ')';
                    ctx.fillRect(x, y, 1, 1);
                }
            }

            var imageDataURL = canvas.toDataURL();
            document.querySelector('.resultado').classList.remove('d-none');
            downloadImage(imageDataURL, 'somarConst');
        };
        img.src = dataURL;
    };
    reader.readAsDataURL(input.files[0]);
}

function blendImagem() {
    var input1 = document.getElementById('arquivoInput').files[0];
    var input2 = document.getElementById('arquivoInput2').files[0];

    if (!input1 || !input2) {
        alert('Selecione duas imagens para aplicar a Combinação Linear.');
        return;
    }

    var inputNumber = prompt("Insira o valor para a Taxa de Mistura, sendo de 0.0 a 1.0");
    var sub = parseFloat(inputNumber);
    if (isNaN(sub) || (sub > 1 || sub < 0)) {
        alert('Digite um número válido.');
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

                            r = sub * pixels1[index] + (1 - sub) * pixels2[index];
                            g = sub * pixels1[index + 1] + (1 - sub) * pixels2[index + 1];
                            b = sub * pixels1[index + 2] + (1 - sub) * pixels2[index + 2];

                            r = Math.round(r);
                            g = Math.round(g);
                            b = Math.round(b);


                            row.push([r, g, b]);
                        }
                        matrixSubt.push(row);
                    }

                    var canvas = document.getElementById('canvasResultado');
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

                    document.querySelector('.resultado').classList.remove('d-none');
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
function convolucaoMin() {
    var input1 = document.getElementById('arquivoInput').files[0];

    if (!input1) {
        alert('Selecione uma imagem para aplicar a Convolução');
        return;
    }

    var inputNumber = prompt("Insira o tamanho do Kernel (3, 5, 7, 11)");
    var kernelSize = parseInt(inputNumber);
    if (isNaN(kernelSize) || ![3, 5, 7, 11].includes(kernelSize)) {
        alert('Digite um tamanho de kernel válido.');
        return;
    }

    var reader1 = new FileReader();

    reader1.onload = function (evt) {
        var img1 = new Image();

        img1.onload = function () {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');

            canvas.width = img1.width;
            canvas.height = img1.height;
            ctx.drawImage(img1, 0, 0);

            var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var filteredImageData = minFilterManual(imageData, canvas.width, canvas.height, kernelSize);

            canvas.width = filteredImageData.width;
            canvas.height = filteredImageData.height;
            ctx.putImageData(filteredImageData, 0, 0);

            var canvasResultado = document.getElementById('canvasResultado');
            var ctxResultado = canvasResultado.getContext('2d');

            canvasResultado.width = canvas.width;
            canvasResultado.height = canvas.height;

            ctxResultado.clearRect(0, 0, canvasResultado.width, canvasResultado.height);
            for (var y = 0; y < canvasResultado.height; y++) {
                for (var x = 0; x < canvasResultado.width; x++) {
                    var index = (y * canvasResultado.width + x) * 4;
                    var r = filteredImageData.data[index];
                    var g = filteredImageData.data[index + 1];
                    var b = filteredImageData.data[index + 2];
                    ctxResultado.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
                    ctxResultado.fillRect(x, y, 1, 1);
                }
            }

            var imageDataURL = canvasResultado.toDataURL();
            document.querySelector('.resultado').classList.remove('d-none');
            downloadImage(imageDataURL, 'convolucao_min');
        };

        img1.src = evt.target.result;
    };

    reader1.readAsDataURL(input1);
}

function minFilterManual(imageData, width, height, kernelSize) {
    let k = Math.floor(kernelSize / 2);
    let filteredData = new Uint8ClampedArray(imageData.data.length);

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            let min = 255;

            for (let x = -k; x <= k; x++) {
                for (let y = -k; y <= k; y++) {
                    let ii = Math.min(Math.max(i + x, 0), height - 1);
                    let jj = Math.min(Math.max(j + y, 0), width - 1);
                    let index = (ii * width + jj) * 4;
                    let pixelValue = imageData.data[index];

                    if (pixelValue < min) {
                        min = pixelValue;
                    }
                }
            }

            let index = (i * width + j) * 4;
            filteredData[index] = min; // R
            filteredData[index + 1] = min; // G
            filteredData[index + 2] = min; // B
        }
    }

    return new ImageData(filteredData, width, height);
}
function calcularHistograma(imageData) {
    var pixels = imageData.data;
    var histogramaR = Array.from({ length: 256 }, () => 0);
    var histogramaG = Array.from({ length: 256 }, () => 0);
    var histogramaB = Array.from({ length: 256 }, () => 0);

    for (var i = 0; i < pixels.length; i += 4) {
        var r = pixels[i];
        var g = pixels[i + 1];
        var b = pixels[i + 2];

        histogramaR[r]++;
        histogramaG[g]++;
        histogramaB[b]++;
    }

    return [histogramaR, histogramaG, histogramaB];
}

function equalizarHistograma(imageData, histogramas) {
    var pixels = imageData.data;
    var totalPixels = imageData.width * imageData.height;
    var acumuladoHistogramaR = new Array(256).fill(0);
    var acumuladoHistogramaG = new Array(256).fill(0);
    var acumuladoHistogramaB = new Array(256).fill(0);

    acumuladoHistogramaR[0] = histogramas[0][0];
    acumuladoHistogramaG[0] = histogramas[1][0];
    acumuladoHistogramaB[0] = histogramas[2][0];

    for (var i = 1; i < 256; i++) {
        acumuladoHistogramaR[i] = acumuladoHistogramaR[i - 1] + histogramas[0][i];
        acumuladoHistogramaG[i] = acumuladoHistogramaG[i - 1] + histogramas[1][i];
        acumuladoHistogramaB[i] = acumuladoHistogramaB[i - 1] + histogramas[2][i];
    }

    for (var i = 0; i < pixels.length; i += 4) {
        var intensidadeR = pixels[i];
        var intensidadeG = pixels[i + 1];
        var intensidadeB = pixels[i + 2];

        var novoValorR = acumuladoHistogramaR[intensidadeR] * 255 / totalPixels;
        var novoValorG = acumuladoHistogramaG[intensidadeG] * 255 / totalPixels;
        var novoValorB = acumuladoHistogramaB[intensidadeB] * 255 / totalPixels;

        pixels[i] = novoValorR;
        pixels[i + 1] = novoValorG;
        pixels[i + 2] = novoValorB;
    }
}


function atualizarHistogramaGrafico(histogramaPre, histogramaPos) {
    destroyCharts();
    var count = 0;
    document.querySelectorAll('canvas[id^="histogramaCanvas"]').forEach((canvas) => {
        var ctx = canvas.getContext('2d');
        if (count == 0) {
            window.chartPre = newChart(histogramaPre, ctx, count);
        } else {
            window.chartPos = newChart(histogramaPos, ctx, count);
        }
        canvas.classList.remove('d-none');
        count++;
    })
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
    var link = document.querySelector('.resultado #salvarImagem');
    link.download = 'imagem_' + metodo + '.jpg';
    link.href = imageData;
}

function newChart(histogramas, ctx, cont) {
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array.from({ length: 256 }, (_, i) => i.toString()),
            datasets: [
                {
                    label: 'R',
                    data: histogramas[0],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: 'G',
                    data: histogramas[1],
                    backgroundColor: 'rgba(75, 255, 192, 0.2)',
                    borderColor: 'rgba(75, 255, 192, 1)',
                    borderWidth: 1
                },
                {
                    label: 'B',
                    data: histogramas[2],
                    backgroundColor: 'rgba(54, 162, 255, 0.2)',
                    borderColor: 'rgba(54, 162, 255, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: cont == 0 ? 'Pr\u{00E9}-Equaliza\u{00E7}\u{00E3}o' : 'P\u{00F3}s-Equaliza\u{00E7}\u{00E3}o'
                }
            },
            scales: {
                x: {
                    ticks: { stepSize: 1 }
                },
                y: {
                    beginAtZero: true
                }
            }
        }

    })
}

function destroyCharts() {
    var quantGraficos = document.querySelectorAll('.canvasGrafico:not(.d-none)').length;

    if (quantGraficos >= 2) {
        window.chartPre.destroy();
        window.chartPos.destroy();
    }

}
