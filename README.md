This is a very simple web-based GPS logger based on [node](https://nodejs.org).
It reads data from ```gpsd``` and pushes it to the client via Server Sent Events, where the data is displayed with [leaflet](http://leafletjs.com).

# Dependencies
```
node
npm
```

# Installation
```
git clone https://github.com/bastibl/webgps.git
cd webgps
npm install
```

# Running
If needed adapt ```gpsd``` host and port in ```routes/index.js```. Then start the server
```
./bin/www
```
and open ```localhost:3000``` in your browser.

# Adding Map Data
Map data is downloaded locally to support measurements on the road without Internet access.
Some example tiles that display parts of Germany are in the ```public/maps``` folder.
Use [Atlas Map Creator](http://mobac.sourceforge.net) to download other tiles from your area.
Select a region and granularity and export the map as ```Osmdroid```.
