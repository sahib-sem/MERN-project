import mongoose, { mongo } from "mongoose";

const listingSchema = new mongoose.Schema({

    name: {
        type:String, 
        required:true
    }, 
    
    description: {
        type:String, 
        required:true
    },
    address: {
        type:String, 
        required:true
    },
    regularPrice: {
        type:Number, 
        required:true
    },
    discountedPrice: {
        type:Number, 
        required:true
    },

    images: {
        type:Array, 
        required:true
    },
    parking: {
        type:Boolean, 
        required:true
    },
    furnished: {
        type:Boolean, 
        required:true
    },

    bedrooms: {
        type:Number, 
        required:true
    },
    bathrooms: {
        type:Number, 
        required:true
    },
    type: {
        type:String, 
        required:true
    },
    // user id who created the listing , ensure the user id exists in the user collection
    userRef:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    
}, 
{ timestampsq: true })

const Listing = mongoose.model("Listing" , listingSchema)

export default Listing;