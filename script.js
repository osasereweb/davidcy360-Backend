// import { cookieJwtAuth } from './middleware/cookieJwtAuth';
require('dotenv').config();
const { cookieJwtAuth, openUserprofile } = require('./middleware/cookieJwtAuth');

const hbs = require('hbs');
const nodemailer = require('nodemailer');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const mongodb = require('mongodb');
const { ObjectId } = require('mongodb');
const bcripyt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const cloudinary = require("./cloudinary");
const { title } = require('process');
const { cookieJwtAuthAdmin } = require('./middleware/cookieJwtAuthAdmin');
const sharp = require('sharp');
const { Jimp } = require("jimp");
// const PaystackPop = require('@paystack/inline-js');
const https = require('https');



const app = express();
app.use(
    cors({
        origin: ["*"],
        credentials: true,
    })
);

const publicDirectoryPath = path.join(__dirname, '../Public');
app.use(express.static(publicDirectoryPath));
app.use(express.static(__dirname + '/Public')); //for static css and js files

app.use('/css', express.static(__dirname + '/Public/css'));
app.use('/js', express.static(__dirname + '/Public/js'));
app.use('/img', express.static(__dirname + '/Public/img'));

//to be able to recieve json form frontend
app.use(cookieParser());
app.use(express.json({
    limit: "20mb"
}));

// hbs.registerPartials(partialsPath);
hbs.registerPartials(__dirname + '/Templates/partials'); //for partials



app.set('views', './src/Views')
app.set('view engine', 'hbs');
mongoose.set('strictQuery', false);


let port = process.env.PORT || 3000;

//database 
const MongoClient = mongodb.MongoClient;
const databaseName = 'davidcy360africa';

//mongodb custom id
const objectID = mongodb.ObjectId;
const id = new objectID();

const uri = process.env.MONGODB_URL;

// const uri = `mongodb://localhost:27017/${databaseName}`;

mongoose.connect(uri).then(() => {
    console.log('connected');
})

const User = mongoose.model('User', {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    password: { type: String },
    customerID: { type: String },
    address: [{
        address1: { type: String },
        userNumber: { type: String },
        zipCode: { type: String },
        country: {
            value: { type: String },
            label: { type: String }
        },
        region: {
            value: { type: String },
            label: { type: String }
        }
    }],
    paymentMethods: [{
        name: { type: String },
        type: { type: String },
        url: { type: String }
    }],
    orders: [{
        packageID: { type: String },
        totalAmount: { type: String },
        status: { type: String },
        dateOfOrder: { type: String },
        deliveryPeriod: { type: String },
        dateOfDelivery: { type: String },
        deliveryAddress: { type: String },
        packages: [{
            quantity: { type: Number },
            name: { type: String },
            description: { type: String },
            url: [{
                public_id: { type: String },
                link: { type: String },
            }],
            urlLarge: [{
                public_id: { type: String },
                link: { type: String },
            }],
            color: { type: String },
            size: { type: String },
            quantity: { type: String },
            price: { type: String },
            weight: { type: String },
            currency: { type: String },
            currencySymbol: { type: String },
            materialType: [String],
            materialImage: { type: String },
            buttonNumber: { type: String },
        }]

    }],
    customizedOrders: [{
        packageID: { type: String },
        totalAmount: { type: String },
        status: { type: String },
        dateOfOrder: { type: String },
        deliveryPeriod: { type: String },
        dateOfDelivery: { type: String },
        deliveryAddress: { type: String },
        packages: [{
            quantity: { type: Number },
            name: { type: String },
            description: { type: String },
            url: [{
                public_id: { type: String },
                link: { type: String },
            }],
            urlLarge: [{
                public_id: { type: String },
                link: { type: String },
            }],
            color: { type: String },
            size: { type: String },
            quantity: { type: String },
            price: { type: String },
            weight: { type: String },
            currency: { type: String },
            currencySymbol: { type: String },
            materialType: [String],
            materialImage: { type: String },
            buttonNumber: { type: String },
        }]
    }],
})

const Admin = mongoose.model('Admin', {
    username: { type: String },
    password: { type: String },
    orders: [{
        packageID: { type: String },
        totalAmount: { type: String },
        status: { type: String },
        dateOfOrder: { type: String },
        deliveryPeriod: { type: String },
        dateOfDelivery: { type: String },
        deliveryAddress: { type: String },
        userData: [{
            firstName: { type: String },
            lastName: { type: String },
            email: { type: String },
            address: [{
                address1: { type: String },
                userNumber: { type: String },
                zipCode: { type: String },
                country: {
                    value: { type: String },
                    label: { type: String }
                }
            }],
        }],
        packages: [{
            quantity: { type: Number },
            name: { type: String },
            description: { type: String },
            url: [{
                public_id: { type: String },
                link: { type: String },
            }],
            urlLarge: [{
                public_id: { type: String },
                link: { type: String },
            }],
            color: { type: String },
            size: { type: String },
            quantity: { type: String },
            price: { type: String },
            weight: { type: String },
            currency: { type: String },
            currencySymbol: { type: String },
            materialType: [String],
            materialImage: { type: String },
            buttonNumber: { type: String },
        }]
    }],
    customizedOrders: [{
        packageID: { type: String },
        totalAmount: { type: String },
        status: { type: String },
        dateOfOrder: { type: String },
        deliveryPeriod: { type: String },
        dateOfDelivery: { type: String },
        deliveryAddress: { type: String },
        userData: [{
            firstName: { type: String },
            lastName: { type: String },
            email: { type: String },
            address: [{
                address1: { type: String },
                userNumber: { type: String },
                zipCode: { type: String },
                country: {
                    value: { type: String },
                    label: { type: String }
                }
            }],
        }],
        packages: [{
            quantity: { type: Number },
            name: { type: String },
            description: { type: String },
            url: [{
                public_id: { type: String },
                link: { type: String },
            }],
            urlLarge: [{
                public_id: { type: String },
                link: { type: String },
            }],
            color: { type: String },
            size: { type: String },
            quantity: { type: String },
            price: { type: String },
            weight: { type: String },
            currency: { type: String },
            currencySymbol: { type: String },
            materialType: [String],
            materialImage: { type: String },
            buttonNumber: { type: String },
        }]
    }],
})


