var express = require('express');
var router = express.Router();
let crypto = require('crypto');

let UserModel = require('./../models/users');
let WaitingListModel = require('./../models/waitingList');
let emailHelper = require('./../helpers/email');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', async (req, res, next) => {
  let email = req.body.email;
  let uniqueId = crypto.randomBytes(20).toString('hex');

  let newUser = new UserModel({
    email : email,
    uniqueId: uniqueId
  })

  try{
    let savedUser = await newUser.save();

  let newWaitingList = new WaitingListModel({
    user: savedUser._id
  });

  let savedWaitingList = await newWaitingList.save();

  savedUser.waitingListId = savedWaitingList._id;

  let updatedUser = await savedUser.save();

  let mailOptions = {
    from: 'akashnodemail@gmail.com',
    to: updatedUser.email,
    subject: "Get your referral link to share to your friends",
    text: `Hi ${updatedUser.email},\n
            This is the referral link http://localhost:4200/signup/${updatedUser.uniqueId}. Please share it to your friends to get your position moved up\n \n
            Thanks,\n
            Referral company`
  }
  console.log(mailOptions);
  await emailHelper.sendEmail(mailOptions);

  let populatedUser = await UserModel.findById(updatedUser._id).populate('waitingListId');
  
  res.status(200).json({
    info: 'successfully added',
    user: populatedUser
  })
  } catch(e){
    res.status(401).send(e.message);
  }
});

router.post('/share/:referralId', async (req, res )=>{
  let referralId = req.params.referralId;
  let email = req.body.email;
  let uniqueIdForUser = crypto.randomBytes(20).toString('hex');

  let newUser = new UserModel({
    email : email,
    uniqueId: uniqueIdForUser
  })

  let savedUser = await newUser.save();

  let newWaitingList = new WaitingListModel({
    user: savedUser._id
  });

  let savedWaitingList = await newWaitingList.save();

  savedUser.waitingListId = savedWaitingList._id;

  let updatedUser = await savedUser.save();

  let mailOptions = {
    from: 'akashnodemail@gmail.com',
    to: updatedUser.email,
    subject: "Get your referral link to share to your friends",
    text: `Hi ${updatedUser.email},\n
            This is the referral link http://localhost:4200/signup/${updatedUser.uniqueId}. Please share it to your friends to get your position moved up\n \n
            Thanks,\n
            Referral company`
  }
  console.log(mailOptions);
  await emailHelper.sendEmail(mailOptions);

  let referralUser = await UserModel.findOne({uniqueId: referralId});
  referralUser.referredUsers.push(updatedUser.email);
  referralUser = await referralUser.save();
  let referralUserWaitingList = await WaitingListModel.findOne({user: referralUser._id});
  referralUserWaitingList.position--;

  await referralUserWaitingList.save();

  res.status(200).json({
    info: 'successfully added with the referer',
    user: updatedUser
  });
});

router.get('/details', async (req, res)=>{
  let email = req.query.email;

  let userDetails = await UserModel.findOne({email}).populate('waitingListId');

  res.status(200).json({
    user: userDetails
  })
})

module.exports = router;
