/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
const Tour = require("../models/tourModel");

const tours = [];

// 2) HANDLERS
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// tours
exports.getAllTours = async (req, res) => {
    try {
        // BUILD THE QUERY
        const queryObj = {...req.query};
        const excludeFields = ['page', 'sort', 'limit', 'fields'];// to ignore some of the fields
        excludeFields.forEach(el => delete queryObj[el]);

        // console.log(queryObj);
        const query = Tour.find(queryObj) // applied filter 
        // EXECUTE THE QUERY
        const tours = await query;
        // SEND RESPONSE
        res
            .status(200)
            .json({
                status: 'success',
                result: tours.length,
                data: {
                    tours: tours
                }
            });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: 'Something went wrong'
        })
    }
    
}

exports.createTour = async (req, res) => {

    try {
        const newTour = await Tour.create(req.body);

        res
            .status(201)
            .json({
                status: 'success',
                data: {
                    tour: newTour
                }
            });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
    
}

exports.getTour =  async (req, res) => {// ? makes a param optional
    
    try {
        const tour = await Tour.findById(req.params.id);
        res
            .status(200)
            .json({
                status: 'success',
                data: {
                    tour: tour
                }
            });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error
        })
    }
}

exports.updateTour = async (req, res) => {

    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }); // new: true will return a new doc on update
        res
            .status(200)
            .json({
                status: 'success',
                data: {
                    tour: tour
                }
            })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error
        })
    }

}

exports.deleteTour = async (req, res) => {
    
    try {
        await Tour.findByIdAndDelete(req.params.id)
        res
            .status(204) // 204 means no content
            .json({
                status: 'success',
                data: null
            }) 
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error
        })
    }

    
}