const Tag = require("../models/tag.js").Tag
const User = require("../models/user.js").User
const Meme = require("../models/meme.js").Meme
const crypto = require('crypto')

// FIND USER BY USERNAME AND PASSWORD
module.exports.login = function (username, password) {
    return new Promise(function (resolve, reject) {
        User.findOne({
            username: username,
            password: crypto.createHash('md5').update(password).digest("hex")
        }).then((user) => {
            resolve(user)
        })
    })
}

// FIND USER BY USERNAME
module.exports.findUserByName = function (username) {
    return new Promise(function (resolve, reject) {
        User.findOne({
            username: username
        }).then((user) => {
            resolve(user)
        })
    })
}

// ADD NEW USER
module.exports.signup = function (user) {
    return new Promise(function (resolve, reject) {
        user.save().then((newUser) => {
            resolve(newUser)
        }, (err) => {
            reject(err)
        })
    })
}

// FIND USER BY ID
module.exports.findUserByID = function (id) {
    return new Promise(function (resolve, reject) {
        User.findOne({
            _id: id
        }).then((profile) => {
            resolve(profile)
        }, (err) => {
            reject(err)
        })
    })
}

// GET ALL USERS EXCEPT CURRENT USER
module.exports.getAllUsersExceptCurrent = function (name) {
    return new Promise(function (resolve, reject) {
        User.find({
            username: { $ne: name }
        }).then((users) => {
            resolve(users)
        }, (err) => {
            reject(err)
        })
    })
}

// ADD MEME TO USER
module.exports.addMemeToUser = function (username, m) {
    return new Promise(function (resolve, reject) {
        User.findOne({
            username: username
        }).then((user) => {
            user.memes.push(m)
            user.save().then((newUser) => {
                resolve(newUser)
            }, (err) => {
                reject(err)
            })
        })
    })
}

// FIND USER BASED ON MEME OWNER AND DELETE USERS COPY OF SAID MEME
module.exports.deleteUserMeme = function (owner, memeID) {
    return new Promise(function (resolve, reject) {
        User.findOne({
            username: owner
        }).then((user) => {
            for (var i = 0; i < user.memes.length; i++) {
                if (user.memes[i]._id == memeID) {
                    user.memes.splice(i, 1);
                    break;
                }
            }
            user.save().then((newUser) => {
                resolve(newUser)
            })
        })
    })
}

// UPDATE MEME's SHARED USERS WITHIN USER
module.exports.findMemeUserAndUpdateSharedUsers = function (id, newDoc) {
    return new Promise(function (resolve, reject) {
        User.find().then((users) => {
            var index = -1
            for (j = 0; j < users.length; j++) {
                for (k = 0; k < users[j].memes.length; k++) {
                    if (users[j].memes[k]._id.toString() === id.toString()) {
                        users[j].memes.splice(k,1)
                        users[j].memes.push(newDoc)
                        index = j
                        break;
                    }
                }
            }

            users[index].save().then((updatedUser)=>{
                resolve(updatedUser)
            }, (err)=>{
                reject(err)
            })
        })    
    })
}

// UPDATE MEME TITLE AND TAGS WITHIN USER
module.exports.findMemeUserAndUpdate = function(id, updatedDoc){
    return new Promise(function (resolve, reject) {
        User.find().then((users) => {
            var index = -1
            for (j = 0; j < users.length; j++) {
                for (k = 0; k < users[j].memes.length; k++) {
                    if (users[j].memes[k]._id.toString() === id.toString()) {
                        users[j].memes.splice(k,1)
                        users[j].memes.push(updatedDoc)
                        index = j
                        break;
                    }
                }
            }

            users[index].save().then((updatedUser)=>{
                resolve(updatedUser)
            }, (err)=>{
                reject(err)
            })
        })    
    })
}

/*

// UPDATE MEME COUNT WITHIN USER
function findMemeUserAndUpdateCount(req,res){
    User.findOne({
        memes._id:req.body.id
    }).then((user)=>{
        let memes = user.memes
        for (i=0;i<memes.length;i++){
            if (memes[i]._id==_id:req.body.id) {
                memes[i].upvotes = req.body.upvotes
                memes[i].downvotes = req.body.downvotes
                memes[i].save()
                break
            }
        }

        res.send({
            up:req.body.upvotes,
            down:req.body.downvotes
        })
    })
}
*/