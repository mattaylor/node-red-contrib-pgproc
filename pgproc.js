
function Pgproc(config) {
	RED.nodes.createNode(this,conf)
 	this.on('input', msg => { 
	  //let prop = _.mapValues(type.defaults, (v, k) => conf[k] ? rend(conf[k], _.merge({}, msg.meta, msg.payload)) : null)
    console.log('\nmsg:', msg, '\nconf:', conf, '\nprop:', prop)
    if (!dbc) dbc = RED.nodes.getNode(conf.server).connection
	  var sql = `select ${conf.procname}(${conf.function}, ${conf.source}, ${conf.columns}, ${conf.filter}, ${conf.params})`
    console.log('Running SQL:', sql)
    dbc.raw(sql).then(res => node.send({meta: prop, payload: res})).catch(err => node.send({meta: prop, payload: { error: err }}))
  })
	this.on('close', msg => console.log('closing', msg))  
}


RED.nodes.registerType("pgproc",Pgproc)

var util = {
  rand: () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1),
  date: () => new Date().toISOString()
}

var rend = (str = '', opt = {}) => _.isString(str) ? str.replace(/\$[A-Za-z0-9]+/g, key => opt[key.substring(1)] || (util[key] ? util[key]() : key)) : str
 