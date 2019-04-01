/* eslint-disable */

/**
 * Haravan OAuth2 node.js API
 *
 *
 *
 */
/*
 config = {
		haravan_api_key: 'abc123',
		haravan_shared_secret: 'asdf1234',
		haravan_scope: 'read_customers',
		redirect_uri: 'http://localhost:3000/finalize',
    code: 'di389so32hwh28923823dh3289329hdd',
    shop: 'testy-tester.myharavan.com',
    timestamp: '1402539839',
    signature: '0132e77d7fb358ecd4645d86cfc39d27',
    access_token: "xsOvZ4JczVO4ODEVnZd66AGZlOa6eEqiCsT1KjIilOWcuOMaML-p0GDgqtWwEJaetbnytMBbr2MZi0RNjOUJYYxQ4sWTHoBIVW88qoyrq1yaED6KkCEAV3HtrW5fDCpxKL9xP25Rt-6CrNeMIqBUTMh2gBBHNEnPxXCpKByH52FQRZl0c3lF5vbD-c1x99JoYoM6rmNF42BSMqscsHW_8S4wItHz2u_lil01AJn-dU_ITY_kIRRAVYs_32QxB-TPXQJu04nkgrqXioslRGEgyPo_gKRKXdNiXmhm5jAF-BTOZCZHUDiakA6FvyIVvCizTUn4C4vfpdQOtXmntpuWmVh_ariBz4vDnnPuUm4ADoAIoDP4ucRIYK_fKP4m7QaG9bAspvvJEqKct3hMlKDwpYf4NloLwa-77p7JI9Ljp_11mdnSi1i-ILIZmFdv1ehkx4L9CpBYx6PU53obz3y5Y7_VCi0",
    verbose: true,
    port: 443,
    protocol: "https://"
   };
*/

var crypto = require('crypto');
var md5 = require('md5');
var request = require('request');
var hconfig = require('../../config/config');

hconfig = hconfig.haravanApp;

function HaravanAPIUtil(newConfig) {
  if (!(this instanceof HaravanAPIUtil)) return new HaravanAPIUtil(newConfig);

  var newConfig = newConfig || {};
  this.config = {
    haravan_api_key: newConfig.haravan_api_key || hconfig.apiKey,
    haravan_shared_secret: newConfig.haravan_shared_secret || hconfig.apiSecret,
    haravan_scope: newConfig.haravan_scope || hconfig.scope,
    redirect_uri: newConfig.redirect_uri || hconfig.redirectUri,
    verbose: newConfig.verbose || hconfig.verbose,
    protocol: newConfig.protocol || hconfig.protocol,

    code: newConfig.code || '',
    shop: newConfig.shop || '',
    timestamp: newConfig.timestamp || '',
    signature: newConfig.signature || '',
    access_token: newConfig.access_token || ''
  };
}

HaravanAPIUtil.prototype.buildLinkInstallApp = function(shop) {
  var currentShop = shop || this.config.shop;
  var linkInstall = this.config.protocol + currentShop + '/admin/api/auth/?api_key=' + this.config.haravan_api_key;
  return linkInstall;
};

HaravanAPIUtil.prototype.buildAuthURL = function() {
  var auth_url = this.config.protocol + this.config.shop;
  auth_url += "/admin/oauth/authorize?";
  auth_url += "client_id=" + this.config.haravan_api_key;
  auth_url += "&scope=" + this.config.haravan_scope;
  auth_url += "&redirect_uri=" + this.config.redirect_uri;
  auth_url += "&response_type=code";
  return auth_url;
};

HaravanAPIUtil.prototype.set_access_token = function(token) {
  this.config.access_token = token;
};

HaravanAPIUtil.prototype.conditional_console_log = function(msg) {
  if (this.config.verbose) console.log(msg);
};

HaravanAPIUtil.prototype.check_security = function() {
  var shop      = this.config.shop;
  var timestamp = this.config.timestamp;
  var signature = this.config.signature;
  var code      = this.config.code;
  var secret    = this.config.haravan_shared_secret;

  var signer = crypto.createHmac('sha256', secret);
  var str = '';
  if (code) str = 'code=' + code;

  str += 'shop=' + shop + 'timestamp=' + timestamp;

  var result = signer.update(str).digest('hex');

  if (result != signature) {
    return false;
  }
  return true;
};

HaravanAPIUtil.prototype.hostname = function() {
  var host_name = this.config.shop;
  return host_name;
};

HaravanAPIUtil.prototype.port = function() {
  if (this.config.port) {
    return this.config.port;
  }
  return 443;
};

