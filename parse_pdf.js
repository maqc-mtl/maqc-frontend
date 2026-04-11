const fs = require('fs');
const pdf = require('pdf-parse');
let dataBuffer = fs.readFileSync('[67226] - De\'clarations du vendeur sur limmeuble (DV).pdf');
pdf(dataBuffer).then(function (data) {
    fs.writeFileSync('parsed_pdf.txt', data.text);
    console.log('Parsed successfully');
}).catch(console.error);