const Products = mongoose.model('Products', {
    id: { type: String },
    category: { type: String },
    dateAdded: { type: String },
    soldOut: { type: Boolean },
    quantity: { type: Number },
    name: { type: String },
    description: { type: String },
    url: [{
        public_id: { type: String },
        link: { type: String }
    }],
    urlLarge: [{
        public_id: { type: String },
        link: { type: String }
    }],
    colors: [{ type: String }],
    sizes: [{ type: String }],
    price: { type: String },
    weight: { type: Number },
    currency: { type: String },
    currencySymbol: { type: String },
    materialType: [String],
    materialImage: { type: String },
    buttonNumber: { type: String },
})


const AdminDetails = mongoose.model('AdminDetails', {
    images: [
        {
            id: { type: String },
            url: { type: String },
            title: { type: String },
            subTitle: { type: String },
        }
    ],
    aboutUs: { type: String },
    deliveryFees: [
        {
            dhl: { type: String },
            weight: { type: String },
        }
    ],
    others: { type: String },
    currencyRates: [
        {
            region: { type: String },
            rate: { type: String },
            symbol: { type: String },
            sign: { type: String },
        }
    ],

})


const Faq = mongoose.model('faqs', {
    id: { type: String },
    question: { type: String },
    answer: { type: String },
})





async function mongooseSaveToDataBase({ firstName, middleName, lastName, email, password }) {
    //hash password
    let hashedPassword = await bcripyt.hash(password, 8);

    let me = new User({
        firstName,
        middleName,
        lastName,
        email,
        password: hashedPassword
    })

    me.save().then(() => {
        return
    }).catch((error) => {
        console.log('unable to save', error);
    })
}


//jwt
const jwtFunctionSigning = (userLoginDetails) => {
    const token = jwt.sign(userLoginDetails, 'thisismykey', { expiresIn: "24h" });

    res.cookie("token", token, {
        httpOnly: true,
        signed: true,
        secure: true
    })
}




//home page
app.get('', (req, res) => {
    res.render('index', {
        username: 'User',
    });
})


//signup and login page
app.get('/login', (req, res) => {
    res.render('login', {
        username: 'User',
    });
})


//signup and login page
app.get('/en/account', (req, res) => {
    res.render('profile', {
        username: 'User',
    });
})



let userVerificationCode = '';
let newUserDetailsToBeSaved = {};

//send verification email
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'davidcy360africa@gmail.com',
        pass: 'fajc hklm ptjc jmrj'
    }
});


function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


//sign up user
app.post('/login', (req, res) => {

    const userdata = req.body;
    if (!userdata) return res.status(400).send({ status: 'failed' });


    //check if user has an account already
    User.findOne({ email: userdata.email }).then(async (databaseUser) => {
        if (databaseUser) {
            //if user found 
            return res.status(200).send({ exist: true });
        }
    })

    // Usage:
    const customRandomInt = getRandomInteger(100000, 900000);
    userVerificationCode = customRandomInt;

    //assign to be saved in database
    newUserDetailsToBeSaved = userdata;


    //send confirmation mail
    let mailOptions = {
        from: 'davidcy360africa@gmail.com',
        to: userdata.email,
        subject: 'Confirmation Code',
        text: `Thank you for signing up to davidCy360, ${userdata.firstName}. Your one time confirmation code is ${userVerificationCode}.`
    };

    // validate email save to data
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return res.status(400).send({ status: 'failed' });
        } else {
            //if okay
            return res.status(200).send({ status: 'sucess' });
        }
    });
})



app.post('/verification', async (req, res) => {
    const userVerificationInput = req.body;

    if (!userVerificationInput) return res.status(400).send({ status: 'failed' });

    //confirm
    if (Number(userVerificationInput.userCodeInput) !== Number(userVerificationCode)) {
        return res.status(400).send({ status: 'failed' });
    }

    //hash password
    let hashedPassword = await bcripyt.hash(newUserDetailsToBeSaved.password, 8);

    let me = new User({
        firstName: newUserDetailsToBeSaved.firstName,
        lastName: newUserDetailsToBeSaved.lastName,
        email: newUserDetailsToBeSaved.email,
        password: hashedPassword,
        customerID: `DCY${Date.now()}`
    })

    me.save().then(() => {
        return res.status(200).send({ status: 'success', });
    }).catch((error) => {
        return error;
    })
});


//savedUserLogin
app.post('/userLogin', (req, res) => {
    const user = req.body;

    if (!user) return res.status(400).send({ status: 'failed' });

    const userEmail = user.email;
    const userPassword = user.password;

    User.findOne({ email: userEmail }).then(async (databaseUser) => {
        if (databaseUser) {
            //if user not found

            let userTokenInfo = {
                firstName: databaseUser.firstName,
                lastName: databaseUser.lastName,
                email: databaseUser.email
            }

            //check password
            const isMatch = await bcripyt.compare(userPassword, databaseUser.password);
            if (!isMatch) {
                //user password does not match
                return res.status(400).send({ status: 'failed' });
            }

            //set cookies for token
            const token = jwt.sign(userTokenInfo, process.env.SECRET_KEY);

            res.cookie("token", token, {
                origin: "*",
                // expires: new Date(Date.now() + 10000),
                httpOnly: true,
                secure: true,
                sameSite: "none",
            })
                .cookie("checkToken", true, {
                    origin: "*",
                    // expires: new Date(Date.now() + 10000),
                    secure: true,
                    sameSite: "none",
                }).status(200).send({ status: 'sucess', email: databaseUser.email })

        } else {
            return res.status(400).send({ status: 'failed' });
        }


    }).catch((error) => {
        //user not found
        console.log(error)
        return res.status(400).send({ status: 'failed' });
    });
})


