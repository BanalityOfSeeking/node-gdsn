(function () {

  if (process.argv.length < 3) {
    console.log("usage: node validate_gln.js {gln}")
    process.exit(1)
  }
  var gln = process.argv[2]

  var GDSN = require('../index.js')
  
  console.log('gln ' + gln + ' is valid: ' + GDSN.validateGln(gln))

})()
