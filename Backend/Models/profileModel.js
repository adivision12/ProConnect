const mongoose=require("mongoose");

const educationSchema=new mongoose.Schema({
    school:{
        type:String,
        default:''
    },
    degree:{
        type:String,
        default:''
    },
    fieldOfStudy:{
        type:String,
        default:''
    }
    
})


const workSchema=new mongoose.Schema({
    company:{
        type:String,
        default:''
    },
    position:{
        type:String,
        default:''
    },
    years:{
        type:String,
        default:''
    }
    
}
)

const profileSchema=new mongoose.Schema({
      userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
    
    coverPicture:{
        type:String,
         default:"https://res.cloudinary.com/dcgdg9ths/image/upload/v1751804595/ProConnect/l3pcnyegqlcrfdgeka9p.webp"
    },
    about:{
         type:String,
         default:"",
    },
    pastWork:{
        type:[workSchema],
        default:[]
    },
    education:{
        type:[educationSchema],
        default:[]
    },
    skills:{
        type:[String],
        default:[]
    },
    achievements:{
        type:[String],
        default:[]
    }
})


const Profile=mongoose.model("Profile",profileSchema);

module.exports= Profile;