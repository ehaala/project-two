var express = require('express');
var db = require('../models');
var router = express.Router();

var isLoggedIn = require('../middleware/isLoggedIn');

router.get('/', isLoggedIn, function(req, res) {
	db.user.findAll().then(function(users) {
		res.render('users', {users: users});
	}).catch(function(error) {
    	res.status(400).render('404');
  	});
})

router.get('/:id', isLoggedIn, function(req, res) {
	db.user.findOne({
		where: {id: req.params.id},
		include: [db.schedule]
	}).then(function(user) {
		user.getGyms().then(function(gyms) {
			res.render('userinfo', {gyms: gyms, user: user});
		});
	}).catch(function(error) {
    	res.status(400).render('404');
  	});
})

router.post('/:id/schedule', isLoggedIn, function(req, res) {
	db.schedule.create({
		day: req.body.day,
		time: req.body.time,
		userId: req.user.id
	}).then(function() {
		res.redirect('/profile');
	}).catch(function(error) {
    	res.status(400).render('404');
  	});
})

router.delete('/:id/schedule/:id', isLoggedIn, function(req, res) {
	db.schedule.destroy({
		where: {
			id: req.params.id,
		}
	}).catch(function(error) {
    	res.status(400).render('404');
  	});
})

router.get('/:id/schedule/:id/edit', isLoggedIn, function(req, res) {
	db.schedule.findOne({
		where: {
			id: req.params.id
		}
	}).then(function(schedule) {
		res.render('editschedule', {schedule: schedule, user: req.user});
	}).catch(function(error) {
    	res.status(400).render('404');
  	});
})

router.put('/:id/schedule/:id', function(req, res) {
	db.schedule.findOne({
		where: {
			id: req.params.id
		}
	}).then(function(schedule) {
		schedule.updateAttributes(req.body);
	}).then(function() {
		res.redirect('/profile');
	}).catch(function(error) {
    	res.status(400).render('404');
  	});
})

module.exports = router;