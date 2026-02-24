const express = require("express");
const app = express();
const Listing = require("../models/listing");
app.use(express.json());
let obj;

//-----Index route
module.exports.index =async (req,res,next)=>{

   let allListings = await Listing.find({})
    
   res.render("listings/index.ejs",{allListings});

};


//-----New Listing route
module.exports.newFormRender = (req,res)=>{
   
    res.render("listings/new.ejs");
};


//-----Create Listing route
module.exports.listingCreator = async(req,res,next)=>{
  
   let {title,image,price,location,country,description} = req.body;

    let url = req.file.path;
    let filename = req.file.filename;

    let listing = {
        title:title,
        image:{
            filename:filename,
            url:url,
        },
        price:price,
        location:location,
        country:country,
        description:description,
        owner:req.user._id,
        geocoordinates:obj
    };

    await Listing.create(listing);
    req.flash("success","New listing created");
    res.redirect("/listings");
};

module.exports.coordinateSaver = async(req,res)=>{

    obj=req.body;


    console.log(req.body);

}

//-----Edit Page route
module.exports.editPageRander = async (req,res,next)=>{
    let { id } =req.params;
    let listing = await Listing.findById(id);

    if(!listing){
    req.flash("error","Listing does not exsist");
    return res.redirect("/listings");
    }
    let orignalImageUrl = listing.image.url;
   orignalImageUrl= orignalImageUrl.replace("/upload","/upload/h_100,w_250");
    res.render("listings/edit.ejs",{ listing,orignalImageUrl });
};


//-----Listing Update route
module.exports.listingUpdater = async (req,res,next)=>{
    let { id } = req.params;
    let{ title,image,price,location,country,description } = req.body;

   
    let listing = await Listing.updateOne({_id:id},{$set:{
         title:title,
        price:price,
        location:location,
        country:country,
        description:description
    }});

    

    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
       await Listing.updateOne({_id:id},{$set:{
        image:{
            filename:filename,
            url:url
        }
       }});
    }

    req.flash("success","listing updated");
    return res.redirect("/listings");
};


// Info Page route
module.exports.infoPageRander = async (req,res,next)=>{
   
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
  
    if(!listing){
    req.flash("error","Listing does not exsist");
    return res.redirect("/listings");
   }
   console.log(listing);
    res.render("listings/info.ejs", { listing } );
 

};


//-----Listing delete route
module.exports.listingDeleter = async (req,res,next)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success"," listing deleted");
    res.redirect("/listings");
};
