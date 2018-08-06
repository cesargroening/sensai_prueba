const cool = require('cool-ascii-faces')
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

// express()
//   .use(express.static(path.join(__dirname, 'public')))
//   .set('views', path.join(__dirname, 'views'))
//   .set('view engine', 'ejs')
//   .get('/', (req, res) => res.render('pages/index'))
//   .get('/cool', (req, res) => res.send(cool()))
//   .listen(PORT, () => console.log(`Listening on ${ PORT }`))
//
//const express = require('express');
const app = express();
const puerto = 3000;
const exphbs = require('express-handlebars');
//const path = require('path');
const a = require('./archivo.js');
const Archivo = new a()

app.get('/tabla', (request, response)=>{
  var respuesta = Archivo.getDatos();
  respuesta.titulo='tabla';
  response.render('tabla',respuesta);
});

app.get('/curriculum', (request, response)=> {
  var respuesta = Archivo.getDatos();
  respuesta.titulo='curriculum';
  response.render('cv',respuesta);
});

app.get('/img/yo.png', (request, response)=> {
  response.sendFile(__dirname+'/img/yo.png');

});


//Engine/////////////////////////
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    helpers: require('./helpers')
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'))
///////////////////////////


//Middleware//////////////
app.use((request, response, next)=>{
    console.log(request.headers);
    next();
});
//////////////////////////
app.listen(puerto, (error)=>{
    if(error){
        return console.log('Ocurrió un error');
    }else{
        console.log('Puerto: ', PORT);
    }
});
