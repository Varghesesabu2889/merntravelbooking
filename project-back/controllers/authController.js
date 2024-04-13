import User from "../models/user.js";
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
// User registration
export const register = async (req, res) => {
    try {
        //hashing password
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(req.body.password,salt)

     const newUser = new User({
        username:req.body.username,
        email:req.body.email,
        password:hash,
        photo:req.body.photo
     }) 
     await newUser.save()

res.status(200).json({
    success:true,
    message:"Successfully created"
})


    } catch (err) {
        res.status(500).json({
            success:false,
            message:"Failed to  create .Try Again"
        })

    }
};

// User login
// export const login = async (req, res) => {

//     const email = req.body.email
//     try {

//         const user = await User.findOne({email})
//         if(!user){
//          return res.status(404).json({
//             success:'User not found'
//          }) 
         
//         }
//         const checkCorrectPassword = await bcrypt.compare
//         (req.body.password,user.password)

//         if(!checkCorrectPassword){
//             return res.status(401).json({
//                 success:false,
//                 message:"incorrect email or password....."
//             })

//         }
//         const{password,role, ...rest} = user._doc

//         //create jwt
//         const token = jwt.sign({
//             id:user._id,
//             role:user.role},
//             process.env.JWT_SECRET_KEY,
//             {expiresIn:'15d'}
//             );
// // set token in the browser cookies and send the response
// // to the client 
// res.cookie('accessToken',token,{
//     httpOnly:true,
//     expires:token.expiresIn
// }).status(200)
// .json({
//     token,
//     data:{...rest},
//     role,
// });


// } catch (err) {

//     return res.status(500)
//     .json({
//          success:true,
//         message:"Success to login",
//     })


//     }
// };


export const login = async (req, res) => {
    const { email, password } = req.body; // Destructure email and password from req.body

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const checkCorrectPassword = await bcrypt.compare(password, user.password);
        if (!checkCorrectPassword) {
            return res.status(401).json({ success: false, message: 'Incorrect email or password' });
        }

        const { password: userPassword, role, ...rest } = user._doc;

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '15d' });

        res.cookie('accessToken', token, { httpOnly: true, expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) });

        res.status(200).json({ success: true, token, data: { ...rest }, role });
    } catch (err) {
        console.error('Error in login:', err); // Log the error for debugging
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};