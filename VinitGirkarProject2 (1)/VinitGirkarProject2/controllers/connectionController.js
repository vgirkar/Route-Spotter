const model = require('../models/connection');
const { DateTime } = require("luxon");

exports.index = (req, res) => {
    let connections = model.find();
    let categories = model.categories();
    res.render('./connection/index',{connections, categories});
};

exports.new = (req, res) => {
    res.render('./connection/new');
};

exports.create = (req, res) => {
    let connection = req.body;
    model.save(connection);
    res.redirect('/connections');
};

exports.show = (req, res, next) => {
    let id = req.params.id;
    let findConnection = model.findById(id);
    if(findConnection){
        let connection = Object.assign({}, findConnection);
        connection.date = DateTime.fromSQL(connection.date).toFormat('LLLL dd, yyyy');
        connection.startTime = DateTime.fromSQL(connection.startTime).toFormat('hh:mm a');
        connection.endTime = DateTime.fromSQL(connection.endTime).toFormat('hh:mm a');
        res.render('./connection/show',{connection});
    }else{
        let err = new Error('Cannot find connection with id '+id);
        err.status = 404;
        next(err);
    }
};

exports.edit = (req, res, next) => {
    let id = req.params.id;
    let connection = model.findById(id);
    if(connection){
        res.render('./connection/edit',{connection});
    }else{
        let err = new Error('Cannot find connection with id '+id);
        err.status = 404;
        next(err);
    }
};

exports.update = (req, res, next) => {
    let id = req.params.id;
    let connection = req.body;
    if(model.updateById(id, connection)){
        res.redirect('/connections/'+id);
    }else{
        let err = new Error('Cannot find connection with id '+id);
        err.status = 404;
        next(err);
    }
};

exports.delete = (req, res, next) => {
    let id = req.params.id;
    if(model.deleteById(id)){
        res.redirect('/connections');
    }else{
        let err = new Error('Cannot find connection with id '+id);
        err.status = 404;
        next(err);
    } 
};