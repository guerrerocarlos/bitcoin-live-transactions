bitcoin-live-transactions
=====

This module uses running [insight-api](https://github.com/bitpay/insight-api) instances to get live bitcoin transaction as they happen in the Bitcoin P2P network. 

How to use it
--

Create a **BLT** (Bitcoin Live Transactions) instance:
```javascript
var BLT = require("bitcoin-live-transactions")
var bitcoin = new BLT()
```

Connect to the Bitcoin P2P network:
```javasctript
bitcoin.connect()
```

Get a notification when successfully connected to the  Bitcoin P2P network.
```javascript
bitcoin.events.on('connected', function() {
   // start listening to addresses
})
```


Check uBTC balance for a given bitcoin address:
```javascript
bitcoin.getBalance('1CZGSZPGsyeeLYyoXdmJtanEmaKKpwYM7g').then(function(balance) {
  console.log('balance:', balance);
})
```

Will output:

> balance: {
  "address": "1CZGSZPGsyeeLYyoXdmJtanEmaKKpwYM7g",
  "amount": 5670.8099999999995,
  "curr": "bits(uBTC)"
}

To get all the detailed information about an address, use **bitcoin.getTxs** instead of **bitcoin.getBalance**