//savedUserLogout
app.post('/user/profile/logout', cookieJwtAuth, (req, res) => {
    //authenfied user
    //logout user
    res.clearCookie("token");
    res.status(200).send({ status: 'success', loggedOut: true });
    res.end();
});


//view user profile
app.post('/user/profile', cookieJwtAuth, (req, res) => {
    //authenfied user
    res.status(200).send({ status: 'authentified' });
});




app.use('/user/profile/details', cookieJwtAuth, (req, res) => {
    //authenfied user
    // const userRequiredData = findUserDetails(req.user.email);
    User.findOne({ email: req.user.email }).then(async (databaseUser) => {

        if (databaseUser == undefined) return res.status(400).send({ data: 'failed' });

        if (databaseUser) {
            let userTokenInfo = {
                firstName: databaseUser.firstName,
                lastName: databaseUser.lastName,
                email: databaseUser.email,
                address: databaseUser.address,
                orders: databaseUser.orders,
                paymentMethods: databaseUser.paymentMethods
            }

            res.status(200).send({ data: userTokenInfo, authenticated: true });
        }
    }).catch((error) => {
        //user not found
        return undefined;
    });

});



//authenticate open user details (for profile name edith)
app.post('/edith/myProfile', cookieJwtAuth, (req, res) => {
    //authentified
    const user = req.body;

    if (!user) return res.status(400).send({ status: 'failed' });

    const userEmail = user.email;
    const userPassword = user.password;
    const newFirstName = user.newFirstName;
    const newLastName = user.newLastName;


    User.findOne({ email: userEmail }).then(async (databaseUser) => {

        if (databaseUser) {
            //if user found
            //check password

            const isMatch = await bcripyt.compare(userPassword, databaseUser.password);
            if (!isMatch) {
                //user password does not match
                return res.status(400).send({ status: 'failed' });
            } else {
                //save user new details
                User.findByIdAndUpdate(databaseUser._id, {
                    firstName: newFirstName,
                    lastName: newLastName,
                }).then((result) => {
                    res.status(200).send({ status: 'success', passwordChanged: true });
                }).catch((e) => {
                    console.log(e)
                    return res.status(400).send({ status: 'failed', message: 'failed to make changes!' });
                })
            }

        } else {
            return res.status(400).send({ status: 'failed' });
        }


    }).catch((error) => {
        //user not found
        return res.status(400).send({ status: 'failed' });
    });
})


//authenticate open user details (for password change)
app.post('/edith/password', cookieJwtAuth, (req, res) => {
    //authentified
    const user = req.body;

    if (!user) return res.status(400).send({ status: 'failed' });

    const userEmail = user.email;
    const userPassword = user.password;
    const userNewPassword = user.userNewPassword;


    User.findOne({ email: userEmail }).then(async (databaseUser) => {

        if (databaseUser) {
            //if user found
            //check password

            const isMatch = await bcripyt.compare(userPassword, databaseUser.password);
            if (!isMatch) {
                //user password does not match
                return res.status(400).send({ status: 'failed', isWrongPassword: true });
            } else {
                //hash new password
                //hash password
                let hashedPassword = await bcripyt.hash(userNewPassword, 8);
                //save user new details
                User.findByIdAndUpdate(databaseUser._id, {
                    password: hashedPassword
                }).then((result) => {
                    res.status(200).send({ status: 'success', passwordChanged: true });
                }).catch((e) => {
                    return res.status(400).send({ status: 'failed', message: 'failed to make changes!' });
                })
            }

        } else {
            return res.status(400).send({ status: 'failed' });
        }


    }).catch((error) => {
        //user not found
        return res.status(400).send({ status: 'failed' });
    });
})


//authenticate open user details (for adding address)
app.post('/edith/add-address', cookieJwtAuth, (req, res) => {
    //authentified
    const user = req.body;

    if (!user) return res.status(400).send({ status: 'failed' });

    const userEmail = user.email;
    const userPassword = user.password;

    const addressOne = user.addressOne;
    const userNumber = user.userNumber;
    const zipCode = user.zipCode;
    const selectedCountry = user.selectedCountry;
    const selectedRegion = user.selectedRegion;



    User.findOne({ email: userEmail }).then(async (databaseUser) => {

        if (databaseUser) {
            //if user found
            //check password

            const isMatch = await bcripyt.compare(userPassword, databaseUser.password);
            if (!isMatch) {
                //user password does not match
                return res.status(400).send({ status: 'failed', isWrongPassword: true });
            } else {
                //get previous user address array
                let prevAddressArray = databaseUser.address;
                let newAddressArray = [...prevAddressArray, {
                    address1: addressOne,
                    userNumber: userNumber,
                    zipCode: zipCode,
                    country: selectedCountry,
                    region: selectedRegion
                }]
                //save user new details
                User.findByIdAndUpdate(databaseUser._id, {
                    address: newAddressArray
                }).then((result) => {
                    res.status(200).send({ status: 'success', addressAdded: true });
                }).catch((e) => {
                    return res.status(400).send({ status: 'failed', message: 'failed to make changes!' });
                })
            }

        } else {
            return res.status(400).send({ status: 'failed' });
        }


    }).catch((error) => {
        //user not found
        return res.status(400).send({ status: 'failed' });
    });
})


