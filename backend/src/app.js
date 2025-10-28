require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(bodyParser.json());

app.get('/api/health', (req,res)=> res.json({ok:true, env: process.env.NODE_ENV || 'dev'}));

// Placeholder route list (routes should be added as files in /routes)
app.use('/api/employees', (req,res)=> res.status(200).json({message:'employees endpoint placeholder'}));

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log('Backend listening on', PORT));
