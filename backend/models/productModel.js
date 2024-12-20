import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    id:{type:Number,required:true,unique:true},
    name:{type:String,required:true},
    image:{type:String,required:true},
    quantity:{type:String,required:true},
    price:{type:String,required:true},
    description:{type:String,required:true},
    category:{type:String,required:true}
})

const productModel = mongoose.models.product || mongoose.model("product",productSchema);

export default productModel;