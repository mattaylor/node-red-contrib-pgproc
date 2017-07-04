
function Pgproc(config) {
	RED.nodes.createNode(this,config)
 	this.on('input', msg => 
	  let prop = _.mapValues(type.defaults, (v, k) => conf[k] ? rend(conf[k], _.merge({}, msg.meta, msg.payload)) : null)
     console.log('\nmsg:', msg, '\nconf:', conf, '\nprop:', prop)
    if (!dbc) dbc = RED.nodes.getNode(conf.server).connection
    runQuery(type.getQuery(prop, type.argKeys), dbc)
    .then(res => node.send({meta: prop, payload: res}))
    .catch(err => node.send({meta: prop, payload: { error: err }}))
	this.on('close', msg => 
}


RED.nodes.registerType("pgproc",Pgproc)

var util = {
  rand: () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1),
  date: () => new Date().toISOString()
}

var rend = (str = '', opt = {}) => _.isString(str) ? str.replace(/\$[A-Za-z0-9]+/g, key => opt[key.substring(1)] || (util[key] ? util[key]() : key)) : str

/*
var getQuery = (prop, argKeys) => { 
  if (prop.query) return ['select ' + prop.query] 
  var args = argKeys.map(a => prop[a] ? JSON.stringify(prop[a]) : 'null')
  var mads = `select madlib.${prop.method}(${args.join(',').replace(/"/g, '\'')}${prop.params})`
  var drop = 'drop table if exists '
  return [ drop + prop.result, drop + prop.result + '_summary', mads ]
}
*/

var query = (sql, dbc, res = []) => {
	select ${node.procname}(${node.function}, ${node.source}, )${node.columns}, ${node.}
  console.log('Running SQL:', sql[0])
  return !sql ? res : dbc.raw(sql.shift()).then(r => {
    res.push(r)
    return sql.length ? runQuery(sql, dbc, res) : res
  })
}

module.exports = function (RED) {
  function generic (type) {
    return function (conf) {
      RED.nodes.createNode(this, conf)
      var dbc = null
      try { dbc = RED.nodes.getNode(conf.server).connection } catch (e) { console.log(e) }
      var node = this
      this.on('input', msg => {
        let prop = _.mapValues(type.defaults, (v, k) => conf[k] ? rend(conf[k], _.merge({}, msg.meta, msg.payload)) : null)
        console.log('\nmsg:', msg, '\nconf:', conf, '\nprop:', prop)
        if (!dbc) dbc = RED.nodes.getNode(conf.server).connection
        runQuery(type.getQuery(prop, type.argKeys), dbc)
        .then(res => node.send({meta: prop, payload: res}))
        .catch(err => node.send({meta: prop, payload: { error: err }}))
      })
    }
  }

 