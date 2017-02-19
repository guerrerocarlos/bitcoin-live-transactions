const io = require('socket.io-client')
const debug = require('debug')('blt')
const txdebug = require('debug')('blt:tx')
const hashdebug = require('debug')('blt:hash')
const blockdebug = require('debug')('blt:blockchain')
const request = require('request')

const EventEmitter = require('events').EventEmitter;

module.exports = function() {
  this.insight_servers = ["https://insight.bitpay.com/", "https://www.localbitcoinschain.com/", "https://search.bitaccess.co/"]
  this.insight_apis_servers = ["https://insight.bitpay.com/api/", "https://www.localbitcoinschain.com/api/", "https://search.bitaccess.co/insight-api/"]
  this.connected = false
  self = this
  this.events = new EventEmitter()
  this.getTxs = function(address) {
    return new Promise(function(Success, Reject) {
      self.getAddress(address).then(function(result) {
        Success(result.txs)
      })
    })
  }
  this.getBalance = function(address) {
    return new Promise(function(Success, Reject) {
      self.getAddress(address).then(function(result) {
        Success(result.balance)
      }).catch(Reject)
    })
  }
  this.getAddress = function(address) {
    var result = {}
    blockdebug('Getting txs for address', address, 'url:', self.api_url + 'txs/?address=' + address)
    return new Promise(function(Success, Reject) {
      result.address = address
      result.in = 0
      result.out = 0
      result.curr = "bits(uBTC)"
      request(self.api_url + 'txs/?address=' + address, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          blockdebug('success :)')

          var transaction_json = JSON.parse(body)
            // console.log('transaction_json')
          transaction_json.txs.forEach(function(each_tx) {
            each_tx.vout.forEach(function(each_vout) {
              each_vout.scriptPubKey.addresses.forEach(function(outaddress) {
                // console.log('checking', outaddress)
                if (outaddress === address) {
                  // console.log('adding!', each_vout.value)
                  result.in = result.in + each_vout.value * 1000000
                }
              })
            })
            each_tx.vin.forEach(function(each_vin) {

              // each_vin.scriptPubKey.addresses.forEach(function(outaddress) {
              // console.log('checking', outaddress)
              if (each_vin.addr === address) {
                // console.log('adding!', each_vout.value)
                result.out = result.out + each_vin.value * 1000000
              }
              // })

            })
          })
          result.balance = result.in - result.out
          result.txs = transaction_json.txs.length
          Success({ txs: JSON.parse(body), balance: result })
            // Success({ result: result })
        } else {
          blockdebug('reject')
          Reject(response.statusCode)
        }
      })
    })
  }
  this.connect = function() {
    return new Promise(function(Success, Reject) {
      if (self.connected === false) {
        self.url = self.insight_servers.shift()
        self.api_url = self.insight_apis_servers.shift()
        if (self.url != undefined) {
          self.socket = io(self.url);
          setTimeout(function() {
            if (self.connected === false) {
              debug('Could not connect, trying again...')
              self.socket.disconnect()
              self.connect()
            }
          }, 5000)

          self.socket.on('connect', function() {
            Success()
            self.connected = true
            self.socket.emit('subscribe', 'inv')
            self.events.emit('connected')
          });
          self.socket.on('tx', function(data) {
            self.events.emit('tx', data)
            data.vout.forEach(function(each_vout) {
              hashdebug({ address: Object.keys(each_vout)[0], amount: each_vout[Object.keys(each_vout)[0]] })
              self.events.emit(Object.keys(each_vout)[0], { address: Object.keys(each_vout)[0], amount: each_vout[Object.keys(each_vout)[0]] });
            })
            txdebug("New transaction received: " + JSON.stringify(data))
          })
          self.socket.on('event', function(data) {
            debug('event', data)
          });
          self.socket.on('disconnect', function(d) {
            debug('disconnect!', d)
          });
          self.socket.on('error', function(e) {
            debug('error!', e)
          });
        } else {
          Reject('Cannot reach any bitcoin insight server... no bitcoin transactions are being received.')
        }
      }
    });
  }
}