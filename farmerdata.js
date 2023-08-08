const      router = require('express').Router();


//Model
let User        = require('../models/user');
let Crop        = require('../models/crop');
let Irrigation  = require('../models/irrigation_data');
let Treatment   = require('../models/treatment');

//Model
let Agronomist     = require('../models/agronomist');

const authCheck = (req,res,next) => {
  if(!req.user){
    //if user is not logged in
    res.redirect('/auth/login');
  }else {
    //if logged in
    Agronomist.findById(req.user._id, function(err,agronomist){
            var user = {
              firstname: req.user.firstname,
              lastname : req.user.lastname,
              thumbnail: req.user.thumbnail,
              googleId : req.user.googleId,
                    id : req.user._id
            };
            if(agronomist.bill.payed){
                  next();
            }else {
                  res.render('price_table',user);
            }

    });

  }
};


router.get('/:userId/:cropId/:lat/:lng',authCheck,function(req,res){
  // console.log('time : '+convertEpochToSpecificTimezone(3,1594887355706),'userId = '+req.params.userId + ' cropId = '+req.params.cropId+' lat = '+req.params.lat+' lng ='+req.params.lng);
var element={};
var item={};
var hours=[];  //irrigationYearTotalPerMonth
var ferts=[];

//initialize var
let totalHoursApril = 0;
let totalHoursMay = 0;
let totalHoursJune = 0;
let totalHoursJuly = 0;
let totalHoursAugust = 0;
let totalHoursSeptember = 0;
let totalHoursOctober = 0;

//initialize var
let totalNitrogenJan=0,    totalNitrogenFeb=0,  totalNitrogenMar=0,  totalNitrogenApr=0,   totalNitrogenMay=0,   totalNitrogenJun=0,   totalNitrogenJul=0,  totalNitrogenAug=0,   totalNitrogenSep=0,  totalNitrogenOct=0,  totalNitrogenNov=0,  totalNitrogenDec=0;
let totalPhosphorusJan=0,totalPhosphorusFeb=0,totalPhosphorusMar=0,totalPhosphorusApr=0, totalPhosphorusMay=0, totalPhosphorusJun=0, totalPhosphorusJul=0,totalPhosphorusAug=0, totalPhosphorusSep=0,totalPhosphorusOct=0,totalPhosphorusNov=0,totalPhosphorusDec=0;
let  totalPotassiumJan=0, totalPotassiumFeb=0, totalPotassiumMar=0, totalPotassiumApr=0,  totalPotassiumMay=0,  totalPotassiumJun=0,  totalPotassiumJul=0, totalPotassiumAug=0,  totalPotassiumSep=0, totalPotassiumOct=0, totalPotassiumNov=0, totalPotassiumDec=0;


Crop.aggregate([
  {
    $addFields: {
                    "_id": { "$toString": "$_id" },// convert _id object to string
                  "userNew":{ "$toObjectId": "$user" } // convert a field to objectId and i use alias because
                                                        // user field is used  to another joins
                }
  },

  {
    $match:{ $and:[{user:req.params.userId},{_id:req.params.cropId}] }
  },

  {
    $lookup:{
            from: "users",
            localField: "userNew",   // name of users table field
            foreignField: "_id", // name of userinfo table field
            as: "users"         // alias for userinfo table
        }
   }

    ,
    //  {$unwind:"$users"},
  {
    $lookup:{
            from: "treatments",       // other table name
            localField: "_id",   // name of users table field
            foreignField: "cropName", // name of userinfo table field
            as: "treats"         // alias for userinfo table
        }
  },
//    {$unwind:"$treats"},
{
  $lookup:{
          from: "irrigation_datas",       // other table name
          localField: "_id",   // name of users table field
          foreignField: "cropName", // name of userinfo table field
          as: "irris"         // alias for userinfo table
      }

},

   {$project : {_id:0,creationDate:0,userNew:0,
     "users._id":0,"users.isVerified":0,"users.totalNumCrop":0,"users.email":0,
     "users.api_key":0,"users.created_date":0,"users.accountType":0,
     "treats._id":0,"treats.user":0,"treats.email":0,
     "treats.cropName":0,
     "irris._id":0,"irris.irrigationCost":0,"irris.user":0,"irris.email":0,
     "irris.cropName":0,
     treatmentName:0,"datas":0}}

]).exec((err,results)=>{
  //  console.log(results);
  //    res.json(results)
    var location,loc,wat;
    var dates=[];
    var datesT=[];
    var types=[];
    var date;
    var dateT;
    var data=[]; //here i will store the irrigation values per month for chart
    var treatmentNameInGreek=[];

      results.forEach(function(result){
        //console.log(decode_utf8(result.fullCropName));
        location = decode_utf8(result.topothesia.name);
          //show irrigation history
          result.irris.forEach(function(irrigation){
                dates.push(convertEpochToSpecificTimezone(3,irrigation.dateApply));
          });

          //show treatment history
          result.treats.forEach(function(treatment){
              datesT.push(convertEpochToSpecificTimezone(3,treatment.dateApply));
              types.push(decode_utf8(treatment.type));
              loc = decode_utf8(treatment.fullCropName);
              treatmentNameInGreek.push(decode_utf8(treatment.treatmentName));
              console.log(decode_utf8(treatment.treatmentName));
          });

            //new Date().getFullYear()

            for(year=2020;year<=2021;year++){
                  //show irrigation chart
                  result.irris.forEach(function(irrigation){
                      if(irrigation.dateApplyYear== year){
                            switch (irrigation.dateApplyMonth) {
                                  case 'April':
                                      totalHoursApril = totalHoursApril + irrigation.irrigationHours;
                                    break;
                                  case 'May':
                                      totalHoursMay = totalHoursMay + irrigation.irrigationHours;
                                    break;
                                  case 'June':
                                      totalHoursJune = totalHoursJune + irrigation.irrigationHours;
                                    break;
                                  case 'July':
                                      totalHoursJuly = totalHoursJuly + irrigation.irrigationHours;
                                    break;
                                  case 'August':
                                      totalHoursAugust = totalHoursAugust + irrigation.irrigationHours;
                                    break;
                                  case 'September':
                                      totalHoursSeptember = totalHoursSeptember + irrigation.irrigationHours;
                                    break;
                                  case 'October':
                                      totalHoursOctober = totalHoursOctober + irrigation.irrigationHours;
                                    break;
                                  default:
                                    console.log('Nothing found');
                            }
                      }
                  });
                  var element = {
                                  name: year,
                                  data :[
                                  totalHoursApril,
                                   totalHoursMay,
                                  totalHoursJune,
                                  totalHoursJuly,
                                  totalHoursAugust,
                                  totalHoursSeptember,
                                  totalHoursOctober]
                  };
                hours.push(element);
                //******
                totalHoursApril = 0;
                totalHoursMay = 0;
                totalHoursJune = 0;
                totalHoursJuly = 0;
                totalHoursAugust = 0;
                totalHoursSeptember = 0;
                totalHoursOctober = 0;
                //*****
                //show fert(N-P-K) chart
                result.treats.forEach(function(treatment){
                    if (treatment.dateApplyYear == year && treatment.stats=='Yes'){
                      switch (treatment.dateApplyMonth) {
                        case 'January':
                              totalNitrogenJan   = totalNitrogenJan   + treatment.nitrogenAmount;
                              totalPhosphorusJan = totalPhosphorusJan + treatment.phosphorusAmount;
                              totalPotassiumJan  = totalPotassiumJan  + treatment.potassiumAmount;
                          break;
                        case 'February':
                              totalNitrogenFeb   = totalNitrogenFeb   + treatment.nitrogenAmount;
                              totalPhosphorusFeb = totalPhosphorusFeb + treatment.phosphorusAmount;
                              totalPotassiumFeb  = totalPotassiumFeb  + treatment.potassiumAmount;
                          break;
                        case 'March':
                             totalNitrogenMar   = totalNitrogenMar   + treatment.nitrogenAmount;
                             totalPhosphorusMar = totalPhosphorusMar + treatment.phosphorusAmount;
                             totalPotassiumMar  = totalPotassiumMar  + treatment.potassiumAmount;
                          break;
                        case 'April':
                              totalNitrogenApr   = totalNitrogenApr   + treatment.nitrogenAmount;
                              totalPhosphorusApr = totalPhosphorusApr + treatment.phosphorusAmount;
                              totalPotassiumApr  = totalPotassiumApr  + treatment.potassiumAmount;
                          break;
                        case 'May':
                              totalNitrogenMay   = totalNitrogenMay   + treatment.nitrogenAmount;
                              totalPhosphorusMay = totalPhosphorusMay + treatment.phosphorusAmount;
                              totalPotassiumMay  = totalPotassiumMay  + treatment.potassiumAmount;
                          break;
                        case 'June':
                              totalNitrogenJun   = totalNitrogenJun  + treatment.nitrogenAmount;
                              totalPhosphorusJun = totalPhosphorusJun+ treatment.phosphorusAmount;
                              totalPotassiumJun  = totalPotassiumJun + treatment.potassiumAmount;
                          break;
                        case 'July':
                              totalNitrogenJul  = totalNitrogenJul   + treatment.nitrogenAmount;
                              totalPhosphorusJul= totalPhosphorusJul + treatment.phosphorusAmount;
                              totalPotassiumJul = totalPotassiumJul  + treatment.potassiumAmount;
                          break;
                        case 'August':
                              totalNitrogenAug   = totalNitrogenAug   + treatment.nitrogenAmount;
                              totalPhosphorusAug = totalPhosphorusAug + treatment.phosphorusAmount;
                              totalPotassiumAug  = totalPotassiumAug  + treatment.potassiumAmount;
                          break;
                        case 'September':
                              totalNitrogenSep   = totalNitrogenSep   + treatment.nitrogenAmount;
                              totalPhosphorusSep = totalPhosphorusSep + treatment.phosphorusAmount;
                              totalPotassiumSep  = totalPotassiumSep  + treatment.potassiumAmount;
                          break;
                        case 'October':
                              totalNitrogenOct   = totalNitrogenOct   + treatment.nitrogenAmount;
                              totalPhosphorusOct = totalPhosphorusOct + treatment.phosphorusAmount;
                              totalPotassiumOct  = totalPotassiumOct  + treatment.potassiumAmount;
                            break;
                        case 'November':
                              totalNitrogenNov   = totalNitrogenNov   + treatment.nitrogenAmount;
                              totalPhosphorusNov = totalPhosphorusNov + treatment.phosphorusAmount;
                              totalPotassiumNov  = totalPotassiumNov  + treatment.potassiumAmount;
                            break;
                        case 'December':
                              totalNitrogenDec   = totalNitrogenDec   + treatment.nitrogenAmount;
                              totalPhosphorusDec = totalPhosphorusDec + treatment.phosphorusAmount;
                              totalPotassiumDec  = totalPotassiumDec  + treatment.potassiumAmount;
                            break;

                        default:   console.log('Nothing found');

                      }
                    }
                });

                  var element = {
                      [year]: [
                                {
                                  name: 'Άζωτο',
                                  data:[ totalNitrogenJan,totalNitrogenFeb,totalNitrogenMar,totalNitrogenApr,totalNitrogenMay,totalNitrogenJun,
                                         totalNitrogenJul,totalNitrogenAug,totalNitrogenSep,totalNitrogenOct,totalNitrogenNov,totalNitrogenDec]
                                },
                                {
                                  name: 'Φώσφορος',
                                  data:[ totalPhosphorusJan,totalPhosphorusFeb,totalPhosphorusMar,totalPhosphorusApr,totalPhosphorusMay,totalPhosphorusJun,
                                         totalPhosphorusJul,totalPhosphorusAug,totalPhosphorusSep,totalPhosphorusOct,totalPhosphorusNov,totalPhosphorusDec]
                                },
                                {
                                  name: 'Κάλιο',
                                  data:[ totalPotassiumJan,totalPotassiumFeb,totalPotassiumMar,totalPotassiumApr,totalPotassiumMay,totalPotassiumJun,
                                         totalPotassiumJul,totalPotassiumAug,totalPotassiumSep,totalPotassiumOct,totalPotassiumNov,totalPotassiumDec]
                                }
                              ]

                  };


                  ferts.push(element);
                  //initialize var for next year calculations
                   totalNitrogenJan=0;    totalNitrogenFeb=0;  totalNitrogenMar=0;  totalNitrogenApr=0;   totalNitrogenMay=0;   totalNitrogenJun=0;   totalNitrogenJul=0;  totalNitrogenAug=0;   totalNitrogenSep=0;  totalNitrogenOct=0;  totalNitrogenNov=0;  totalNitrogenDec=0;
                   totalPhosphorusJan=0;totalPhosphorusFeb=0;totalPhosphorusMar=0;totalPhosphorusApr=0; totalPhosphorusMay=0; totalPhosphorusJun=0; totalPhosphorusJul=0;totalPhosphorusAug=0; totalPhosphorusSep=0;totalPhosphorusOct=0;totalPhosphorusNov=0;totalPhosphorusDec=0;
                    totalPotassiumJan=0; totalPotassiumFeb=0; totalPotassiumMar=0; totalPotassiumApr=0;  totalPotassiumMay=0;  totalPotassiumJun=0;  totalPotassiumJul=0; totalPotassiumAug=0;  totalPotassiumSep=0; totalPotassiumOct=0; totalPotassiumNov=0; totalPotassiumDec=0;

            }//end for


      });
      // with the 4 following lines convert the returned ferts array
      //to a JSON object with elements arrays, one for each year.
      var final={};
      for (let i = 0 ;i< ferts.length;i++){
            final = jsonConcat(final, ferts[i]);
            };

          // console.log(final);
          // res.json(final);
        res.render('farmerdata',{   results:results,
                                    location : location,
                                    loc:loc,
                                    types:types,
                                    dates:dates,
                                    datesT:datesT,
                                    hours:hours,
                                    final:final,
                                    lat:req.params.lat,
                                    lng:req.params.lng,
                   treatmentNameInGreek:treatmentNameInGreek});
         });
    });

