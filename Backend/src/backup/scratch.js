


// /// test
// function add(x,y) {
//   console.log(x + y)
//   return x + y
// }

// // addFive is the higher order function
// function addFive(x, callback) { // we are createing a reference that we can invoke
//   return callback(5, x)
// }

// addFive(10, add)

// const start = Math.floor(Date.now() / 1000)
// console.log("start:", start)

// const start = Date.UTC(2000,  0, 1) / 1000
// console.log("start:", start)

// const d = new Date();
// let day = d.getUTCDate();
// console.log("day:", day)

// ///////////////
// var now = new Date;
// var utc_timestamp = Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate(),
//                              now.getUTCHours(),now.getUTCMinutes(),now.getUTCSeconds(),now.getUTCMilliseconds())
// var xrpl_epoch    = Date.UTC(2000,  0, 1, 0, 0, 0, 0)
// var delta_epoch   = Math.floor( (utc_timestamp - xrpl_epoch) / 1000 )

// FinishAfter_s = delta_epoch + 30
// CancelAfter_s = delta_epoch + 60*10

// console.log(delta_epoch)


/////////////////////////////////////
// Generate Times 
/////////////////////////////////////
// function getTimes() {
//   var now = new Date;
//   var utc_timestamp = Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate(),
//                               now.getUTCHours(),now.getUTCMinutes(),now.getUTCSeconds(),now.getUTCMilliseconds())
//   var xrpl_epoch    = Date.UTC(2000,  0, 1, 0, 0, 0, 0)
//   var delta_epoch   = Math.floor( (utc_timestamp - xrpl_epoch) / 1000 )

//   FinishAfter_s = delta_epoch + 30
//   CancelAfter_s = delta_epoch + 60*10

//   return { FinishAfter_s, CancelAfter_s }
// }

// delta = getTimes()
// console.log("delta:", delta)


// function toDateTime(secs) {
//   var xrpl_epoch = Date.UTC(2000,  0, 1, 0, 0, 0, 0)
//   _secs_after_xrpl_epoch = secs + xrpl_epoch/1000

//   var t = new Date(1970, 0, 1); // Epoch
//   t.setSeconds(_secs_after_xrpl_epoch);
//   return t;
// }

// const secs = 699251160
// t = toDateTime(secs)
// console.log("t:", t)


// function ascii_to_hex(str) {
// 	var arr1 = [];
// 	for (var n = 0, l = str.length; n < l; n ++) {
// 		var hex = Number(str.charCodeAt(n)).toString(16);
// 		arr1.push(hex);}

//     var out = arr1.join('')

// 	return out;
//   }


/////////////////////
//   async function ascii_to_hex(str) {
//     var arr1 = [];
//     for (var n = 0, l = str.length; n < l; n ++) {
//         var hex = Number(str.charCodeAt(n)).toString(16)
//         arr1.push(hex);}

//     const out = arr1.join('')
//     return { out }
//   }



// str = {"accountId":"ShXnShf92hfhgj",
// "agreementSignedOn":"2022-02-27T10:34:24+00",
// "agreementExpiresOn":"2023-02-27T10:34:24+00",
// "professionalUsers":18,
// "nonProfessionalUsers":0}



// _str_hex = ascii_to_hex(JSON.stringify(str))
// console.log(_str_hex)




const xrpl = require("xrpl")

async function main() {
  // Connect to the network Define the network client
  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
  await client.connect()

  const cc = require('five-bells-condition')
  const crypto = require('crypto')

  const preimageData = crypto.randomBytes(32)
  const myFulfillment = new cc.PreimageSha256()
  myFulfillment.setPreimage(preimageData)

  const condition = myFulfillment.getConditionBinary().toString('hex').toUpperCase()
  console.log('Condition:', condition)
  // (Random hexadecimal, 72 chars in length)

  // keep secret until you want to finish executing the held payment:
  const fulfillment = myFulfillment.serializeBinary().toString('hex').toUpperCase()
  console.log('Fulfillment:', fulfillment)



client.disconnect()
}

/////////////////////
// Run Code
/////////////////////
main()