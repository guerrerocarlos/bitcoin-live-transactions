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

Check an address
--
Check uBTC balance for a given bitcoin address:
```javascript
bitcoin.getBalance('1CZGSZPGsyeeLYyoXdmJtanEmaKKpwYM7g').then(function(balance) {
  console.log('balance:', balance);
})
```

Will output:

```javascript 
balance: {
  "address": "1BkJgdopq35eaZGRrau4wdnZFZ3qfM4DUb",
  "in": 3018.02,
  "out": 3018.02,
  "curr": "bits(uBTC)",
  "balance": 0,
  "txs": 2
}
```

That can be checked here:
[https://insight.bitpay.com/address/1CZGSZPGsyeeLYyoXdmJtanEmaKKpwYM7g](https://insight.bitpay.com/address/1CZGSZPGsyeeLYyoXdmJtanEmaKKpwYM7g)

To get all the detailed information about an address, use **bitcoin.getTxs** instead of **bitcoin.getBalance**

Live stream
--

To Listen to live transaction events on the Bitcoin P2P network for a given address, the event is called as the address itself:
```javascript
bitcoin.events.on('138WJKb1mXbkRGNpyMVEZ9EsoXjMEvJfT4',function(tx){
  console.log('Transaction detected!', tx);
})
```
Will trigger the event in real time if a payment is done to that address:
```javascript
Transaction detected! { address: '138WJKb1mXbkRGNpyMVEZ9EsoXjMEvJfT4',
  amount: 381000 }
```

Show everything live
--

If you want to see **ALL** transactions happening live, use the **tx** event:



```javascript
bitcoin.events.on('tx',function(tx){
  console.log('>> Transaction detected:', tx);
})
```
Will trigger the event in real time if a payment is done to that address:
```javascript
>> Transaction detected: { txid: '82d1ce35c4b755f8365bcfab9c485cf798cfcfe6e62a222995ca28335ada5374',
  valueOut: 0.01068895,
  vout:
   [ { '1P4BHe6R9Wa5cRWAPPT7FCzCDoBEqC6VK6': 1047784 },
     { '1Jp1tW7FFS3kS3jXgWbppiYn6oR9d4ckec': 21111 } ],
  isRBF: false }
>> Transaction detected: { txid: '6ed5f489e080dbc07ed7a6cc18c70271443708aa57a032deb1b1bf3ed38a06cd',
  valueOut: 0.22005829,
  vout:
   [ { '1LxJtK99ryA1yRjekQeU1ChZdsBoNeWQgp': 8810932 },
     { '1Q63dyZEwQAtn8dsxyvK1dduG4axxjBgm9': 13194897 } ],
  isRBF: false }
...
```