//authenticate open user details (for deleting address)
app.post('/edith/delete-address', cookieJwtAuth, (req, res) => {
    //authentified
    const user = req.body;

    if (!user) return res.status(400).send({ status: 'failed' });

    const userEmail = user.email;

    const addressID = user.id;



    User.findOne({ email: userEmail }).then(async (databaseUser) => {

        if (databaseUser) {
            //if user found

            let emptyArray = [];

            databaseUser.address.map((item, index) => {
                // console.log(String(item._id), addressID)
                if (String(item._id) !== addressID) {
                    emptyArray.push(item);
                }
            })


            //save user new details
            User.findByIdAndUpdate(databaseUser._id, {
                address: emptyArray
            }).then((result) => {
                let newUserData = result;
                newUserData.address = emptyArray;
                return res.status(200).send({ status: 'success', addressDeleted: true, data: newUserData });
            }).catch((e) => {
                return res.status(400).send({ status: 'failed', message: 'failed to make changes!', addressDeleted: false });
            })


        } else {
            return res.status(400).send({ status: 'failed', addressDeleted: false });
        }


    }).catch((error) => {
        //user not found
        return res.status(400).send({ status: 'failed', addressDeleted: false });
    });
})



//authenticate open user details (for posting orders)
app.post('/edith/post-cart-orders', cookieJwtAuth, (req, res) => {
    //authentified
    const user = req.body;

    if (!user) return res.status(400).send({ status: 'failed' });

    const userEmail = user.email;
    const userData = user.userData;

    const orders = user.orders;
    const totalAmount = user.totalAmount;
    const packageID = user.packageID;


    //weight, images, description, status
    const status = user.status;
    const dateOfOrder = user.dateOfOrder;
    const deliveryPeriod = user.deliveryPeriod;
    const dateOfDelivery = user.dateOfDelivery;
    const deliveryAddress = user.deliveryAddress


    // return console.log(orders)


    User.findOne({ email: userEmail }).then(async (databaseUser) => {

        if (databaseUser) {
            //if user found

            //get previous user address array (array user data)
            let prevOrdersArray1 = databaseUser.orders;
            let prevOrderPackages1 = databaseUser.orders.packages;

            let newOrdersArray1 = []

            if (prevOrderPackages1 === undefined) {
                newOrdersArray1 = [...prevOrdersArray1, {
                    packageID,
                    totalAmount,
                    status,
                    dateOfOrder,
                    deliveryPeriod,
                    dateOfDelivery,
                    deliveryAddress,
                    packages: [...orders]
                }];
            } else {
                newOrdersArray1 = [...prevOrdersArray1, {
                    packageID,
                    totalAmount,
                    status,
                    dateOfOrder,
                    deliveryPeriod,
                    dateOfDelivery,
                    deliveryAddress,
                    packages: [...prevOrderPackages1, ...orders]
                }];
            }


            //add to environment variale
            admin_email = process.env.ADMIN_USERNAME;

            //save user new details (orders)
            User.findByIdAndUpdate(databaseUser._id, {
                orders: newOrdersArray1
            }).then((result) => {
                // res.status(200).send({ status: 'success', cartAdded: true });
            }).catch((e) => {
                return res.status(400).send({ status: 'failed', cartAdded: false, message: 'failed to make changes!' });
            })





            //get previous user address array (array Admin data)
            let prevOrdersArray = databaseUser.orders;
            let prevOrderPackages = databaseUser.orders.packages;

            let newOrdersArray = [];

            // console.log(userData)

            if (prevOrderPackages === undefined) {
                newOrdersArray = [...prevOrdersArray, {
                    packageID,
                    totalAmount,
                    status,
                    dateOfOrder,
                    deliveryPeriod,
                    dateOfDelivery,
                    userData,
                    deliveryAddress,
                    packages: [...orders]
                }];
            } else {
                newOrdersArray = [...prevOrdersArray, {
                    packageID,
                    totalAmount,
                    status,
                    dateOfOrder,
                    deliveryPeriod,
                    dateOfDelivery,
                    userData,
                    deliveryAddress,
                    packages: [...prevOrderPackages, ...orders]
                }];
            }



            //save Admin new details (orders)
            Admin.findOneAndUpdate({ username: admin_email }, {
                orders: newOrdersArray
            }).then((result) => {
                return res.status(200).send({ status: 'success', cartAdded: true });
            }).catch((e) => {
                return res.status(400).send({ status: 'failed', cartAdded: false, message: 'failed to make changes!' });
            })

        } else {
            return res.status(400).send({ status: 'failed', cartAdded: false, });
        }


    }).catch((error) => {
        //user not found
        return res.status(400).send({ status: 'failed', cartAdded: false, });
    });
})



