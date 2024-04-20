require('dotenv').config();
const express = require('express');
const rotas = require('./rotas');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(rotas);

app.listen(process.env.PORT, () => console.log("Server is running on port 8000"));