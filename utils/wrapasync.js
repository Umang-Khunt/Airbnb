module.exports = (fn) =>{
    return function wrapAsync(req,res,next){

        fn(req,res,next).catch(next);

    }
};