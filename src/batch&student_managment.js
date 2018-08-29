import Hapi from 'hapi';
// const popup = require('popups');
const db = require('../database').db;
const batchModal = require('../tables/batch')
const studentModal = require('../tables/student')
const Joi = require('joi')
const AuthCookie = require('hapi-auth-cookie')

const routes = [
	{
		method: 'GET',
		path: '/deshboard',
		config:{
			auth:{
				strategy: 'restricted',
			}
		},
		handler: function(request, reply){
			return reply.view('index')
		}
	},
	{
		method: 'GET',
		path: '/batch/management',
		config:{
			auth:{
				strategy: 'restricted',
			}
		},
		handler: function(request, reply){
			batchModal.find({}, (err, data) =>{
				if (err) {
					reply(err)
				}else{
					reply.view('batch', {data: data})
				}
			})

		}
	},
	{
		method: 'GET',
		path: '/success',
		config:{
			auth:{
				strategy: 'restricted',
			}
		},
		handler: function(request, reply){
			batchModal.find({}, (err, data) =>{
				if (err) {
					reply(err)
				}else{
					reply.view('batch', {data: data,  message: 'The New Batch has been successfully Created.', success: 'Success!', alert: 'alert-success'})
				}
			})
		}
	},
	{
		method: 'GET',
		path: '/success/deleted',
		config:{
			auth:{
				strategy: 'restricted',
			}
		},
		handler: function(request, reply){
			batchModal.find({}, (err, data) =>{
				if (err) {
					reply(err)
				}else{
					reply.view('batch', {data: data,  message: 'Record ' +request.query.Name+ ' deleted successfully.', success: 'Delete!', alert: 'alert-success'})
				}
			})
		}
	},
	{
		method: 'GET',
		path: '/error',
		config:{
			auth:{
				strategy: 'restricted',
			}
		},
		handler: function(request, reply){
			batchModal.find({}, (err, data) =>{
				if (err) {
					reply(err)
				}else{
					reply.view('batch', {data: data, message: 'The Batch ID Already Exist.', success: 'Error!', alert: 'alert-danger'})
				}
			})
		}
	},
	{
		method: 'POST',
		path: '/batch/management',
		config:{
			auth:{
				strategy: 'restricted',
			}
		},
		handler: function(request, reply){
			var newBatch = new batchModal(request.payload);
			newBatch.save(function (err, data){
				if (err) {
					return reply.redirect('/error?ID='+ request.payload.ID)
				}else{
					return reply.redirect('/success?_id='+data._id+ '&Name='+data.Name )
				}
			})
		}
	},
	{
		method: 'GET',
		path: '/batch/management/deleted/{uuid}',
		config: {
		// Joi api validation
			validate: {
			    params: {
			        uuid: Joi.string().required()
			    }
			},
			auth:{
				strategy: 'restricted',
			}
		},
		handler: function(request, reply){
			batchModal.findOneAndRemove({_id: request.params.uuid}, function (error, data){
				if (error) {
					return reply('Data Didn\'t deleted')
				}else{
					reply.redirect('/success/deleted?_id=' + request.params.uuid + '&Name=' + data.Name)
					// reply('deleted')
				}
			})
		}
	},
// =====================================================================================================
	{
		method: 'GET',
		path: '/student/management',
		config:{
			auth:{
				strategy: 'restricted',
			}
		},
		handler: function(request, reply){
			var student = {}
			var batch = {}
			studentModal.find().limit(100).exec({}, (err, data) =>{
				if (err) {
					reply(err)
				}else{
					student=data
				}
			})
			// var batch = {};
			batchModal.find().limit(100).exec({}, (err, data1) =>{
				if (err) {
					reply(err)
				}else{
					batch=data1;
					console.log(student)
					console.log(batch)
					reply.view('student', {data: student, data1: batch})
				}
			})
		}
	},
	{
		method: 'GET',
		path: '/created/student',
		config:{
			auth:{
				strategy: 'restricted',
			}
		},
		handler: function(request, reply){
			studentModal.find({}, (err, data) =>{
				if (err) {
					reply(err)
				}else{
					reply.view('student', {data: data,  message: 'The New Student has been successfully Created.', success: 'Success!', alert: 'alert-success'})
				}
			})
		}
	},
	{
		method: 'GET',
		path: '/student/deleted',
		config:{
			auth:{
				strategy: 'restricted',
			}
		},
		handler: function(request, reply){
			studentModal.find({}, (err, data) =>{
				if (err) {
					reply(err)
				}else{
					reply.view('student', {data: data,  message: 'Record ' +request.query.Name+ ' deleted successfully.', success: 'Delete!', alert: 'alert-success'})
				}
			})
		}
	},
	{
		method: 'GET',
		path: '/error/student',
		config:{
			auth:{
				strategy: 'restricted',
			}
		},
		handler: function(request, reply){
			studentModal.find({}, (err, data) =>{
				if (err) {
					reply(err)
				}else{
					reply.view('student', {data: data, message: 'This student ( '+request.query.ID+' ) ID Already Exist.', success: 'Error!', alert: 'alert-danger'})
				}
			})
		}
	},
	{
		method: 'POST',
		path: '/student/management',
		config:{
			auth:{
				strategy: 'restricted',
			}
		},
		handler: function(request, reply){
			var newStudent = new studentModal(request.payload);
			newStudent.save(function (err, data){
				if (err) {
					return reply.redirect('/error?ID='+ request.payload.ID)
				}else{
					return reply.redirect('/created/student?_id='+data._id+ '&Name='+data.Name )
				}
			})
		}
	},
	{
		method: 'GET',
		path: '/student/management/deleted/{uuid}',
		config: {
		// Joi api validation
			validate: {
			    params: {
			        uuid: Joi.string().required()
			    }
			},
			auth:{
				strategy: 'restricted'
			}
		},
		handler: function(request, reply){
			studentModal.findOneAndRemove({_id: request.params.uuid}, function (error, data){
				if (error) {
					return reply('Data Didn\'t deleted')
				}else{
					reply.redirect('/student/deleted?_id=' + request.params.uuid + '&Name=' + data.Name)
					// reply('deleted')
				}
			})
		}
	},	
	
]
export default routes;