/* eslint-disable prettier/prettier */
const fs = require('fs');

// 2) HANDLERS
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.checkId = (req, res, next, val) => {
    // val is the id which is passed in the first arrgument
    if (val*1 > tours.length) {
        return res.status(404)
                  .json({
                      status: 'fail',
                      message: 'Request Invalid'
                  })  
    }
    next();
}

exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(404)
                  .json({
                      status: 'fail',
                      message: 'Name or Price is invalid'
                  })
    }
    next();
}

// tours
exports.getAllTours = (req, res) => {
    res
        .status(200)
        .json({
            status: 'success',
            result: tours.length,
            data:{
                tours: tours
            }
        });
}

exports.addNewTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId}, req.body);
    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, 
        JSON.stringify(tours), 
        err => {
            res
                .status(201)
                .json({
                    status: 'success',
                    data: newTour
                }); // 201 is for created
        });
}

exports.getTour =  (req, res) => {// ? makes a param optional
    const id = req.params.id * 1;
    if (id > tours.length) {
        return res.status(404)
                  .json({
                      status: 'fail',
                      message: 'Request Invalid'
                  })  
    }

    const tour = tours.find( tour => tour.id === req.params.id*1); // by multiplying with 1 it will convert string into integer
    res
        .status(200)
        .json({
            status: 'success',
            data:{
                tour: tour
            }
        });
}

exports.updateTour = (req, res) => {
    const id = req.params.id * 1;
    if (id > tours.length) {
        return res.status(404)
                  .json({
                      status: 'fail',
                      message: 'Request Invalid'
                  })  
    }

    res
        .status(200)
        .json({
            status:'success',
            data: {
                tour: '<updated>'
            }
        })
}

exports.deleteTour = (req, res) => {
    const id = req.params.id * 1;
    

    res
        .status(204) // 204 means no content
        .json({
            status:'success',
            data: null
        })
}