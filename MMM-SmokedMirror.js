"use strict"

Module.register('MMM-SmokedMirror', {
  defaults: {
    updateInterval: 30,
    animationSpeed: 1000,
    fontSize: 100,
    AirlyIndex: false,
    colors: true,
    lang: 'en',
    showValues: false,
    debug: false,
  },
  start: function () {
    Log.info('Starting module: ' + this.name);
    
    this.config.fontSize = parseInt(this.config.fontSize);
    this.loaded = false;
    this.errMsg = false;

    this.sendSocketNotification('GET_META', { id: parseInt(this.data.index), apiKey: this.config.apiKey, lang: this.config.lang })

    // load data
    this.load();

    // schedule refresh
    setInterval(
      this.load.bind(this),
      this.config.updateInterval * 60 * 1000);
  },
  load: function () {

    if (this.config.lat && this.config.lng) {
      this.sendSocketNotification('GET_DATA', { id: parseInt(this.data.index), AirlyIndex: this.config.AirlyIndex, lat: this.config.lat, lng: this.config.lng, apiKey: this.config.apiKey, lang: this.config.lang })
    }
  },
  socketNotificationReceived: function (notification, payload) {
    if (this.config.debug)
      console.log(notification, payload);
    switch (notification) {
      case 'DATA':
        if (payload.id === parseInt(this.data.index)) {
          this.data.pollution = payload;
          this.errMsg = false;
          this.loaded = true;
          this.updateDom(this.animationSpeed);
        }
        break;
      case 'META':
        if (payload.id === parseInt(this.data.index)) {
          this.data.meta = payload.meta;
        }
        break;
      case 'ERR':
        if (payload.type === 'config error')
          this.errMsg = payload.msg;
        console.log('error :(', payload)
        break;
      default:
        console.log('wrong socketNotification: ' + notification)
        break;
    }
  },
  html: {
    table: '<table>\
  <tbody style="font-size: {1}%;{2}"><tr><td style="white-space: nowrap;"><span class="fa fa-leaf"></span> {3}</td><td>{4}</td></tr>\
  </tbody>\
  <caption align="bottom" class="xsmall" style="white-space: nowrap;">{0}</caption>\
</table>',
  },
  getScripts: function () {
    return [
      'String.format.js',
      'moment.js'
    ];
  },
  getStyles: function () {
    return [
      'font-awesome.css',
      'MMM-SmokedMirror.css',
    ];
  },
  getDom: function () {
    var wrapper = document.createElement('div');
    if (this.errMsg) {
      wrapper.innerHTML = this.translate(this.errMsg);
      wrapper.className = 'dimmed light small';
    }
    if (!this.config.lat || !this.config.lng) {
      wrapper.innerHTML = this.translate('missingCoords');
      wrapper.className = 'dimmed light small';
    }
    else if (!this.loaded) {
      wrapper.innerHTML = this.translate('Loading');
      wrapper.className = 'dimmed light small';
    }
    else {

      wrapper.innerHTML = '<span class="xsmall">' + this.translate(this.data.pollution.name) + (this.config.showValues ? '' : ': ' + Math.round(this.data.pollution.value)) + '</span>'
      + this.html.table.format(
        this.translate("lastCheck") + moment().format('YYYY-MM-DD H:mm'),
        this.config.fontSize,
        this.config.colors ? ' color: ' + this.data.pollution.color : '',
        this.config.showValues ? Math.round(this.data.pollution.value) : this.data.pollution.description,
        this.data.pollution.advice
      )
    }
    return wrapper;
  },
  getTranslations: function () {
    return {
      en: 'translations/en.json',
      pl: 'translations/pl.json'
    }
  },
});
