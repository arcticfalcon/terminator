const express = require('express');
const app = express();


app.use(express.static('public', { maxAge: 3600000 }));


app.listen(3000, () => console.log('app listening on port 3000!'));
