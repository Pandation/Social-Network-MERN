const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllUsers = async (req,res) => {
    const users = await UserModel.find().select('-password')
    res.status(200).json(users);
}

module.exports.userInfo = (req,res) => {
    console.log(req.params);
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);

    UserModel.findById(req.params.id, (error, docs)=>{
        if(!error) res.send(docs) ; 
        else console.log('ID unknown : ' + error)
    }).select('-password');
}

module.exports.updateUser = async function (req, res) {
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id)

    try{
        await UserModel.findOneAndUpdate(
            {_id: req.params.id},
            {
                $set: {
                    bio : req.body.bio
                }
            },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
            },
            (err, docs) => {
                if(!err) return res.send(docs);
                if(err) return res.status(500).send({ message : err});
            }
        )
    }catch (err) {
        return res.status(500).send({ message : err});
    }
}

module.exports.deleteUser = async function (req,res) {
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id)

    await UserModel.findByIdAndDelete(
            req.params.id,
            (err) =>{
                if(!err) res.status(201).send('User deleted');
                else return res.status(400).json(err);
            })
}


module.exports.follow = async (req,res) => {
    if(!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow))
    return res.status(400).send('ID unknown : ' + req.params.id)

    try{
        // add to follower list
        await UserModel.findByIdAndUpdate(
            req.params.id,
            { $addToSet : { following : req.body.idToFollow}},
            { new: true, upsert: true},
            (err, docs) =>{
                if(!err) res.status(201).json(docs);
                else return res.status(400).json(err);
            }
        );
        // add to following list
        await UserModel.findByIdAndUpdate(
            req.body.idToFollow,
            { $addToSet: { followers : req.params.id}},
            { new: true , upsert: true},
            (err, docs)=> {
                if(err) return res.status(400).json(err);
            }
        );

    }catch(err){
        return res.status(500).json({message : err});
    }
}
module.exports.unfollow = async (req,res) => {
    if(!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnfollow))
    return res.status(400).send('ID unknown : ' + req.params.id)

    try{
        // add to follower list
        await UserModel.findByIdAndUpdate(
            req.params.id,
            { $pull : { following : req.body.idToUnfollow}},
            { new: true, upsert: true},
            (err, docs) =>{
                if(!err) res.status(201).json(docs);
                else return res.status(400).json(err);
            }
        );
        // add to following list
        await UserModel.findByIdAndUpdate(
            req.body.idToUnfollow,
            { $pull: { followers : req.params.id}},
            { new: true , upsert: true},
            (err, docs)=> {
                if(err) return res.status(400).json(err);
            }
        );

    }catch(err){
        return res.status(500).json({message : err});
    }
}