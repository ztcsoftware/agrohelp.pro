const   router = require('express').Router();

//models
let Fertbyagronomist    = require('../models/fertbyagronomist');
let Cropname            = require('../models/cropname');
let Suggestbyagronomist = require('../models/suggestbyagronomist');
let User                = require('../models/user');

router.post('/search/myproduct',(req,res)=>{


  if( req.body.name.length>0 && req.body.cropName!=undefined){ //when user enter product name AND cropName
         console.log('proion kai crop');
          if (typeof(req.body.cropName) == 'object'){
                var finalString='';
                req.body.cropName.forEach(element => {
                      finalString = finalString + element+' ';
                });
                Fertbyagronomist.find({ $and:[{"name":{"$regex":".*"+req.body.name+"*."}},{ $text:{$search: finalString.trim()}  } ]    }, (err,myproducts)=>{
                  if(err) throw err;
                    else{
                      Cropname.find({},function(err,crops){
                          //console.log(myproducts);
                          res.render('listmyproducts',{myproducts : myproducts,
                                                        crops:crops });
                        });
                    }

                });
          }else{
            Fertbyagronomist.find({ $and:[{"name":{"$regex":".*"+req.body.name+"*."}},{ "cropName":{"$regex":".*"+req.body.cropName+"*."}  } ]    }, (err,myproducts)=>{
              if(err) throw err;
                else {
                  Cropname.find({},function(err,crops){
                      ///console.log(myproducts);
                      res.render('listmyproducts',{myproducts : myproducts,
                                                    crops:crops });
                    });
                }

            });
          }


  }else
    if (req.body.name.length>0 && req.body.month!=null){ //when user enter product name AND month apply
            console.log('proion kai mhnas');
            if(typeof(req.body.month)=='object'){
                var finalString='';
                req.body.month.forEach(element => {
                      finalString = finalString + element+' ';
                });

                Fertbyagronomist.find( { $and:[{"name":{"$regex":".*"+req.body.name+"*."}},{ $text :{$search: finalString.trim()}   } ]    }   , (err,myproducts)=>{
                  if(err) throw err;
                    else{
                      Cropname.find({},function(err,crops){
                        //  console.log(myproducts);
                          res.render('listmyproducts',{myproducts : myproducts,
                                                        crops:crops });
                        });
                    }

                });

            }else {
              Fertbyagronomist.find({ $and:[{"name":{"$regex":".*"+req.body.name+"*."}},{ "monthApply" :{"$regex":".*"+ req.body.month+"*." }   } ]    }, (err,myproducts)=>{
                if(err) throw err;
                  else{
                    Cropname.find({},function(err,crops){
                        //console.log(myproducts);
                        res.render('listmyproducts',{myproducts : myproducts,
                                                      crops:crops });
                      });
                  }

              });
            }

  }else
    if (req.body.cropName!=undefined && req.body.month!=null){ //when user enter crop name name AND month apply
            console.log('crop kai mhnas');

            // 1st option : user selected two crops and at least 2 months
            if ( typeof(req.body.cropName)=='object' && typeof(req.body.month)=='object'){

                  var finalStringCropName='';
                  var crops=[];
                  req.body.cropName.forEach(element => {
                        finalStringCropName = finalStringCropName + element+' ';
                        crops.push(element);
                      });

                  var finalStringMonth='';
                  var months=[];
                  req.body.month.forEach(element => {
                        finalStringMonth = finalStringMonth + element+' ';
                        months.push(element);
                      });
                      console.log('1st option'+ months);
                      console.log(months);                                                                      /* $text:{ $search : finalStringMonth+finalStringCropName.trim() } */
                  Fertbyagronomist.find({  $and:[ {cropName:{$in:crops}},  { monthApply:{$in: months}}  ]   }, (err,myproducts)=>{
                    if(err) throw err;
                      else{
                        Cropname.find({},function(err,crops){
                          //  console.log(myproducts);
                            res.render('listmyproducts',{myproducts : myproducts,
                                                          crops:crops });
                          });
                      }

                  });
            } else
                //2nd option : user selected two crops and 1 month
                if (typeof(req.body.cropName)=='object' && typeof(req.body.month)=='string'){
                      //when cropName is an object return an array for exmpl. ['Olive','Kiwi']
                        var finalStringCropName='';
                        req.body.cropName.forEach(element => {
                              finalStringCropName = finalStringCropName + element+' ';
                        });
                        console.log('2nd option');
                        console.log(req.body.cropName);

                        Fertbyagronomist.find({ $and:[ {cropName:{$in:req.body.cropName}} ,{monthApply:req.body.month}]   }, (err,myproducts)=>{
                          if(err) throw err;
                            else{
                              Cropname.find({},function(err,crops){
                              //    console.log(myproducts);
                                  res.render('listmyproducts',{myproducts : myproducts,
                                                                crops:crops });
                                });
                            }

                        });

            } else
                //3rd option : user select one (1) cropname and at least 2 months
                if (typeof(req.body.cropName)=='string' && typeof(req.body.month)=='object'){
                  var finalString='';
                  req.body.month.forEach(element => {
                        finalString = finalString + element+' ';
                  });
                  console.log('3rd option');
                  Fertbyagronomist.find({  $and:[ {monthApply:{$in:req.body.month}} ,{cropName:req.body.cropName}]    }, (err,myproducts)=>{
                    if(err) throw err;
                      else{
                        Cropname.find({},function(err,crops){
                          //  console.log(myproducts);
                            res.render('listmyproducts',{myproducts : myproducts,
                                                          crops:crops });
                          });
                      }

                  });


            } else
                //4th option : user select one (1) cropname and at 1 month
                if (typeof(req.body.cropName)=='string' && typeof(req.body.month)=='string' ){

                      Fertbyagronomist.find({ $and:[{"cropName":req.body.cropName},{"monthApply":req.body.month}]  }, (err,myproducts)=>{
                        if(err) throw err;
                          else{
                            Cropname.find({},function(err,crops){
                              //  console.log(myproducts);
                                res.render('listmyproducts',{myproducts : myproducts,
                                                              crops:crops });
                              });
                          }

                      });
            }

  }else

    if (req.body.name.length>0 ){  // when user input ONLY the name of product
            Fertbyagronomist.find({ "name":{"$regex":".*"+req.body.name+"*."}  }, (err,myproducts)=>{
              if(err) throw err;
                else{
                  Cropname.find({},function(err,crops){
                    //  console.log(myproducts);
                      res.render('listmyproducts',{myproducts : myproducts,
                                                    crops:crops });
                    });
                }

            });
    }else   if (req.body.cropName!=undefined  ){  // when user input ONLY one or two crop name ex. Kiwi or Olive

                  if (typeof(req.body.cropName)=='object'){
                          var finalString='';
                          req.body.cropName.forEach(element => {
                                finalString = finalString + element+' ';
                          });

                          Fertbyagronomist.find({  $text:{$search: finalString.trim()}     }, (err,myproducts)=>{
                            if(err) throw err;
                              else{
                                Cropname.find({},function(err,crops){
                                  //  console.log(myproducts);
                                    res.render('listmyproducts',{myproducts : myproducts,
                                                                  crops:crops });
                                  });
                              }

                          });
                  }else {
                        Fertbyagronomist.find({  $text:{$search: req.body.cropName}     }, (err,myproducts)=>{
                          if(err) throw err;
                            else
                              {
                                Cropname.find({},function(err,crops){
                                    //console.log(myproducts);
                                    res.render('listmyproducts',{myproducts : myproducts,
                                                                  crops:crops });
                                  });
                              }
                        });
                  }
      }else { // when user input  ONLY months
            if(req.body.month==undefined){
                  console.log('Den exeis epileksei kanena krithrio !!!');
            }else if( typeof(req.body.month)=='object'){
                  var finalString='';
                  req.body.month.forEach(element => {
                        finalString = finalString + element+' ';
                  });

                  Fertbyagronomist.find({  $text:{$search: finalString.trim()}     }, (err,myproducts)=>{
                    if(err) throw err;
                      else{
                        Cropname.find({},function(err,crops){
                            console.log(myproducts);
                            res.render('listmyproducts',{myproducts : myproducts,
                                                          crops:crops });
                          });
                      }

                  });
            }else {
                  Fertbyagronomist.find({  $text:{$search: req.body.month}     }, (err,myproducts)=>{
                    if(err) throw err;
                      else{
                          Cropname.find({},function(err,crops){
                              console.log(myproducts);
                              res.render('listmyproducts',{myproducts : myproducts,
                                                            crops:crops });
                            });
                      }

                  });
            }

      }
      // Fertbyagronomist.find({ $or:[{"name":{"$regex":".*"+req.body.name+"*."}},{cropName:req.body.cropName} ]    }, (err,result)=>{
      //   if(err) throw err;
      //     else
      //       console.log(result);
      // });
});