function jsonConcat(o1, o2) {
     for (var key in o2) {
      o1[key] = o2[key];
     }
     return o1;
    }
function decode_utf8(s) {
  return decodeURIComponent(escape(s));
}

function encode_utf8(s) {
  return unescape(encodeURIComponent(s));
}

function convertEpochToSpecificTimezone(offset,timestamp){
    var d = new Date(timestamp);
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);  //This converts to UTC 00:00
    var nd = new Date(utc + (3600000*offset));
    return getWeekDay(nd.getDay())+' '+nd.getDate()+' '+getMonth(nd.getMonth())+' '+nd.getFullYear();
}
function getWeekDay(daycode){
  switch (daycode) {
    case 0:
      name ="Κυριακή";
      break;
    case 1:
      name ="Δευτέρα";
      break;
    case 2:
      name ="Τρίτη";
      break;
    case 3:
      name ="Τετάρτη";
      break;
      case 4:
        name ="Πέμπτη";
        break;
      case 5:
        name ="Παρασκευή";
        break;
      case 6:
        name ="Σάββατο";
        break;
      }
        return name;

}
function getMonth(month){
      switch (month) {
        case 0:
          name ="Ιανουαρίου";
          break;
        case 1:
          name ="Φεβρουαρίου";
          break;
        case 2:
          name ="Μαρτίου";
          break;
        case 3:
          name ="Απριλίου";
          break;
          case 4:
            name ="Μαϊου";
            break;
          case 5:
            name ="Ιουνίου";
            break;
          case 6:
            name ="Ιουλίου";
            break;
          case 7:
            name ="Αυγούστου";
            break;
          case 8:
             name ="Σεπτεμβρίου";
             break;
          case 9:
             name ="Οκτωβρίου";
             break;
          case 10:
             name ="Νοεμβρίου";
             break;
          case 11:
             name ="Δεκεμβρίου";
             break;
    }
    return name;
}

module.exports = router;
