module.exports = {
  getFecha: function(val){
    var val = val || 0,
        fecha = new Date(parseInt(val));
    return fecha.toISOString().substr(0, 10);
  },
  getHora: function(val){
    var val = val || 0;
    if(val == 0){
      return '';
    }
    var fecha = new Date(parseInt(val)),
        hours = fecha.getHours(),
        minutes = "0" + fecha.getMinutes(),
        seconds = "0" + fecha.getSeconds(),
        miliseconds = "0" + fecha.getMilliseconds(),
        tiempo = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + '.'+ miliseconds.substr(-2);
    return tiempo;
  },
  getTiempo: function (ms) {
    var d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    h += d * 24;
    if(isNaN(h) || isNaN(m) || isNaN(s)){
      return '';
    }
    return h + ':' + m + ':' + s;
  },
  getDistanciaTiempo: function(val){
    var val = val || 0,
        fecha = new Date(parseInt(val)),
        hours = fecha.getHours(),
        minutes = "0" + fecha.getMinutes(),
        seconds = "0" + fecha.getSeconds(),
        miliseconds = "0" + fecha.getMilliseconds(),
        tiempo = "00:"+minutes.substr(-2) + ':' + seconds.substr(-2) + '.'+ miliseconds.substr(-2);
    return tiempo
  },
  getEstatus: function(val){
    return ((val=='False')?'Apagado': 'Encendido');
  },
  getEstatusClass: function(val){
    if(val=='True'){
        return 'table-success';
    }
    return 'table-danger';
  },
  generarDatosGrafica: function(){

    return "[['Mushrooms', 3],['Onions', 1],['Olives', 1]]";
  },

  comparar: function(a,b, opts){
    if (a == b) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
  }
};