//authenticate open user details (for cancelling orders)
app.post('/edith/cancel-cart-orders', cookieJwtAuth, (req, res) => {
    //authentified
    const user = req.body;

    if (!user) return res.status(400).send({ status: 'failed', orderCancelled: false });

    const packageID = user.packageID;
    const userEmail = user.email;



    User.findOne({ email: userEmail }).then(async (databaseUser) => {

        if (databaseUser) {
            //if user found

            //get previous user address array (array user data)
            let prevOrdersArray1 = databaseUser.orders;

            prevOrdersArray1.map((item, index) => {
                if (packageID === item.packageID) {
                    item.status = "Cancelled"
                }
            })

            // console.log(packageID)

            // return console.log(prevOrdersArray1)



            //add to environment variale
            admin_email = process.env.ADMIN_USERNAME;

            //save user new details (orders)
            User.findByIdAndUpdate(databaseUser._id, {
                orders: prevOrdersArray1
            }).then((result) => {
                // res.status(200).send({ status: 'success', cartAdded: true });
            }).catch((e) => {
                return res.status(400).send({ status: 'failed', orderCancelled: false, message: 'failed to make changes!' });
            })





            //get previous user address array (array Admin data)
            let prevOrdersArray = databaseUser.orders;

            prevOrdersArray.map((item, index) => {
                if (packageID === item.packageID) {
                    item.status = "Cancelled"
                }
            })


            //save Admin new details (orders)
            Admin.findOneAndUpdate({ email: admin_email }, {
                orders: prevOrdersArray
            }).then((result) => {
                return res.status(200).send({ status: 'success', orderCancelled: true });
            }).catch((e) => {
                return res.status(400).send({ status: 'failed', orderCancelled: false, message: 'failed to make changes!' });
            })

        } else {
            return res.status(400).send({ status: 'failed', orderCancelled: false, });
        }


    }).catch((error) => {
        //user not found
        return res.status(400).send({ status: 'failed', orderCancelled: false, message: error });
    });
})


//get all products (home page products load 6)
app.get('/davidcy360/all-products', async (req, res) => {

    const limit = req.query.limit;
    const page = req.query.page;


    try {
        let allProducts = await Products.find({});

        let limitedProducts = [];

        let i_start = ((Number(page) - 1) * Number(limit));
        if (i_start < 0) i_start = 0;


        let i_end = (Number(page) * Number(limit));
        if (i_start == 0) i_end = (Number(page) * Number(limit));



        for (let i = i_start; i < i_end; i++) {
            limitedProducts.push(allProducts[i]);
        }


        // console.log(i_start, i_end)

        //filter null 
        let filteredLimitedProducts = [];



        limitedProducts.map((item, index) => {
            // console.log(typeof item)
            if (item !== undefined) {
                filteredLimitedProducts.push(item);
            }
        })


        return res.status(200).send({ status: 'success', data: filteredLimitedProducts, loaded: true });

    } catch (error) {
        return res.status(400).send({ status: 'failed', message: error, loaded: false });
    }
})


//get all products (category page products load 12)
app.get('/davidcy360/all-products/category', async (req, res) => {

    const limit = req.query.limit;
    const page = req.query.page;
    const filter = req.query.category;

    // const searchFilter = req.query.filter;
    // let searchWord;

    // console.log(searchFilter)


    try {
        let allProducts = await Products.find({});

        let searchFilterArray = [];

        // if (searchFilter !== undefined) {
        //     if (searchFilter === 'searchByName') {
        //         searchWord = req.query.searchTearm;

        //         for (let i = 0; i < allProducts.length; i++) {
        //             console.log(allProducts[i].name.toLowerCase().trim(), searchWord.toLowerCase().trim())

        //             if (allProducts[i].name.toLowerCase().trim().includes(searchWord.toLowerCase().trim())) {
        //                 searchFilterArray.push(allProducts[i]);
        //             }
        //         }
        //     }
        // } else {
        //     searchFilterArray = allProducts;
        // }

        searchFilterArray = allProducts;

        let filterArray = [];
        let limitedProducts = [];

        let i_start = ((Number(page) - 1) * Number(limit));
        if (i_start < 0) i_start = 0;


        let i_end = (Number(page) * Number(limit));
        if (i_start == 0) i_end = (Number(page) * Number(limit));


        //get products with selected category
        for (let i = 0; i < searchFilterArray.length; i++) {
            if ((searchFilterArray[i].category).toLowerCase() === filter.toLowerCase()) {
                filterArray.push(allProducts[i]);
            }
        }

        // console.log(filterArray)

        if (filterArray.length > 0) {

            //get page number and limit
            for (let i = i_start; i < i_end; i++) {
                limitedProducts.push(filterArray[i]);
            }

        }

        //filter null 
        let filteredLimitedProducts = [];


        limitedProducts.map((item, index) => {
            // console.log(typeof item)
            if (item !== undefined) {
                filteredLimitedProducts.push(item);
            }
        })

        return res.status(200).send({ status: 'success', data: filteredLimitedProducts, loaded: true });

    } catch (error) {
        return res.status(400).send({ status: 'failed', message: error, loaded: false });
    }
})





//get all FAQs  
app.get('/davidcy360/all-settings', async (req, res) => {
    try {
        let allSettings = await AdminDetails.find({});
        let faqs = await Faq.find({});
        return res.status(200).send({ status: 'success', data: allSettings, faqs, found: true });
    } catch (error) {
        return res.status(400).send({ status: 'failed', message: error, found: false });
    }
})



app.get('/paystack', (req, res) => {

    const params = JSON.stringify({
        "email": req.query.email,
        "amount": req.query.amount
    })

    const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: '/transaction/initialize',
        method: 'POST',
        headers: {
            Authorization: 'Bearer sk_test_3758aab3dda0a07c4961c3d37761cbfa34e662ea',
            'Content-Type': 'application/json'
        }
    }

    const reqpaystack = https.request(options, respaystack => {
        let data = ''

        respaystack.on('data', (chunk) => {
            data += chunk
        });

        respaystack.on('end', () => {
            res.send(data)
            // console.log(JSON.parse(data))
        })
    }).on('error', error => {
        res.send(error)
        // console.error(error)
    })

    reqpaystack.write(params)
    reqpaystack.end()
})





