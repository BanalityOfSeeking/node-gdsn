var cheerio   = require('cheerio')

var log = function (msg) { console.log('PartyInfo: ' + msg) }

module.exports = function PartyInfo(xml) {

  if (!xml || !xml.length) return this

  var party_info = this // for uniform use with callbacks
  party_info.xml = xml

  var $ = cheerio.load(xml, { 
    _:0
    , normalizeWhitespace: true
    , xmlMode: true
  })

  var $party = $('party')
  console.log('party count: ' + $parties.length)

  party_info.active = $party('isPartyActive').text()

  var last_update = $(lastUpdateDateTime).text()
  party_info.update_ts = (new Date(last_update)).getTime()

  party_info.gln      = $party('informationProviderOfParty gln').text()
  party_info.top_gln  = $party('organisationHighestLevelParty gln').text()
  party_info.datapool = $party('registeringParty').text()

  var $addr = $party('partyAddress')
  party_info.country  = $addr('countryCode').text()
  party_info.city     = $addr('city').text()
  party_info.name     = $addr('name').text()
  party_info.zip      = $addr('postalCode').text()
  party_info.state    = $addr('state').text()
  party_info.street1  = $addr('streetAddressOne').text()
  party_info.street2  = $addr('streetAddressTwo').text()
  party_info.language = $addr('languageOfThePartyCode').text()

  party_info.created_ts    = (new Date(created_date_time)).getTime()
  log('derived party_info: ' + JSON.stringify(party))
  return party

  /* 2.8
  party_info.gln           = $('party informationProviderOfParty gln')
  party_info.name          = $('registryPartyDataDumpDetail registryParty registryPartyInformation partyRoleInformation partyOrDepartmentName')
  party_info.country       = $('registryPartyDataDumpDetail registryParty registryPartyInformation registryPartyNameAndAddress countryCode countryISOCode')
  party_info.data_pool_gln = $('registryPartyDataDumpDetail registryPartyDates registeringParty')
  var created_date_time    = $('registryPartyDataDumpDetail registryPartyDates registrationDateTime')
  party_info.created_ts    = (new Date(created_date_time)).getTime()
  */
}