'use strict';
Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/api_docs/mt_bruno_elevation.csv', function(err, rows){
function unpack(rows, key) {
  return rows.map(function(row) {
    //console.log(`row: ${row}`);
    //console.log(row)
    return row[key];
  });
}

var z_data=[ ]
for(var i=0;i<24;i++)
{
  z_data.push(unpack(rows,i));
}

var data = [{
           z: z_data,
           type: 'surface'
        }];
console.log(z_data)
var layout = {
  title: 'Mt Bruno Elevation',
  autosize: false,
  width: 1000,
  height: 1000,
  margin: {
    l: 65,
    r: 50,
    b: 65,
    t: 90,
  }
};
Plotly.newPlot('myDiv', data, layout);
});

function formatDataPlotly(hashOfUsers){
  var zdata = [];
  var keys = Object.keys( hashOfUsers );
  keys.forEach( function(key, x){
    zdata[ x ] = [];
    var diff = hashOfUsers[ key ][ 0 ].ts;
    hashOfUsers[ key ].forEach( function( event, x2 ){
      if( x2 > 0 ){
        var y = Math.floor( (event.ts - diff)/100000 );//Math.floor( event.ts / 1000 );
        var dt = event.ts - hashOfUsers[ key ][x2-1].ts
        zdata[ x ][ y ] = 100000 / dt;
      }
    });
  });
  zdata.map(function(x_array){
    return x_array.map( function(z_val){
        if( z_val === undefined || Infinity ) return 0;
        return z_val;
    })
  });
  console.log(zdata);
  window.plot(zdata)
  //return zdata;
}

window.formatDataPlotly = formatDataPlotly;

function plot(z_data){
  var data = [{
           z: z_data,
           type: 'surface'
        }];
  console.log(z_data)
  var layout = {
    title: 'Mt Bruno Elevation',
    autosize: false,
    width: 1000,
    height: 1000,
    margin: {
      l: 65,
      r: 50,
      b: 65,
      t: 90,
    }
  };
  Plotly.newPlot('myDiv', data, layout);
}

window.plot = plot;

