'use strict';

const Hapi = require('hapi');
const mongojs = require('mongojs');

// Creo un nuevo objeto de servidor Hapi
const server = new Hapi.Server();  
//Despues añado una connexion con el servidor y le asigno un puerto
server.connection({  
    port: 3000
});

//Conexion a la DB
server.app.db = mongojs('hapi-rest-mongo', ['users']);



//Cargando los plugins y empezando el servidor
server.register([  
  require('./routes/users')
], (err) => {

  if (err) {
    throw err;
  }

  // Inicio el Servidor
  server.start((err) => {
    console.log('Server running at:', server.info.uri);
  });

});

// s