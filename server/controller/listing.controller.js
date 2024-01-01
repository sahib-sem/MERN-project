import Listing from '../models/listing.model.js';
export const createListing = (req, res, next) => {


    try{
    const listing = new Listing(req.body);

    return res.status(201).json({
        success: true,
        message: "listing created successfully",
        data: listing
    
    })

    }
    catch(err){
        next(err)
    }

}