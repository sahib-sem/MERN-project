import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {

    const {username , email , password} = req.body;

    if (!username || !email || !password) {
        const error = new Error('please fill all the fields');
        error.statusCode = 400;
        next(error);
        return;
    }

    const hashedPassword =  bcryptjs.hashSync(password, 12);
    const user = new User({
        username,
        email,
        password: hashedPassword
    });

    try{
        await user.save();
    
        res.status(201).json({
            success: true,
            message: 'user signup successfully'
        })

    }catch(err){
        
        next(err);
    }

}

export const signin = async (req, res, next) => {

    const {email, password} = req.body;

    if (!email || !password) {
        const error = new Error('wrong credentials');
        error.statusCode = 400;
        next(error);
        return;
    }

    const validuser = await User.findOne({email});

    if (!validuser) {
        const error = new Error('wrong credentials');
        error.statusCode = 400;
        next(error);
        return;
    }

    const isPasswordValid = bcryptjs.compareSync(password, validuser.password);

    if (!isPasswordValid) {
        const error = new Error('wrong credentials');
        error.statusCode = 400;
        next(error);
        return;
    }

    const access_token = jwt.sign({ id: validuser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    validuser.password = undefined;

    res.cookie('access_token', access_token, {httpOnly: true})
    .status(200).json({
        success: true,
        user: validuser,
    })

}

export const googleAuth = async (req, res, next) => {

    const {name, email, imageUrl} = req.body;

    const user = await User.findOne({email});
    
    if (user){

        const access_token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        user.password = undefined;

        res.cookie('access_token', access_token, {httpOnly: true})
        .status(200).json({
            success: true,
            user: user,
        })


    }

    else{

        const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        const hashedPassword = bcryptjs.hashSync(password, 12);
        const username = name.split(' ').join('_') + Math.random().toString(36).slice(-4);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            avatar: imageUrl
        });

        await newUser.save();

        const access_token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        newUser._doc.password = undefined;


        res.cookie('access_token', access_token, {httpOnly: true})
        .status(200).json({
            success: true,
            user: {
                ...newUser._doc,
            },
        })
        
    }

}