//Admin login
app.post('/v1/O19VvUGFTDS5sxIlLmMnhytTredfshJJDG0Oogyw/Admin/login', (req, res) => {
    const user = req.body;

    if (!user) return res.status(400).send({ status: 'failed' });

    const userName = user.userName;
    const userPassword = user.password;

    Admin.findOne({ username: userName }).then(async (databaseAdmin) => {
        if (databaseAdmin) {
            //if admin found
            let userTokenInfo = {
                userName: databaseAdmin.username
            }

            // console.log(userPassword, databaseAdmin.password);

            if (userPassword !== databaseAdmin.password) {
                return res.status(400).send({ status: 'failed' });
            }

            // //check password
            // const isMatch = await bcripyt.compare(userPassword, databaseAdmin.password);
            // if (!isMatch) {
            //     //user password does not match
            //     return res.status(400).send({ status: 'failed' });
            // }

            //set cookies for token
            const token = jwt.sign(userTokenInfo, process.env.SECRET_KEY_ADMIN);

            res.cookie("HeadToken", token, {
                origin: "*",
                // expires: new Date(Date.now() + 10000),
                httpOnly: true,
                secure: true,
                sameSite: "none",
            })
                .cookie("checkToken", true, {
                    origin: "*",
                    // expires: new Date(Date.now() + 10000),
                    secure: true,
                    sameSite: "none",
                }).status(200).send({ status: 'sucess', userName: databaseAdmin.userName })

        } else {
            return res.status(400).send({ status: 'failed' });
        }


    }).catch((error) => {
        //user not found
        return res.status(400).send({ status: 'failed', message: error });
    });
})


//savedUserLogout
app.post('/v1/O19VvUGFTDS5sxIlLmMnhytTredfshJJDG0Oogyw/Admin/logout', cookieJwtAuthAdmin, (req, res) => {
    //authenfied user
    //logout user
    res.clearCookie("HeadToken");
    res.status(200).send({ status: 'success', loggedOut: true });
    res.end();
});


app.post('/v1/O19VvUGFTDS5sxIlLmMnhytTredfshJJDG0Oogyw/Admin/getAllOrders', cookieJwtAuthAdmin, (req, res) => {
    //authenfied user

    // console.log(req.admin.userName)
    // const userRequiredData = findUserDetails(req.user.email);
    // let admin_email = "Admin0001"
    Admin.findOne({ username: req.admin.userName }).then(async (adminDetails) => {

        if (adminDetails == undefined) return res.status(400).send({ data: 'failed', isFound: false });

        if (adminDetails) {

            let toSendDetails = {
                orders: adminDetails.orders,
                customizedOrders: adminDetails.customizedOrders
            }

            res.status(200).send({ data: toSendDetails, isFound: true });
        }
    }).catch((error) => {
        //user not found
        return undefined;
    });

});


app.post('/v1/O19VvUGFTDS5sxIlLmMnhytTredfshJJDG0Oogyw/Admin/change-order-status', cookieJwtAuthAdmin, (req, res) => {
    //authenfied user
    //authentified
    const user = req.body;

    if (!user) return res.status(400).send({ status: 'failed' });

    const userEmail = user.userEmail;
    const packageID = user.packageID;
    const newStatus = user.newStatus;

    User.findOne({ email: userEmail }).then(async (userDetails) => {

        if (userDetails == undefined) return res.status(400).send({ data: 'failed', isFound: false });

        if (userDetails) {
            //get the package by ID
            let newOrderArray = [];

            userDetails.orders.map((item, index) => {
                if (item.packageID === packageID) {
                    item.status = newStatus;
                }
            });

            newOrderArray = userDetails.orders;


            //update user
            User.findByIdAndUpdate(userDetails._id, {
                orders: newOrderArray
            }).then((result) => {
                // res.status(200).send({ status: 'success', cartAdded: true });
            }).catch((e) => {
                return res.status(400).send({ status: 'failed', statusChanged: false, message: 'failed to make changes!' });
            })

            // const userRequiredData = findUserDetails(req.user.email);
            // let admin_email = "Admin0001"

            Admin.findOne({ username: req.admin.userName }).then(async (adminDetails) => {

                //get the package by ID
                let newOrderArrayAdmin = [];

                adminDetails.orders.map((item, index) => {
                    if (item.packageID === packageID) {
                        item.status = newStatus;
                    }
                });

                newOrderArrayAdmin = adminDetails.orders;

                //save Admin new details (orders)
                Admin.findOneAndUpdate({ email: adminDetails.email }, {
                    orders: newOrderArrayAdmin
                }).then((result) => {
                    return res.status(200).send({ status: 'success', statusChanged: true });
                }).catch((e) => {
                    return res.status(400).send({ status: 'failed', statusChanged: false, message: 'failed to make changes!' });
                })
            })

        } else {
            return res.status(400).send({ status: 'failed', statusChanged: false, });
        }

    }).catch((error) => {
        //user not found
        return undefined;
    });




});



