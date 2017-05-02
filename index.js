const ezs = require('ezs');
const from = require('from');

ezs.use(require('./ezsLocal'));

const url = [
    'https://api-v5.istex.fr/document/?q=language:rus&scroll=1m'
];

from(url).pipe(ezs('scroll'));