router.post('/search/listmytreatments',(req,res)=>{

  var dates=[];
  var users=[];
  var crops=[];

if ( req.body.farmerName.length>0 && req.body.startDate.length>0 && req.body.endDate.length>0) { // when user enter farmerName AND dates

  const startDate = new Date(req.body.startDate+' UTC');
  const   endDate = new Date(req.body.endDate+' UTC');


    Suggestbyagronomist.aggregate([
        {
          $match: {
                    $and:[ {  created_date:  { $gte: new Date( startDate.toISOString()) , $lte: new Date( endDate.toISOString())  } } ,{$text:{$search: req.body.farmerName }} ]

                  }
         },
        {
          $addFields :{
                        "userNew" :{ "$toObjectId":"$userId"  } //convert userId string to object from Suggestbyagronomists $and
                                                                // use an alias
                      }
        },
        {
          $lookup :{
                from : "users",
                localField : "userNew",
                foreignField : "_id",
                as : "userData"

                }
        },
        {
          $project : {
                       "userData._id":0,
                "userData.isVerified":0,
              "userData.totalNumCrop":0,
                     "userData.email":0,
                   "userData.api_key":0,
              "userData.created_date":0,
               "userData.accountType":0
          }
        }

    ]).exec((err,myproducts)=>{

      if (err) throw err;
      else {
        myproducts.forEach(function(item){
               var crdate = new Date(item.created_date);
               dates.push(propareDate(crdate.getDay(),crdate.getDate(),crdate.getMonth(),crdate.getFullYear()));

                 item.userData.forEach((element) => {
                   users.push(element.last_name+' '+ element.first_name);
                 });

           });
            Cropname.find({},function(err,crops){
                 res.render('listmytreatments',{
                                               myproducts:myproducts,
                                               dates :dates,
                                               users :users,
                                               crops :crops
                                             });
                  });
      }

    });

}else

  if( req.body.cropName != undefined && req.body.startDate.length>0 && req.body.endDate.length>0){ //when user enter cropName AND dates
          const startDate = new Date(req.body.startDate+' UTC');
          const   endDate = new Date(req.body.endDate+' UTC');

          if (typeof(req.body.cropName)=='object'){
                  var finalString='';
                  req.body.cropName.forEach(element => {
                        finalString = finalString + element+' ';
                  });


                  Suggestbyagronomist.aggregate([
                      {
                        $match: {
                                  $and:[ {  created_date:  { $gte: new Date( startDate.toISOString()) , $lte: new Date( endDate.toISOString())  } } ,{$text:{$search:finalString.trim() }} ]
                                    //$text: { $search: finalString + req.body.farmerName  }
                                }
                       },
                      {
                        $addFields :{
                                      "userNew" :{ "$toObjectId":"$userId"  } //convert userId string to object from Suggestbyagronomists $and
                                                                              // use an alias
                                    }
                      },
                      {
                        $lookup :{
                              from : "users",
                              localField : "userNew",
                              foreignField : "_id",
                              as : "userData"

                              }
                      },
                      {
                        $project : {
                                     "userData._id":0,
                              "userData.isVerified":0,
                            "userData.totalNumCrop":0,
                                   "userData.email":0,
                                 "userData.api_key":0,
                            "userData.created_date":0,
                             "userData.accountType":0
                        }
                      }

                  ]).exec((err,myproducts)=>{

                    if (err) throw err;
                    else {
                      myproducts.forEach(function(item){
                             var crdate = new Date(item.created_date);
                             dates.push(propareDate(crdate.getDay(),crdate.getDate(),crdate.getMonth(),crdate.getFullYear()));

                               item.userData.forEach((element) => {
                                 users.push(element.last_name+' '+ element.first_name);
                               });

                         });
                          Cropname.find({},function(err,crops){
                               res.render('listmytreatments',{
                                                             myproducts:myproducts,
                                                             dates :dates,
                                                             users :users,
                                                             crops :crops
                                                           });
                                });
                    }

                  });

          }else {

                Suggestbyagronomist.aggregate([
                    {
                      $match: {
                                $and:[ {  created_date:  { $gte: new Date( startDate.toISOString()) , $lte: new Date( endDate.toISOString())  } } ,{$text:{$search:req.body.cropName }} ]
                                //  $text: { $search: req.body.cropName +' '+ req.body.farmerName }
                              }
                     },
                    {
                      $addFields :{
                                    "userNew" :{ "$toObjectId":"$userId"  } //convert userId string to object from Suggestbyagronomists $and
                                                                            // use an alias
                                  }
                    },
                    {
                      $lookup :{
                            from : "users",
                            localField : "userNew",
                            foreignField : "_id",
                            as : "userData"

                            }
                    },
                    {
                      $project : {
                                   "userData._id":0,
                            "userData.isVerified":0,
                          "userData.totalNumCrop":0,
                                 "userData.email":0,
                               "userData.api_key":0,
                          "userData.created_date":0,
                           "userData.accountType":0
                      }
                    }

                ]).exec((err,myproducts)=>{
                      if (err) throw err;
                      else {
                            myproducts.forEach(function(item){
                                   var crdate = new Date(item.created_date);
                                   dates.push(propareDate(crdate.getDay(),crdate.getDate(),crdate.getMonth(),crdate.getFullYear()));

                                     item.userData.forEach((element) => {
                                       users.push(element.last_name+' '+ element.first_name);
                                     });

                               });
                                Cropname.find({},function(err,crops){
                                  //  console.log(crops);
                                     res.render('listmytreatments',{
                                                                   myproducts:myproducts,
                                                                   dates :dates,
                                                                   users :users,
                                                                   crops :crops
                                                                 });
                                      });
                      }

                });
  }

}else

  if (req.body.cropName!=undefined  && req.body.farmerName.length>0){ //when user enter cropName AND farmerName


      if (typeof(req.body.cropName)=='object'){
              var finalString='';
              req.body.cropName.forEach(element => {
                    finalString = finalString + element+' ';
              });


              Suggestbyagronomist.aggregate([
                  {
                    $match: {
                              $and:[ { $or:[{"first_name":{"$regex":".*"+req.body.farmerName+"*."}},{"last_name":{"$regex":".*"+req.body.farmerName+"*."}}]} ,{$text:{$search:finalString.trim() }} ]
                                //$text: { $search: finalString + req.body.farmerName  }
                            }
                   },
                  {
                    $addFields :{
                                  "userNew" :{ "$toObjectId":"$userId"  } //convert userId string to object from Suggestbyagronomists $and
                                                                          // use an alias
                                }
                  },
                  {
                    $lookup :{
                          from : "users",
                          localField : "userNew",
                          foreignField : "_id",
                          as : "userData"

                          }
                  },
                  {
                    $project : {
                                 "userData._id":0,
                          "userData.isVerified":0,
                        "userData.totalNumCrop":0,
                               "userData.email":0,
                             "userData.api_key":0,
                        "userData.created_date":0,
                         "userData.accountType":0
                    }
                  }

              ]).exec((err,myproducts)=>{

                if (err) throw err;
                else {
                  myproducts.forEach(function(item){
                         var crdate = new Date(item.created_date);
                         dates.push(propareDate(crdate.getDay(),crdate.getDate(),crdate.getMonth(),crdate.getFullYear()));

                           item.userData.forEach((element) => {
                             users.push(element.last_name+' '+ element.first_name);
                           });

                     });
                      Cropname.find({},function(err,crops){
                           res.render('listmytreatments',{
                                                         myproducts:myproducts,
                                                         dates :dates,
                                                         users :users,
                                                         crops :crops
                                                       });
                            });
                }

              });

      }else {

            Suggestbyagronomist.aggregate([
                {
                  $match: {
                              $and:[ {$or:[ {"first_name":{"$regex":".*"+req.body.farmerName+"*."}},{"last_name":{"$regex":".*"+req.body.farmerName+"*."}}] } ,{cropName:req.body.cropName} ]
                            //  $text: { $search: req.body.cropName +' '+ req.body.farmerName }
                          }
                 },
                {
                  $addFields :{
                                "userNew" :{ "$toObjectId":"$userId"  } //convert userId string to object from Suggestbyagronomists $and
                                                                        // use an alias
                              }
                },
                {
                  $lookup :{
                        from : "users",
                        localField : "userNew",
                        foreignField : "_id",
                        as : "userData"

                        }
                },
                {
                  $project : {
                               "userData._id":0,
                        "userData.isVerified":0,
                      "userData.totalNumCrop":0,
                             "userData.email":0,
                           "userData.api_key":0,
                      "userData.created_date":0,
                       "userData.accountType":0
                  }
                }

            ]).exec((err,myproducts)=>{
                  if (err) throw err;
                  else {
                        myproducts.forEach(function(item){
                               var crdate = new Date(item.created_date);
                               dates.push(propareDate(crdate.getDay(),crdate.getDate(),crdate.getMonth(),crdate.getFullYear()));

                                 item.userData.forEach((element) => {
                                   users.push(element.last_name+' '+ element.first_name);
                                 });

                           });
                            Cropname.find({},function(err,crops){
                                console.log(crops);
                                 res.render('listmytreatments',{
                                                               myproducts:myproducts,
                                                               dates :dates,
                                                               users :users,
                                                               crops :crops
                                                             });
                                  });
                  }

            });

      }
    } else

    if (req.body.cropName!=undefined  ){  // When user enter only crop name
      console.log('When user enter only crop name');
          if (typeof(req.body.cropName)=='object'){
                  var finalString='';
                  req.body.cropName.forEach(element => {
                        finalString = finalString + element+' ';
                  });


                  Suggestbyagronomist.aggregate([
                      {
                        $match: {
                                    $text: { $search: finalString.trim() }
                                }
                       },
                      {
                        $addFields :{
                                      "userNew" :{ "$toObjectId":"$userId"  } //convert userId string to object from Suggestbyagronomists $and
                                                                              // use an alias
                                    }
                      },
                      {
                        $lookup :{
                              from : "users",
                              localField : "userNew",
                              foreignField : "_id",
                              as : "userData"

                              }
                      },
                      {
                        $project : {
                                     "userData._id":0,
                              "userData.isVerified":0,
                            "userData.totalNumCrop":0,
                                   "userData.email":0,
                                 "userData.api_key":0,
                            "userData.created_date":0,
                             "userData.accountType":0
                        }
                      }

                  ]).exec((err,myproducts)=>{

                    if (err) throw err;
                    else {
                      myproducts.forEach(function(item){
                             var crdate = new Date(item.created_date);
                             dates.push(propareDate(crdate.getDay(),crdate.getDate(),crdate.getMonth(),crdate.getFullYear()));

                               item.userData.forEach((element) => {
                                 users.push(element.last_name+' '+ element.first_name);
                               });

                         });
                          Cropname.find({},function(err,crops){
                               res.render('listmytreatments',{
                                                             myproducts:myproducts,
                                                             dates :dates,
                                                             users :users,
                                                             crops :crops
                                                           });
                                });
                    }

                  });

          }else {

                Suggestbyagronomist.aggregate([
                    {
                      $match: {
                                  $text: { $search: req.body.cropName }
                              }
                     },
                    {
                      $addFields :{
                                    "userNew" :{ "$toObjectId":"$userId"  } //convert userId string to object from Suggestbyagronomists $and
                                                                            // use an alias
                                  }
                    },
                    {
                      $lookup :{
                            from : "users",
                            localField : "userNew",
                            foreignField : "_id",
                            as : "userData"

                            }
                    },
                    {
                      $project : {
                                   "userData._id":0,
                            "userData.isVerified":0,
                          "userData.totalNumCrop":0,
                                 "userData.email":0,
                               "userData.api_key":0,
                          "userData.created_date":0,
                           "userData.accountType":0
                      }
                    }

                ]).exec((err,myproducts)=>{
                      if (err) throw err;
                      else {
                            myproducts.forEach(function(item){
                                   var crdate = new Date(item.created_date);
                                   dates.push(propareDate(crdate.getDay(),crdate.getDate(),crdate.getMonth(),crdate.getFullYear()));

                                     item.userData.forEach((element) => {
                                       users.push(element.last_name+' '+ element.first_name);
                                     });

                               });
                                Cropname.find({},function(err,crops){
                                    console.log(crops);
                                     res.render('listmytreatments',{
                                                                   myproducts:myproducts,
                                                                   dates :dates,
                                                                   users :users,
                                                                   crops :crops
                                                                 });
                                      });
                      }

                });

          }

    }else if(req.body.farmerName.length>0) {  // if user enter ONLY farmerName

      Suggestbyagronomist.aggregate([
        {
          $match: {
                    $text:{$search:req.body.farmerName}
                  }
         },
          {
            $addFields :{
                          "userNew" :{ "$toObjectId":"$userId"  } //convert userId string to object from Suggestbyagronomists $and
                                                                  // use an alias
                        }
          },
          {
            $lookup :{
                  from : "users",
                  localField : "userNew",
                  foreignField : "_id",
                  as : "userData"

                  }
          },
          {
            $project : {

              "isVerified" :0,
              "totalNumCrop":0,
              "email":0,
              "api_key":0,
              "accountType":0,
              "userNew":0,
              "userData._id":0

          }
        }
      ]).exec((err,myproducts)=>{
            if (err) throw err;
            else {
                  console.log(myproducts);
                  //res.json(myproducts);
                  myproducts.forEach(function(item){
                         var crdate = new Date(item.created_date);
                         dates.push(propareDate(crdate.getDay(),crdate.getDate(),crdate.getMonth(),crdate.getFullYear()));

                           item.userData.forEach((element) => {
                             users.push(element.last_name+' '+ element.first_name);
                           });

                     });
                      Cropname.find({},function(err,crops){
                          console.log(crops);
                           res.render('listmytreatments',{
                                                         myproducts:myproducts,
                                                         dates :dates,
                                                         users :users,
                                                         crops :crops
                                                       });
                            });

            }

      });
    } else if (req.body.startDate.length>0 && req.body.endDate.length>0 ){  // if user enter ONLY dates

                const startDate = new Date(req.body.startDate+' UTC');
                const   endDate = new Date(req.body.endDate+' UTC');

                Suggestbyagronomist.aggregate([
                  {
                    $match: {
                             created_date:  { $gte: new Date( startDate.toISOString()) , $lte: new Date( endDate.toISOString())  }
                            }
                   },
                    {
                      $addFields :{
                                    "userNew" :{ "$toObjectId":"$userId"  } //convert userId string to object from Suggestbyagronomists $and
                                                                            // use an alias
                                  }
                    },
                    {
                      $lookup :{
                            from : "users",
                            localField : "userNew",
                            foreignField : "_id",
                            as : "userData"

                            }
                    },
                    {
                      $project : {

                        "isVerified" :0,
                        "totalNumCrop":0,
                        "email":0,
                        "api_key":0,
                        "accountType":0,
                        "userNew":0,
                        "userData._id":0

                    }
                  }
                ]).exec((err,myproducts)=>{
                      if (err) throw err;
                      else {
                            console.log(myproducts);
                            //res.json(myproducts);
                            myproducts.forEach(function(item){
                                   var crdate = new Date(item.created_date);
                                   dates.push(propareDate(crdate.getDay(),crdate.getDate(),crdate.getMonth(),crdate.getFullYear()));

                                     item.userData.forEach((element) => {
                                       users.push(element.last_name+' '+ element.first_name);
                                     });

                               });
                                Cropname.find({},function(err,crops){
                                  //  console.log(crops);
                                     res.render('listmytreatments',{
                                                                   myproducts:myproducts,
                                                                   dates :dates,
                                                                   users :users,
                                                                   crops :crops
                                                                 });
                                      });

                      }

                });


    }else



   { //when one of two date fields are empty
      Suggestbyagronomist.aggregate([

          {
            $addFields :{
                          "userNew" :{ "$toObjectId":"$userId"  } //convert userId string to object from Suggestbyagronomists $and
                                                                  // use an alias
                        }
          },
          {
            $lookup :{
                  from : "users",
                  localField : "userNew",
                  foreignField : "_id",
                  as : "userData"

                  }
          },
          {
            $project : {

              "isVerified" :0,
              "totalNumCrop":0,
              "email":0,
              "api_key":0,
              "accountType":0,
              "userNew":0,
              "userData._id":0

          }
        }
      ]).exec((err,myproducts)=>{
            if (err) throw err;
            else {
                  console.log(myproducts);
                  //res.json(myproducts);
                  myproducts.forEach(function(item){
                         var crdate = new Date(item.created_date);
                         dates.push(propareDate(crdate.getDay(),crdate.getDate(),crdate.getMonth(),crdate.getFullYear()));

                           item.userData.forEach((element) => {
                             users.push(element.last_name+' '+ element.first_name);
                           });

                     });
                      Cropname.find({},function(err,crops){
                        //  console.log(crops);
                        req.flash('info','Πρέπει και τα δύο πεδία ημερομηνιών να είναι συμπληρωμένα');
                        res.render('listmytreatments',{
                                                      myproducts:myproducts,
                                                      dates :dates,
                                                      users :users,
                                                      crops :crops
                                                    });
                            });

            }

      });


    }


});


function propareDate(day,date,month,year){

    switch (day) {
            case 0:
                day='Κυρ';
              break;
            case 1:
                day='Δευ';
              break;
            case 2:
                day='Τρι';
              break;
              case 3:
                  day='Τετ';
                break;
              case 4:
                  day='Πεμ';
                break;
              case 5:
                  day='Παρ';
                break;
                case 6:
                    day='Σαβ';
                  break;
            default: day='n/a';
        }

    switch (month) {
      case 0 : month='Ιαν'; break;
      case 1 : month='Φεβ'; break;
      case 2 : month='Μαρ'; break;
      case 3 : month='Απρ'; break;
      case 4 : month='Μαι'; break;
      case 5 : month='Ιου'; break;
      case 6 : month='Ιουλ'; break;
      case 7 : month='Αυγ'; break;
      case 8 : month='Σεπ'; break;
      case 9 : month='Οκτ'; break;
      case 10 : month='Νοε'; break;
      case 11 : month='Δεκ'; break;
      default : month='n/a';
    }

    finalDate = day+' '+date+' '+month+' '+year;

  return finalDate;
}
module.exports = router;
