// Logs all incoming transactions and newly mined blocks in realtime

const BLT = require("../")
const bitcoin = new BLT()

bitcoin.connect()

bitcoin.events.on('connected', function() {
   console.log('Connected')
})

bitcoin.events.on('tx', function(tx){
  console.log('>> Transaction detected:', tx);
})

bitcoin.events.on('block', function(block){
  console.log('>> New block mined:', block);
})
