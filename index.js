const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('toy cars in running')
})

app.listen(port, () =>{
    console.log(`toy cars is running in part: ${port}`);
})
