const express = require('express');
const passport = require('passport');
const gallery = new express.Router();
const jwt = require('jsonwebtoken');
const galleryModel = require('./../model/galleryModel');
const userModel = require('../model/userModel');
gallery.get('/', (req, res) => {
    try {
        galleryModel.find({}, { caption: 1, path: 1 }, async(err, succ) => {
            try {
                if (err)
                    throw {
                        code: 500,
                        msg: err
                    }
                if (!succ)
                    throw {
                        code: 404,
                        msg: "No Gallery"
                    }
                console.log(succ)
                responseSend(res, 200, succ)
            } catch (err) {
                responseSend(res, err.code ?
                    err.code : 500, {
                        status: err.code ? err.code : 500,
                        message: err.msg ? err.msg : err
                    })
            }

        }).sort({ createdDate: -1 })
    } catch (err) {
        responseSend(res, err.code ?
            err.code : 500, {
                status: err.code ? err.code : 500,
                message: err.msg ? err.msg : err
            })
    }

})
gallery.post('/upload', authenticateToken, (req, res) => {
    let errors = ['', null, undefined];
    try {
        if (!req.body || errors.includes(req.body.caption) ||
            errors.includes(req.body.path)
        )
            throw {
                code: 403,
                msg: "Something is missing"
            }
        let newGallery = new galleryModel({
            caption: req.body.caption,
            path: req.body.path,
            createdBy: req.user.username
        });
        newGallery.save((err, succ) => {
            try {
                if (err)
                    throw {
                        code: 500,
                        msg: err
                    }
                if (!succ)
                    throw {
                        code: 302,
                        msg: "Upload Failure"
                    }
                console.log(succ)
                responseSend(res, 200, "Upload Success")
            } catch (err) {
                responseSend(res, err.code ?
                    err.code : 500, {
                        status: err.code ? err.code : 500,
                        message: err.msg ? err.msg : err
                    })
            }
        })

    } catch (err) {
        console.log(err)
        responseSend(res, err.code ?
            err.code : 500, {
                status: err.code ? err.code : 500,
                message: err.msg ? err.msg : err
            })
    }
})

gallery.post('/delete', authenticateToken, (req, res) => {
    let errors = ['', null, undefined];
    try {
        if (!req.body || errors.includes(req.body._id))
            throw {
                code: 403,
                msg: "Something is missing"
            }
        console.log(req.body)
        galleryModel.deleteOne({ _id: req.body._id }, (err, succ) => {
            try {
                if (err)
                    throw {
                        code: 500,
                        msg: err
                    }
                if (!succ || succ.deletedCount != 1) {
                    console.log(succ);
                    throw {
                        code: 204,
                        msg: "Delete Failure"
                    }
                }
                console.log("-----", succ)
                responseSend(res, 200, { status: 200, message: "Delete Success" })
            } catch (err) {
                responseSend(res, err.code ?
                    err.code : 500, {
                        status: err.code ? err.code : 500,
                        message: err.msg ? err.msg : err
                    })
            }
        })

    } catch (err) {
        responseSend(res, err.code ?
            err.code : 500, {
                status: err.code ? err.code : 500,
                message: err.msg ? err.msg : err
            })
    }
})


gallery.post('/update', authenticateToken, (req, res) => {
    let errors = ['', null, undefined];
    try {
        if (!req.body || errors.includes(req.body.caption) ||
            errors.includes(req.body.path) || errors.includes(req.body.id))
            throw {
                code: 403,
                msg: "Something is missing"
            }
        galleryModel.updateMany({ _id: req.body.id }, {
                $set: {
                    updatedDate: new Date(),
                    updatedBy: req.user.username,
                    path: req.body.path,
                    caption: req.body.caption
                }
            },
            (err, succ) => {
                try {
                    if (err)
                        throw {
                            code: 500,
                            msg: err
                        }
                    if (!succ || succ.deletedCount != 1)
                        throw {
                            code: 302,
                            msg: "Updated Failure"
                        }
                    console.log(succ)
                    responseSend(res, 200, { message: "Updated Success" })
                } catch (err) {
                    responseSend(res, err.code ?
                        err.code : 500, {
                            status: err.code ? err.code : 500,
                            message: err.msg ? err.msg : err
                        })
                }
            })

    } catch (err) {
        responseSend(res, err.code ?
            err.code : 500, {
                status: err.code ? err.code : 500,
                message: err.msg ? err.msg : err
            })
    }
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null)
        return responseSend(res, 401, "UnAuthorized")

    jwt.verify(token, 'community', (err, user) => {
        console.log(err)
        if (err)
            return res.sendStatus(403)
        req.user = user
        next()
    })
}



/*** common response***/
function responseSend(res, statusCode, message) {
    res.status(statusCode)
        .json(message);
}
module.exports = gallery;