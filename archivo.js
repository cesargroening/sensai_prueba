const fs = require('fs');

var Archivo = function(){
  //Privados
  var info = {};
  var calcularDuracion = function(){
    return 3;
  };

  var abrirArchivo = function(csvToJson){
    fs.readFile('example.csv', 'utf8', (err, data)=>{
      csvToJson(data);
    });
  };

  var csvToJson = function(data){
    var lineas = data.split('\n'),
        cabezeras = lineas[0].split(','),
        res = [];
    var orden = 0;
    var estatus_aux = null;
    var estatus_nuevo = null;
    var fecha = null;
    var fecha_aux;
    var moldes = [];
    var timeStamp_inicio = 0;
    var timeStamp_fin = 0;
    var golpes_inicio = 0;
    var golpes_fin = 0;
    var veces_activa = 0;
    var veces_detenida = 0;
    var detalle_molde = [];
    var golpes_total_molde = 0;
    var tiempo_total_molde = 0;
    var golpes = 0;
    var tiempo = 0;
    var tiempo_detenido = 0;
    var tiempo_activa = 0;

    for(var i=1; i<lineas.length; i++){
      var objeto_actual = {};
      var row_actual = lineas[i].split(',');

      for(var x=0; x<cabezeras.length; x++){
        // objeto_actual[cabezeras[x]] = row_actual[x] || '';
        if(cabezeras[x] == 'Mode_ClutchOn'){
          objeto_actual[cabezeras[x]]= row_actual[x] || '';
        } else if(cabezeras[x] == 'PlcTimesStamp'){
          objeto_actual[cabezeras[x]]= row_actual[x] || '';
        } else if(cabezeras[x] == 'id'){
            objeto_actual[cabezeras[x]]= row_actual[x] || 0;
        } else if(cabezeras[x] == 'PartCounter'){
            objeto_actual[cabezeras[x]]= row_actual[x] || 0;
        } else if(cabezeras[x] == 'DieName'){
            objeto_actual[cabezeras[x]]= row_actual[x] || 0;
        } else if(cabezeras[x] == 'BoxingPartCounter'){
            objeto_actual[cabezeras[x]]= row_actual[x] || 0;
        }
      }
      estatus_aux = estatus_nuevo;
      estatus_nuevo = (objeto_actual['Mode_ClutchOn']=='True')?true:false;
      if(moldes.indexOf(objeto_actual['DieName']) ==-1){
        moldes.push(objeto_actual['DieName']);
      }
      if(estatus_aux != estatus_nuevo){
        orden++;
        objeto_actual['orden'] = orden;
        res.push(objeto_actual);

        if(res.length > 1){
          fecha_sup = parseInt(objeto_actual['PlcTimesStamp']);
          fecha_inf = parseInt(res[res.length-2]['PlcTimesStamp']);
          golpes_sup = objeto_actual['BoxingPartCounter'];
          res[res.length - 2]['tiempo_por_estatus'] = fecha_sup - fecha_inf;

          //Cambio de molde
          if(moldes.length > 1){
            res[res.length - 2]['moldes_usados_por_estatus'] = 'Cambio de ' + moldes[0] + ' a ' + moldes[1];
            res[res.length - 2]['golpes_por_molde'] = golpes_total_molde;
            res[res.length - 2]['tiempo_por_molde'] = tiempo_total_molde;
            detalle_molde.push({
              nombre: moldes[0],
              golpes: golpes_total_molde,
              tiempo: tiempo_total_molde
            });
            console.log(detalle_molde);
            golpes_inf = 0;
            golpes_total_molde = 0;
            tiempo_total_molde = 0;
          }else {
            res[res.length - 2]['moldes_usados_por_estatus'] = moldes[0];
            golpes_inf =parseInt(res[res.length-2]['BoxingPartCounter']);
          }

          res[res.length - 2]['golpes_por_estatus'] = golpes_sup - golpes_inf;
          // res[res.length - 2]['tiempo_por_estatus'] = golpes_sup - golpes_inf;
          golpes_total_molde+= res[res.length - 2]['golpes_por_estatus'];
          tiempo_total_molde+= res[res.length - 2]['tiempo_por_estatus'];
          golpes+= res[res.length - 2]['golpes_por_estatus'];
          tiempo+= res[res.length - 2]['golpes_por_estatus'];
          res[res.length - 2]['golpes'] = golpes

          //Activo
          if(estatus_nuevo){
            //Estatus anterior era inactivo
            tiempo_detenido += res[res.length - 2]['tiempo_por_estatus'];
            veces_activa++;
          } else {
              tiempo_activa += res[res.length - 2]['tiempo_por_estatus'];
              veces_detenida++;
          }
        }
        moldes = [];
      }
    };
    timeStamp_fin = res[res.length -1]['PlcTimesStamp'];
    golpes_fin = res[res.length -1]['BoxingPartCounter'];
    timeStamp_inicio = res[0]['PlcTimesStamp'];
    golpes_inicio = res[0]['BoxingPartCounter'];
    info = {
      informacion: res,
      detalle_molde:  detalle_molde,
      // golpes_por_molde: golpes_por_molde,
      // tiempo_por_molde: tiempo_por_molde,
      timeStamp_inicio: timeStamp_inicio,
      timeStamp_fin: timeStamp_fin,
      golpes_total: golpes,
      golpes_total_molde: golpes_fin - golpes_inicio,
      tiempo_total: timeStamp_fin - timeStamp_inicio,
      tiempo_activa: tiempo_activa,
      tiempo_detenido: tiempo_detenido,
      veces_detenida: veces_detenida,
      veces_activa: veces_activa,
      prom_tiempo_paro: tiempo_detenido / veces_detenida,
      prom_tiempo_activa: tiempo_activa / veces_activa
    };
  };

  abrirArchivo(csvToJson);
  //Publicos
  return {
      getDatos: function(){
        return info;
      },
  };

};
module.exports = Archivo;
