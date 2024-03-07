

// check if the browser supports the gooses emoji
const ctx = document.createElement("canvas").getContext("2d");
ctx.canvas.width = ctx.canvas.height = 1;
ctx.fillText("🪿", -4, 4);
var emojiSupported = ctx.getImageData(0, 0, 1, 1).data[3] > 0;

if (emojiSupported === false) {
    // replace the gooses emoji with a duck emoji
    $('.goose').html('🦆');
}


$('#submit').on('click', function () {
    // reset pyramid and goose number
    $('#goosePyramid').empty();
    $('#gooseNumber').text('0');

    var weight = $('#weight').val();

    // check if the weight is empty
    if (weight === '') {
        alert('Nichts? Gar nichts? Nada? Niente? Nothing?');
        return;
    }

    // check if the weight is a number
    if (isNaN(weight)) {
        alert('Du kannst Buchstaben heben? Krass!');
        return;
    }

    // check if the weight is a positive number
    if (weight <= 0) {
        alert('Du hebst negative Gewichte? Du Lauch!');
        return;
    }

    // check if weight is too high
    var tooHigh = false;
    if (weight > 99000) {
        // ask the user if they want to continue
        var r = confirm('Bei zu hohen Eingaben wird die grafische Darstellung deaktivert, da sonst die Seite abstürzen könnte. Möchtest du fortfahren?');
        if (r === false) {
            return;
        }
        tooHigh = true;
    }

    // calculate the number of gooses
    var gooses = weight / 4.5;
    gooses = Math.floor(gooses);

    if (weight < 4.5) {
        gooses = 0;
    }

    // calculate the number of flocks
    var flocks = gooses / 8;
    flocks = Math.floor(flocks);

    // calculate the number of n-benchpresses
    var nbenchpresses = weight / 120;
    nbenchpresses = Math.round(nbenchpresses * 100) / 100;
    nbenchpresses = nbenchpresses.toString().replace('.', ',');

    // display the result
    $('#gooseNumber').text(gooses);
    $('#nbenchpressesNumber').text(nbenchpresses);
    $('#weightNumber').text(weight);
    $('#flockNumber').text(flocks);

    if (tooHigh === false) {
        const maxHeight = 4; // maximum height of the pyramid (number of rows)

        let remainingGooses = gooses;

        for (let i = 1; i <= maxHeight; i++) {
            // calculate the number of gooses in the current row
            let goosesInRow = Math.min(2 * i - 1, remainingGooses);

            remainingGooses -= goosesInRow;

            let str = ' '.repeat(maxHeight - i);
            if (emojiSupported === true) {
                var str2 = '🪿'.repeat(goosesInRow);
            } else {
                var str2 = '🦆'.repeat(goosesInRow);
            }

            $('#goosePyramid').append('<span class="fs-1">' + str + str2 + str + '</span><br>');
        }
        // check if there are remaining gooses
        if (remainingGooses > 0) {
            // add the remaining gooses to the last row (max length of the row is 9 --> then new row)
            while (remainingGooses > 0) {
                if (remainingGooses > 7) {
                    if (emojiSupported === true) {
                        $('#goosePyramid').append('<span class="fs-1">🪿🪿🪿🪿🪿🪿🪿</span><br>');
                    } else {
                        $('#goosePyramid').append('<span class="fs-1">🦆🦆🦆🦆🦆🦆🦆</span><br>');
                    }
                    remainingGooses -= 7;
                } else {
                    let windEmoji = 7 - remainingGooses;
                    if (emojiSupported === true) {
                        $('#goosePyramid').append('<span class="fs-1">🪿'.repeat(remainingGooses) + '💨'.repeat(windEmoji) + '</span><br>');
                    } else {
                        $('#goosePyramid').append('<span class="fs-1">🦆'.repeat(remainingGooses) + '💨'.repeat(windEmoji) + '</span><br>');
                    }
                    remainingGooses = 0;
                }
            }
        }
    }

    // show the result modal
    $('#modalResult').modal('show');
});

function shareResult() {
    // get the number of gooses
    var gooses = $('#gooseNumber').text();

    // share the result
    var text = 'Ich kann ' + gooses + ' Gänse auf der Bank drücken! 💪🪿 ';
    text = text + ' Und du? 🤔 Finde es heraus auf:';
    text = text + 'https://benchpress2goose.de';
    var url = 'https://benchpress2goose.de';

    // use the web share API
    if (navigator.share) {
        navigator.share({
            title: 'Benchpress to Goose',
            text: text
        }).then(() => {
            console.log('Share was successful.');
        }).catch(console.error);
    } else {
        // if the web share API is not available, show a message
        alert('Teilen ist nicht möglich. 😢');
    }
}