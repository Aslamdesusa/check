import Hapi from 'hapi';
const adminModal = require('../tables/loginAdmin.js')
const Joi = require('joi')
const AuthCookie = require('hapi-auth-cookie')

// const config = require('../config.json');

// const parser = require('body-parser');

// const request = require('request');
// const jwkToPem = require('jwk-to-pem');
// const jwt = require('jsonwebtoken');

const routes = [
	{
		method: 'GET',
		path: '/login',
		handler: function(request, reply){
			return reply.view('login', null,{layout: 'layout1'})
		}
	},
	{
		method: 'POST',
		path: '/create/admin',
		handler: function(request, reply){
			const newAdmin = new adminModal(request.payload)
			newAdmin.save(function(err, data){
				if (err) {
					throw err
				}else{
					reply(data)
				}
			})
		}
	},
	{
    method:'POST',
    path:'/admin/login',
    config:{
        validate: {
         	payload:{
         		username:Joi.string().required(),
         		password:Joi.string().required(),

			}
		},
    },
    handler: function(request, reply){
    	
        adminModal.find({'username': request.payload.username, 'password': request.payload.password}, function(err, data){
            if (err){
                reply({
                    'error': err
                });
            } else if (data.length == 0){
            	reply('admin dose not  exixt')
                // reply.view('error', {message: 'Admin dose not exists please try with your correct username and password', errormessage: '404 error'})
            } else {
            	// reply('admin find')
                    request.cookieAuth.set(data[0]);
                    return reply.redirect('/deshboard')
	            }
	        })

	    }
	},
	{
		method: 'GET',
		path: '/logout',
		handler: function(request, reply){
			request.cookieAuth.clear();
			return reply.redirect('/login')
		}
	},
	{
		method: 'GET',
		path: '/{username}',
		handler: function(request, reply){
			return reply.view('404')
		}
	}
]
export default routes;