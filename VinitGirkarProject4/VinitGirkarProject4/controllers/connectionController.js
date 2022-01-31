const Connection = require('../models/connection');
const { DateTime } = require("luxon");

exports.index = (req, res, next) => {
    let categories = [];
    Connection.distinct("topic", function(error, results){
        categories = results;
    });
    Connection.find()
    .then(connections => res.render('./connection/index', {connections, categories}))
    .catch(err=>next(err));
};

exports.new = (req, res) => {
    res.render('./connection/new');
};

exports.create = (req, res, next) => {
    let connection = new Connection(req.body);//create a new connection document
    connection.host = req.session.user;
    connection.save()//insert the document to the database
    .then(connection=> {
        req.flash('success', 'You have successfully created a new connection');
        res.redirect('/connections');
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            req.flash('error', err.message);
            res.redirect('back');
        }else{
            next(err);
        }
    });
};

exports.show = (req, res, next) => {
    let id = req.params.id;
    Connection.findById(id).populate('host', 'firstName lastName')
    .then(connection=>{
        if(connection) {
            connection.date = DateTime.fromSQL(connection.date).toFormat('LLLL dd, yyyy');
            connection.startTime = DateTime.fromSQL(connection.startTime).toFormat('hh:mm a');
            connection.endTime = DateTime.fromSQL(connection.endTime).toFormat('hh:mm a');
            return res.render('./connection/show', {connection});
        } else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.edit = (req, res, next) => {
    let id = req.params.id;
    Connection.findById(id)
    .then(connection=>{
        if(connection) {
            return res.render('./connection/edit', {connection});
        } else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.update = (req, res, next) => {
    let connection = req.body;
    let id = req.params.id;
    Connection.findByIdAndUpdate(id, connection, {useFindAndModify: false, runValidators: true})
    .then(connection=>{
        if(connection) {
            req.flash('success', 'Connection has been successfully updated');
            res.redirect('/connections/'+id);
        } else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=> {
        if(err.name === 'ValidationError'){
            req.flash('error', err.message);
            res.redirect('back');
        }else{
            next(err);
        }
    });
};

exports.delete = (req, res, next) => {
    let id = req.params.id;
    Connection.findByIdAndDelete(id, {useFindAndModify: false})
    .then(connection =>{
        if(connection) {
            res.redirect('/connections');
        } else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err=>next(err));
};