//upload image to cloudinary an save to database
app.post('/v1/O19VvUGFTDS5sxIlLmMnhytTredfshJJDG0Oogyw/Admin/post-product', cookieJwtAuthAdmin, async (req, res) => {
    //authenfied user
    const user = req.body;

    if (!user) return res.status(400).send({ status: 'failed' });

    const images = user.imageArray;
    let uploadedImagesArray = [];

    let largeUploadedImagesArray = [];



    try {
        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.uploader.upload(images[i], {
                width: 512, // Desired width
                height: 512, // Desired height
                crop: "fill", // Cropping mode
                folder: '/products'
            });
            // return console.log(result)
            uploadedImagesArray.push({
                link: result.secure_url,
                public_id: result.public_id
            });
        }

        // for (let i = 0; i < images.length; i++) {
        //     const result = await cloudinary.uploader.upload(images[i], {
        //         width: 2080, // Desired width
        //         height: 2080, // Desired height
        //         crop: "fill", // Cropping mode
        //         folder: '/products'
        //     });
        //     // return console.log(result)
        //     largeUploadedImagesArray.push({
        //         link: result.secure_url,
        //         public_id: result.public_id
        //     });
        // }


        // console.log(uploadedImagesArray)


        // //increase image size with sharp
        // for (let i = 0; i < uploadedImagesArray.length; i++) {
        //     const resizedImages = await sharp(uploadedImagesArray[i].link)
        //         .resize(2000, 2000, { withoutEnlargement: true, fit: 'inside' })
        //         .withMetadata()
        //         .png({ quality: 80 })
        //         .toBuffer()

        //     largeImagesArray.push(resizedImages);
        // }


        // //increase image size with sharp
        // for (let i = 0; i < uploadedImagesArray.length; i++) {

        //     // open a file called "lenna.png"
        //     const resizedImage = await Jimp.read(uploadedImagesArray[i].link);

        //     resizedImage.resize(1000, 1000); // resize


        //     largeImagesArray.push(resizedImage);
        // }





        // console.log(largeImagesArray)





        // for (let i = 0; i < largeImagesArray.length; i++) {
        //     const result = await cloudinary.uploader.upload(largeImagesArray[i], {
        //         folder: '/products'
        //     });
        //     // return console.log(result)
        //     largeUploadedImagesArray.push(
        //         {
        //             link: result.secure_url,
        //             public_id: result.public_id
        //         }
        //     );
        // }

        // console.log(largeUploadedImagesArray)




        // let allProducts = await Products.find({});


        let newAdminProducts = new Products({
            id: Date.now(),
            category: user.selectedCategory.label,
            dateAdded: new Date().toLocaleString(),
            soldOut: false,
            quantity: user.productQuantity,
            name: user.productName,
            description: user.productDescription,
            url: uploadedImagesArray,
            urlLarge: largeUploadedImagesArray,
            colors: user.colors,
            price: user.productPrice,
            weight: user.productWeight,
            sizes: user.availableSizes
        })

        // console.log(newAdminProducts)

        newAdminProducts.save().then(() => {
            return res.status(200).send({ status: 'success', productPosted: true });
        }).catch((error) => {
            return res.status(400).send({ status: 'failed', productPosted: false, message: error });
        });



    } catch (error) {
        return res.status(400).send({ status: 'failed', productPosted: false, message: error });
    }

});


//Admin get all products
app.get('/v1/O19VvUGFTDS5sxIlLmMnhytTredfshJJDG0Oogyw/Admin/all-products', cookieJwtAuthAdmin, async (req, res) => {

    try {
        let allProducts = await Products.find({});
        return res.status(200).send({ status: 'success', isFound: true, data: allProducts });

    } catch (error) {
        return res.status(400).send({ status: 'failed', message: error });
    }
})


//Admin delete a product
app.post('/v1/O19VvUGFTDS5sxIlLmMnhytTredfshJJDG0Oogyw/Admin/products/delete-product', cookieJwtAuthAdmin, async (req, res) => {

    const user = req.body;

    if (!user) return res.status(400).send({ status: 'failed' });

    const id = user.id;
    const imageId = user.imageId

    try {

        //array of images
        for (let i = 0; i < imageId.length; i++) {
            //delete image from cloudinary
            await cloudinary.uploader.destroy(imageId[i].public_id);
        }

        let allProducts = await Products.findOneAndDelete({ id: id });
        return res.status(200).send({ status: 'success', isDeleted: true });

    } catch (error) {
        return res.status(400).send({ status: 'failed', isDeleted: false, message: error });
    }
})

//Admin delete all product
app.post('/v1/O19VvUGFTDS5sxIlLmMnhytTredfshJJDG0Oogyw/Admin/products/delete-all-product', cookieJwtAuthAdmin, async (req, res) => {

    const user = req.body;

    if (!user) return res.status(400).send({ status: 'failed' });

    const products = user.allProducts;

    try {

        //array of images
        for (let i = 0; i < products.length; i++) {
            for (let k = 0; k < products[i].url.length; k++) {
                //delete image from cloudinary
                await cloudinary.uploader.destroy(products[i].url[k].public_id);
            }
        }

        for (let i = 0; i < products.length; i++) {
            await Products.findOneAndDelete({ id: products[i].id });
        }


        return res.status(200).send({ status: 'success', isDeleted: true });

    } catch (error) {
        return res.status(400).send({ status: 'failed', isDeleted: false, message: error });
    }
})


//Admin get all customers
app.get('/v1/O19VvUGFTDS5sxIlLmMnhytTredfshJJDG0Oogyw/Admin/all-customers', cookieJwtAuthAdmin, async (req, res) => {

    try {
        let allCustomers = await User.find({});
        return res.status(200).send({ status: 'success', found: true, data: allCustomers });

    } catch (error) {
        return res.status(400).send({ status: 'failed', found: false, message: error });
    }
})


//Admin save settings
app.post('/v1/O19VvUGFTDS5sxIlLmMnhytTredfshJJDG0Oogyw/Admin/save-settings/home-images', cookieJwtAuthAdmin, async (req, res) => {

    const user = req.body;

    if (!user) return res.status(400).send({ status: 'failed' });

    let uploadUrlArray = [];

    const images = user.data;


    try {
        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.uploader.upload(images[i].url, {
                folder: '/HomeImages'
            });
            // return console.log(result)
            uploadUrlArray.push({
                url: result.secure_url,
                title: images[i].title,
                subTitle: images[i].subTitle,
                id: images[i].id
            });
        }
    } catch (error) {
        return res.status(400).send({ status: 'failed', isSaved: false, message: error });
    }


    let details = await AdminDetails.find({});

    if (details.length == 0) {

        let settings = new AdminDetails({
            images: uploadUrlArray
        })

        settings.save().then(() => {
            return res.status(200).send({ status: 'success', isSaved: true });
        }).catch((error) => {
            return res.status(400).send({ status: 'failed', isSaved: false, message: error });
        })
    } else {
        //save Admin details (home images)
        AdminDetails.findByIdAndUpdate(details[0]._id, {
            images: uploadUrlArray
        }).then((result) => {
            return res.status(200).send({ status: 'success', isSaved: true });
        }).catch((error) => {
            return res.status(400).send({ status: 'failed', isSaved: false, message: error });
        })
    }




})



