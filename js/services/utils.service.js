'use strict'

function makeId(length = 5) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}

function getRandomInt(min, max) { // Inclusive
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

function getLorem(wordCount = 100) {
    const words = ['The Sky', 'Above', 'hello', 'was', 'under', 'sun', 'rainbow']
    var txt = ''
    for (var i = 0; i < wordCount; i++) {
        txt += words[getRandomInt(0, words.length - 1)] + ' '
    }
    return txt
}