# MagicMirrorModule-SmokedMirror

[MagicMirror Project on Github](https://github.com/MichMich/MagicMirror) | [Airly](https://airly.eu)

<img src="https://raw.githubusercontent.com/Santanachia/MMM-SmokedMirror/master/screen.png" />

## Usage 

To use this module, go to the *modules* subfolder of your mirror and clone this repository.
Go into `MMM-SmokedMirror` folder
Run `npm install`

### Configuration

To run the module, you need to add the following data to your config.js file.

```
{
  module: 'MMM-SmokedMirror',
  position: 'top_center', // you may choose any location
  config: {
    lat: 50.062006, // latitude as decimal degree
    lng: 19.940984 // longitude as decimal degree
  }
}
```

You may want to set the following options in the config section as well:

| Option |  Description | 
|---|---|
| `AirlyIndex` | Name of Air quality index<br><br>**Possible values:** `AIRLY_CAQI`, `CAQI` and `PIJP` | 
| `animationSpeed` | Speed of the update animation. (Milliseconds)<br><br>**Possible values:** `0` to `5000`<br>**Default value:** `1000` (1 second) | 
| `colors` | Makes pollution colorful<br><br>**Possible values:** `true` or `false`<br>**Default value:** `false` | 
| `fontSize` | Sets the base font-size to a percent of the default value<br><br>**Default value:** `100` | 
| `lang` | Change the language<br><br>**Possible values:** `en` or `pl` | 
| `showValues` | Show level of pollution<br><br>**Possible values:** `true` or `false`<br>**Default value:** `false` | 
| `updateInterval` | How often does the content needs to be fetched? (Minutes)<br><br>**Possible values:** `1` to `144`<br>**Default value:** `30` (30 minutes) | 

### ToDo
* give ability to pick station by it's id
* show address and id of nearest station
* give ability to pick columns to show (additional level and value columns)
* give ability to show pollution instead of air quality index

### Known Issues
