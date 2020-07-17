const express = require('express');
const user = new express.Router();
const jwt = require('jsonwebtoken');
const userModel = require('../model/userModel')

user.post('/register', (req, res) => {
    let errors = ['', null, undefined];
    try {
        if (!req.body || errors.includes(req.body.name) ||
            errors.includes(req.body.password) || errors.includes(req.body.userName) ||
            errors.includes(req.body.email) || errors.includes(req.body.mobileNo)
        )
            throw {
                code: 403,
                msg: "Something is missing"
            }
        let userDetails = new userModel({
            name: req.body.name,
            userName: req.body.userName,
            email: req.body.email,
            password: req.body.password,
            mobileNo: req.body.mobileNo
        });
        userDetails.save((err, succ) => {
            try {
                if (err) {
                    console.log("adad")
                    throw {
                        code: 500,
                        msg: err
                    }
                }
                if (!succ)
                    throw { code: 302, msg: "Creation Failed" }
                let jwtpayload = {};
                jwtpayload._id = succ._id;
                jwtpayload.userName = succ.userName;
                const userId = succ._id;
                const userName = succ.userName;
                const token = jwt.sign(jwtpayload, "community", { expiresIn: 1000000 });
                responseSend(res, 200, { token, status: 200, message: "Registered Successfully" })
            } catch (err) {
                console.log(err)
                responseSend(res, err.code ?
                    err.code : 500, {
                        status: err.code ? err.code : 500,
                        message: err.msg ? err.msg : err
                    })
            }
        })
    } catch (err) {
        console.log("<<<<<", err)
        responseSend(res, err.code ?
            err.code : 500, {
                status: err.code ? err.code : 500,
                message: err.msg ? err.msg : err
            })
    }
})
user.post('/login', (req, res) => {
    try {
        let errors = ['', null, undefined];
        if (!req.body ||
            errors.includes(req.body.password) || errors.includes(req.body.userName)
        )
            throw {
                code: 403,
                msg: "Oops Something is missing"
            }
        userModel.findOne({ userName: req.body.userName }, { userName: 1, password: 1 },
            (err, det) => {
                try {
                    if (err) throw err;
                    if (!det)
                        throw {
                            code: 403,
                            msg: "Unauthorized Entry"
                        }
                    det.comparePassword(req.body.password,
                        (err, isMatch) => {
                            if (err)
                                throw err
                            if (!isMatch)
                                throw {
                                    code: 403,
                                    msg: "Authentication Failed Wrong Password"
                                }
                            let jwtpayload = {};
                            jwtpayload._id = det._id;
                            jwtpayload.username = det.userName;
                            const token = jwt.sign(jwtpayload, "community");
                            responseSend(res, 200, { token: token, status: 200, message: "Successfully LoggedIn" })
                        })
                } catch (err) {
                    console.log("<<<<<", err)
                    responseSend(res, err.code ?
                        err.code : 500, {
                            status: err.code ? err.code : 500,
                            message: err.msg ? err.msg : err
                        })
                }
            })

    } catch (err) {
        console.log("<<<<<", err)
        responseSend(res, err.code ?
            err.code : 500, {
                status: err.code ? err.code : 500,
                message: err.msg ? err.msg : err
            })
    }
})

/*** common response***/
function responseSend(res, statusCode, message) {
    res.status(statusCode)
        .send(message);
}

module.exports = user;