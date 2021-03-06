var fs = require('fs')

var MessageTransform = require('./MessageTransform')
var ElementTransform = require('./ElementTransform')

module.exports = PartyStream = function (gdsn) {
  if (!(this instanceof PartyStream)) {
    return new PartyStream(gdsn)
  }
  //console.log('Creating new instance of PartyStream service')
  this._gdsn = gdsn
}

PartyStream.prototype.getEachParty = function (is, cb) {

  var msg_header = new MessageTransform()
  var elements   = new ElementTransform('registryPartyDataDumpDetail')

  var gdsn = this._gdsn

  var msg_info_result = false

  msg_header.on('msg_info', function (err, msg_info) {
    if (err) return cb(err)
    console.log('found RPDD info: ' + JSON.stringify(msg_info))
    msg_info_result = msg_info

    // once we have the msg_info, we can start our party stream
    elements.on('element_xml', function (xml) {
      console.log('party element xml length: ' + xml.length)
      var party_info = gdsn.get_party_info(xml, msg_info)
      console.log('found party: ' + party_info.provider)
      cb(null, party_info)
    })
    elements.on('end', function () {
      cb(null, null) // all done
    })
    elements.on('error', function (err) {
      cb(err)
    })
    //console.log('finished setting up element stream events')
  })
  msg_header.on('end', function () {
    //console.log('msg_header -> end')
    if (!msg_info_result) cb (new Error('required message header info not found'))
  })
  msg_header.on('error', function (err) {
    console.log('msg_header -> err: ' + err)
    //cb(err)
  })
  //console.log('finished setting up msg_header events')

  is.pipe(msg_header).pipe(elements).resume()
}

