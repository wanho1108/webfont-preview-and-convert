const fs = require('fs');
const fontkit = require('fontkit');
const src = './upload/NotoSansCJKkr-Regular.ttf';

const font = fontkit.openSync(src);
const fontCharacters = font.characterSet;
let fontCharactersDecoding;

fontCharactersDecoding = fontCharacters.map((character) => {
  return String.fromCharCode(character);
});

console.log(fontCharactersDecoding);