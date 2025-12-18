const Connection = require('../models/connection');
const Rsvp = require('../models/Rsvp');
const { DateTime } = require("luxon");

exports.index = (req, res, next) => {
    Promise.all([Connection.distinct("topic"), Connection.find()])
    .then(([categories, connections]) => {
        res.render('./connection/index', {connections, categories});
    })
    .catch(err=>next(err));
};

exports.new = (req, res) => {
    res.render('./connection/new');
};

exports.create = (req, res, next) => {
    let today = new Date(DateTime.now().toFormat("yyyy-LL-dd"));;
    let date = new Date(req.body.date);

    if(date.getTime() < today.getTime()){
        req.flash('error', 'Selected date must be greater than today\'s');
        res.redirect('back');
    }
    
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
            
            Rsvp.countDocuments({ status: 'Yes', connection: id })
            .then(rsvpCount=>{
                return res.render('./connection/show', {connection, rsvpCount});
            })
            .catch(err=>next(err));
            
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
    Connection.deleteOne({ _id: id })
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

exports.rsvp = (req, res, next) => {
    let attendees = req.session.user;
    let id = req.params.id;
    let status = req.body.status;

    Connection.findById(id)
    .then(connection=>{
        if(connection) {
            if(connection.host==attendees){
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }else{
                Rsvp.updateOne({ connection: id, attendees: attendees }, 
                    { $set: { connection: id, attendees: attendees, status: status }}, 
                    { upsert: true })
                .then(rsvp=>{
                    if(rsvp) {
                        if(rsvp.upserted){
                            req.flash('success', 'Successfully created an RSVP for this connection!');
                        }else{
                            req.flash('success', 'Successfully updated an RSVP for this connection!');
                        }
                        res.redirect('/users/profile');
                    } else {
                        req.flash('error', 'There is some problem in creating an RSVP for this connection');
                        res.redirect('back');
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
            }
        } else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
    
};

exports.deleteRsvp = (req, res, next) => {
    let id = req.params.id;
    Rsvp.findByIdAndDelete(id, {useFindAndModify: false})
    .then(rsvp =>{
        if(rsvp) {
            req.flash('success', 'RSVP has been sucessfully deleted!');
            res.redirect('/users/profile');
        } else {
            let err = new Error('Cannot find an RSVP with id ' + id);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err=>next(err));
};