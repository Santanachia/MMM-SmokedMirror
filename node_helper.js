
const NodeHelper = require('node_helper');
const https = require('https');

module.exports = NodeHelper.create({
  socketNotificationReceived(notification, payload) {
    var that = this;
    
      switch (notification) {
        case 'GET_DATA':
          if (!payload.lat || !payload.lng) {
            return that.sendSocketNotification('ERR', { type: 'config error', msg: 'missingCoords' });
          }
          else if (!payload.apiKey) {
            return that.sendSocketNotification('ERR', { type: 'config error', msg: 'missingapiKey' });
          }
          else {

            var options = {
              host: 'airapi.airly.eu',
              port: 443,
              path: 'https://airapi.airly.eu/v2/measurements/point?lat=' + payload.lat + '&lng=' + payload.lng + (payload.AirlyIndex ? '&indexType=' + payload.AirlyIndex : ''),
              headers: {
                apikey: payload.apiKey,
                'Accept-Language': payload.lang,
                Accept: 'application/json'
              }
            };

            https.get(options, function (resource) {
              var data = '';
              resource.on('data', function (chunk) {
                data += chunk;
              });
              resource.on('end', function () {
                try {
                  data = JSON.parse(data).current.indexes[0];
                } catch (e) {
                  return that.sendSocketNotification('ERR', { type: 'json error', msg: e });
                }

                data.id = payload.id;

                return that.sendSocketNotification('DATA', data)

              });
            }).on('error', function (e) {
              return that.sendSocketNotification('ERR', { type: 'request error', msg: e.message });
            });
          }
          break;
        case 'GET_META':
          if (!payload.apiKey) {
            return that.sendSocketNotification('ERR', { type: 'config error', msg: 'missingapiKey' });
          }
          else {

            var options = {
              host: 'airapi.airly.eu',
              port: 443,
              path: 'https://airapi.airly.eu/v2/meta/indexes',
              headers: {
                apikey: payload.apiKey,
                'Accept-Language': payload.lang,
                Accept: 'application/json'
              }
            };

            https.get(options, function (resource) {
              var meta = '';
              resource.on('data', function (chunk) {
                meta += chunk;
              });
              resource.on('end', function () {
                try {
                  meta = { meta: JSON.parse(meta) };
                } catch (e) {
                  return that.sendSocketNotification('ERR', { type: 'json error', msg: e });
                }

                meta.id = payload.id;

                return that.sendSocketNotification('META', meta)

              });
            }).on('error', function (e) {
              return that.sendSocketNotification('ERR', { type: 'request error', msg: e.message });
            });
          }
          break;
      }
  }
});
