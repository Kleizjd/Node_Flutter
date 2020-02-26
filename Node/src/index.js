const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const app = express();
///-------------aun no se para que sirve---------//
const http = require('http');
const socketio = require('socket.io');
const socketioJwt = require('socketio-jwt');
//------------------------------------------///


const morgan = require('morgan');//---[ peticiones que llegan ]----//
const cors = require('cors');
//-----------------------------------////
app.use(morgan('dev'));
//-----------------------------------////

app.use(cors());
app.set('view engine', 'ejs');

dotenv.config();
process.env.TZ = 'America/Bogota'; // zona horaria de la app
const routesV1 = require('./routes/v1');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// public files
// app.use(express.static(__dirname + '/public'));
app.use(express.static('public'));

mongoose.set('useCreateIndex', true);

// create a socket
const server = http.Server(app);
const io = socketio(server);
io.use(
  socketioJwt.authorize({
    secret: process.env.JWT_SECRET,
    handshake: true,
    callback: false
  })
);
routesV1(app);

const PORT = process.env.PORT || 4000;

// .connect('mongodb://localhost/my_database', {
mongoose
  .connect(process.env.Mongo, {  
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to mongodb');

    app.listen(PORT, () => {
      console.log(`running on ${PORT}`);
    });
  })
  .catch(error => {
    console.log('mongodb error: ', error);
  });
//Modelo
// const SignUp = mongoose.model('SignUp', {username: String, completed: Boolean});
// const SignUp = mongoose.model('SignUp', {username: String, completed: Boolean});

// app.post('/add',(req,res)=>{
//   const signUp = SignUp({username: req.body.text, completed: false});
//   signUp.save().then(doc => {
//     console.log('Dato insertado correctamente: ', doc);
//   });
//   res.json({response: 'success'});
// });