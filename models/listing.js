const mongoose = require("mongoose");
const Review = require("./reviews");
const { required } = require("joi");
const Schema = mongoose.Schema;



const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type:String,
      default:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1vdW50YWlufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  reviews:[{
    type:Schema.Types.ObjectId,
    ref:"Review",
  }],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
  },
  geocoordinates: {
    type: {
      type: String, 
      enum: ['Point'],
     required:true
    },
    coordinates: {
      type: [Number],
 required:true
    }
  }
});

listingSchema.post("findOneAndDelete",async( listing )=>{
  if( listing ){
    await Review.deleteMany({_id:{$in:listing.reviews } });
  }
});

const Listing =mongoose.model("Listing",listingSchema);
module.exports = Listing;