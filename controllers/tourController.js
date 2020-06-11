/* eslint-disable prettier/prettier */
/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
const Tour = require("../models/tourModel");

const APIFeatures = require("../utils/apiFeatures");

exports.aliasTopTours = (req, res, next) => { 
    // Prefilling of query for top-5-cheap
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    console.log(req.query);
    next(); // to get out of the middleware
};



exports.getAllTours = async (req, res) => {
    try {
        // EXECUTE THE QUERY
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        
        const tours = await features.query;

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

exports.getToursStats = async (req, res) => {

    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id:{ $toUpper: '$difficulty' }, // the data will be aggregated for each _id value
                    num: { $sum: 1 }, // number of tours, will add every time one for each document
                    numRatings: { $sum: '$ratingsQuantity' },
                    avgrating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            },
            {
                $sort: { avgPrice: 1 } // 1 for assending
            },
            // {
            //     $match: { _id: { $ne: 'EASY' } } // EXCLUDING THE EASY GROUP
            // }
        ])

        res
            .status(200) // 204 means no content
            .json({
                status: 'success',
                data: stats
            })
        
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error
        })
    }
}

//UNWINDING
exports.getMonthlyPlan = async (req, res) => {
    try {
        const year = req.params.year * 1;

        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates' // one document for each date
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                 }
            },
            {
                $group: {
                    _id: { $month: '$startDates' },
                    numTourStarts: { $sum: 1 },
                    tours: { $push: '$name' }
                }
            },
            {
                $addFields: { month: '$_id' }
            },
            {
                $project: {
                    _id: 0 // it will hide the _id for 0, 1 to show
                }
            },
            {
                $sort: { _id: 1 } // 1 for assending -1 for decending
            }
        ]);

        res
            .status(200) // 204 means no content
            .json({
                status: 'success',
                data: {
                    "plan": plan
                }
            })
        
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error
        })
    }
}