//Admin get all settings frrom admin details
app.get('/v1/O19VvUGFTDS5sxIlLmMnhytTredfshJJDG0Oogyw/Admin/all-settings', cookieJwtAuthAdmin, async (req, res) => {

    try {
        let allSettings = await AdminDetails.find({});
        return res.status(200).send({ status: 'success', found: true, data: allSettings });

    } catch (error) {
        return res.status(400).send({ status: 'failed', found: false, message: error });
    }
})



//Admin save settings
app.post('/v1/O19VvUGFTDS5sxIlLmMnhytTredfshJJDG0Oogyw/Admin/save-settings/about-us', cookieJwtAuthAdmin, async (req, res) => {

    const user = req.body;

    if (!user) return res.status(400).send({ status: 'failed' });


    let details = await AdminDetails.find({});


    if (details.length === 0) {

        let settings = new AdminDetails({
            aboutUs: user.text
        })

        settings.save().then(() => {
            return res.status(200).send({ status: 'success', isSaved: true });
        }).catch((error) => {
            return res.status(400).send({ status: 'failed', isSaved: false, message: error });
        })

    } else {
        //save Admin details (home images)
        AdminDetails.findByIdAndUpdate(details[0]._id, {
            aboutUs: user.text
        }).then((result) => {
            return res.status(200).send({ status: 'success', isSaved: true });
        }).catch((error) => {
            return res.status(400).send({ status: 'failed', isSaved: false, message: error });
        })
    }


})


//Admin save settings
app.post('/v1/O19VvUGFTDS5sxIlLmMnhytTredfshJJDG0Oogyw/Admin/save-settings/save-currency-rates', cookieJwtAuthAdmin, async (req, res) => {

    const user = req.body;

    if (!user) return res.status(400).send({ status: 'failed' });


    let details = await AdminDetails.find({});

    // console.log(details)s


    if (details.length === 0) {

        let settings = new AdminDetails({
            currencyRates: user.rates
        })

        settings.save().then(() => {
            return res.status(200).send({ status: 'success', isSaved: true });
        }).catch((error) => {
            // console.log(error)
            return res.status(400).send({ status: 'failed', isSaved: false, message: error });
        })

    } else {
        //save Admin details (home images)
        AdminDetails.findByIdAndUpdate(details[0]._id, {
            currencyRates: user.rates
        }).then((result) => {
            return res.status(200).send({ status: 'success', isSaved: true });
        }).catch((error) => {
            // console.log(error)
            return res.status(400).send({ status: 'failed', isSaved: false, message: error });
        })
    }


})


//add faq
app.post('/v1/O19VvUGFTDS5sxIlLmMnhytTredfshJJDG0Oogyw/Admin/save-settings/add-faq', cookieJwtAuthAdmin, async (req, res) => {

    const user = req.body;

    const question = user.question;
    const answer = user.answer

    if (!user) return res.status(400).send({ status: 'failed' });


    //admin add category
    let category = new Faq({
        id: Date.now(),
        question,
        answer
    })

    category.save().then(() => {
        return res.status(200).send({ status: 'success', added: true });
    }).catch((error) => {
        return res.status(400).send({ status: 'failed', added: false, message: error });
    })


})


//delete faq
app.post('/v1/O19VvUGFTDS5sxIlLmMnhytTredfshJJDG0Oogyw/Admin/save-settings/delete-faq', cookieJwtAuthAdmin, async (req, res) => {

    const user = req.body;

    const faqID = user.faqID;

    if (!user) return res.status(400).send({ status: 'failed' });


    //save Admin details (home images)
    Faq.findOneAndDelete({ id: faqID }).then((result) => {
        return res.status(200).send({ status: 'success', deleted: true });
    }).catch((error) => {
        return res.status(400).send({ status: 'failed', deleted: false, message: error });
    })

})





// edith profile page 
app.get('/en/profile', (req, res) => {
    res.render('edithProfile', {
        username: 'User',
    });
})


// edith password page 
app.get('/en/Account-EditPassword', (req, res) => {
    res.render('edithPassword', {
        username: 'User',
    });
})


// add address page 
app.get('/en/Account-AddAddress', (req, res) => {
    res.render('addAddress', {
        username: 'User',
    });
})




//support page
app.get('/en/overview', (req, res) => {
    res.render('support-overview', {
        username: 'User',
    });
})


//support page
app.get('/en/delivery-time-cost', (req, res) => {
    res.render('delivery-time-cost', {
        username: 'User',
    });
})





//authenticate open user details (for password)
app.post('/edith/myPassword', cookieJwtAuth, (req, res) => {
    //authentified
    res.status(200).send({ status: 'success' });
})




//updat user name, middle, last name
app.post('/edith/user/details', cookieJwtAuth, (req, res) => {
    // const userRequiredData = findUserDetails(req.user.email);
    User.findOne({ email: req.user.email }).then(async (databaseUser) => {

        if (databaseUser == undefined) return res.status(400).send({ data: 'failed' });


        //update database 

        res.status(200).send({ data: databaseUser });

    }).catch((error) => {
        //user not found
        return undefined;
    });
})




app.listen(port, () => {
    console.log('server is up on port 3000');
})