HaravanAPIUtil.prototype.makeRequest = function(endpoint, method, data, callback) {
  var dataString = "";
  if (data) dataString = JSON.stringify(data);
  var self = this;
  var methodCall = method.toLowerCase();
  var options = {
    host: self.hostname(),
    path: endpoint,
    method: methodCall,
    headers: {
      'accept': '*/*',
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + self.config.access_token
    },
    agent: false
  };

  if (self.config.protocol == "http://") {
    var protocol = require('http');
  } else {
    var protocol = require('https');
    options.port = self.port();
  }

  if (options.method === 'post' || options.method === 'put' || options.method === 'delete') {
    options.headers['Content-Length'] = new Buffer(dataString).length;
  }

  var request = protocol.request(options, function(response) {
    self.conditional_console_log(endpoint + ', STATUS: ' + response.statusCode);

    if (response.headers && response.headers.http_x_haravan_shop_api_call_limit) {
      self.conditional_console_log('API_LIMIT: ' + response.headers.http_x_haravan_shop_api_call_limit);
    }

    response.setEncoding('utf8');

    var body = '';

    response.on('data', function(chunk) {
      body += chunk;
    });

    response.on('end', function() {
      if (response.statusCode === 429) {
        var errInfo = { error: response.statusCode, message: body };
        return callback(errInfo, null, response.statusCode);
      } else if (response.statusCode === 500 || response.statusCode === 404) {
        var errInfo = { error: response.statusCode, message: body, options: options, dataString: dataString };
        return callback(errInfo, null, response.statusCode);
      } else {
        try {
          var json = {};
          if (body.trim() != '') { //on some requests, Haravan retuns an empty body (several spaces)
            json = JSON.parse(body);
            if (json.hasOwnProperty('error') || json.hasOwnProperty('errors')) {
              return callback(json, null, response.statusCode);
            }
          }
        } catch (e) {
          return callback(e, null, response.statusCode);
        }
        return callback(null, json, response.statusCode);
      }
    });
  });

  request.on('error', function(e) {
    return callback(e);
  });

  if (options.method === 'post' || options.method === 'put' || options.method === 'delete') {
    request.write(dataString);
  }

  request.end();
};

HaravanAPIUtil.prototype.get = function(endpoint, callback) {
  var data = null;
  this.makeRequest(endpoint, 'GET', data, callback);
};

HaravanAPIUtil.prototype.post = function(endpoint, data, callback) {
  this.makeRequest(endpoint, 'POST', data, callback);
};

HaravanAPIUtil.prototype.put = function(endpoint, data, callback) {
  this.makeRequest(endpoint, 'PUT', data, callback);
};

HaravanAPIUtil.prototype.delete = function(endpoint, data, callback) {
  if (arguments.length < 3) {
    if (typeof data === 'function') {
      callback = data;
      data = null;
    } else {
      callback = new Function;
      data = typeof data === 'undefined' ? null : data;
    }
  }
  this.makeRequest(endpoint, 'DELETE', data, callback);
};

HaravanAPIUtil.prototype.has_header = function(response, header) {
  return response.headers.hasOwnProperty(header) ? true : false;
};

//security v2 for user
HaravanAPIUtil.prototype.generate_security_user = function(shop) {
  var str = 'shop=' + shop + 'secret=' + this.config.haravan_shared_secret;
  var result = md5(str);
  return result;
};

HaravanAPIUtil.prototype.check_security_user = function(shop, signature) {
  var result = this.generate_security_user(shop);
  if (result != signature) {
    return false;
  }
  return true;
};

//access_token
HaravanAPIUtil.prototype.getNewAccessToken = function(callback) {
  var self = this;
  var url = self.config.protocol + self.hostname() + "/admin/oauth/access_token";
  var headers = {
    'User-Agent': 'Super Agent/0.0.1',
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  var options = {
    url: url,
    method: 'POST',
    headers: headers,
    form: {
      'redirect_uri': self.config.redirect_uri,
      'client_id': self.config.haravan_api_key,
      'client_secret': self.config.haravan_shared_secret,
      'code': self.config.code,
      'grant_type': 'authorization_code'
    }
  };
  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      try {
        var rs = JSON.parse(body);
        if (rs.access_token) {
          callback(null, rs);
        } else {
          callback(null);
        }
      } catch (e) {
        callback(e);
      }
    } else {
      callback(error);
    }
  });
};

//get new access_token by refresh_token
HaravanAPIUtil.prototype.refreshAccessToken = function(refresh_token, callback) {
  var self = this;
  var url = self.config.protocol + self.hostname() + "/admin/oauth/access_token";
  var headers = {
    'User-Agent': 'Super Agent/0.0.1',
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  var options = {
    url: url,
    method: 'POST',
    headers: headers,
    form: {
      'client_id': self.config.haravan_api_key,
      'client_secret': self.config.haravan_shared_secret,
      'refresh_token': refresh_token,
      'grant_type': 'refresh_token'
    }
  };
  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      try {
        var rs = JSON.parse(body);
        if (rs.access_token) {
          callback(null, rs);
        } else {
          callback(null);
        }
      } catch (e) {
        callback(e);
      }
    } else {
      callback(error);
    }
  });
};

module.exports = HaravanAPIUtil;
