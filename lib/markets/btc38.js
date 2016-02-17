var request = require('request');

var base_url = 'http://api.btc38.com/v1';

// http://api.btc38.com/v1/ticker.php?c=bost&mk_type=cny
// http://api.btc38.com/v1/trades.php?c=bost&mk_type=cny
// http://api.btc38.com/v1/depth.php?c=bost&mk_type=cny

function get_summary(coin, exchange, cb) {
  var req_url = base_url + '/ticker.php?c=' + coin + '&mk_type=' + exchange;
  request({uri: req_url, json: true}, function (error, response, body) {
    if (error) {
      return cb(error, null);
    } else {
      if (body.message) {
        return cb(body.message, null)
      } else {
        return cb (null, body['ticker']);
      }
    }
  });
}

function get_trades(coin, exchange, cb) {
  var req_url = base_url + '/trades.php?c=' + coin + '&mk_type=' + exchange;
  request({uri: req_url, json: true}, function (error, response, body) {
    if (error) {
      return cb(error, null);
    } else {
      if (body.message) {
        return cb(body.message, null)
      } else {
        return cb (null, body);
      }
    }
  });
}

function get_orders(coin, exchange, cb) {
  var req_url = base_url + '/depth.php?c=' + coin + '&mk_type=' + exchange;
  request({uri: req_url, json: true}, function (error, response, body) {
    if (body.success == 0) {
      return cb(body.error, null, null);
    } else {
      return cb(null, body['asks']);
    }
  });
}

module.exports = {
  get_data: function(coin, exchange, cb) {
    var error = null;
    get_orders(coin, exchange, function(err, buys, sells) {
      if (err) { error = err; }
      get_trades(coin, exchange, function(err, trades) {
        if (err) { error = err; }
        get_summary(coin, exchange, function(err, stats) {
          if (err) { error = err; }
          return cb(error, {buys: buys, sells: sells, chartdata: [], trades: trades, stats: stats});
        });
      });
    });
  }
};