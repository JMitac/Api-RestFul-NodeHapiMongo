'use strict';

const Boom = require('boom');  
const uuid = require('node-uuid');  
const Joi = require('joi');

exports.register = function(server, options, next) {

  const db = server.app.db;

  //PLACEHOLDER
  //--------------------------------------------------------------
  //Here the routes definitions will be inserted in the next steps...

  	server.route({  
	    method: 'GET',
	    path: '/users',
	    handler: function (request, reply) {

	        db.users.find((err, docs) => {

	            if (err) {
	                return reply(Boom.wrap(err, 'Internal MongoDB error'));
	            }

	            reply(docs);
	        });

	    }
	});

	server.route({  
	    method: 'GET',
	    path: '/users/{id}',
	    handler: function (request, reply) {

	        db.users.findOne({
	            _id: request.params.id
	        }, (err, doc) => {

	            if (err) {
	                return reply(Boom.wrap(err, 'Internal MongoDB error'));
	            }

	            if (!doc) {
	                return reply(Boom.notFound());
	            }

	            reply(doc);
	        });

	    }
	});

	server.route({  
	    method: 'POST',
	    path: '/users',
	    handler: function (request, reply) {

	        const user = request.payload;

	        //Create an id
	        user._id = uuid.v1();

	        db.users.save(user, (err, result) => {

	            if (err) {
	                return reply(Boom.wrap(err, 'Internal MongoDB error'));
	            }

	            reply(user);
	        });
	    },
	    config: {
	        validate: {
	            payload: {
	                name: Joi.string().min(10).max(50).required(),
	                password: Joi.string().min(10).max(50).required(),
	                tipo: Joi.number()
	            }
	        }
	    }
	});

	server.route({  
	    method: 'PUT',
	    path: '/users/{id}',
	    handler: function (request, reply) {

	        db.users.update({
	            _id: request.params.id
	        }, {
	            $set: request.payload
	        }, function (err, result) {

	            if (err) {
	                return reply(Boom.wrap(err, 'Internal MongoDB error'));
	            }

	            if (result.n === 0) {
	                return reply(Boom.notFound());
	            }

	            reply().code(204);
	        });
	    },
	    config: {
	        validate: {
	            payload: Joi.object({
	                name: Joi.string().min(10).max(50).optional(),
	                password: Joi.string().min(10).max(50).optional(),
	                tipo: Joi.number().optional()
	            }).required().min(1)
	        }
	    }
	});

	server.route({  
	    method: 'DELETE',
	    path: '/users/{id}',
	    handler: function (request, reply) {

	        db.users.remove({
	            _id: request.params.id
	        }, function (err, result) {

	            if (err) {
	                return reply(Boom.wrap(err, 'Internal MongoDB error'));
	            }

	            if (result.n === 0) {
	                return reply(Boom.notFound());
	            }

	            reply().code(204);
	        });
	    }
	});

  	return next();
};

exports.register.attributes = {  
	name: 'routes-users'
};

