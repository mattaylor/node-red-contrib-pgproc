var knex = require('knex') 

var dbc = knex({client: 'pg', debug: false, connection: { 
  host: '127.0.0.1', user: 'postgres', port: 9700, database: 'postgres'
}})

module.exports = function (RED) {

function Pgproc(conf) {
	RED.nodes.createNode(this,conf)
 	this.on('input', msg => { 
    var node = this
	  let prop = {}
    Object.keys(conf).map(k => prop[k] = rend(conf[k], Object.assign(msg.prev||{}, msg.payload||{})))
    if (!dbc) dbc = RED.nodes.getNode(conf.server).connection
	  var sql = `select ${prop.procname}('${prop.function}', '${prop.source}')`
    //, '${prop.columns}', '${prop.filter}', '${prop.params}')`
    console.log('node:', node, '\nmsg:', msg, '\nconf:', conf, '\nprop:', prop, '\nsql:', sql)
    dbc.raw(sql).then(res => this.send({prev: prop, payload: res})).catch(err => this.send({prev: prop, payload: { error: err }}))
  })
	this.on('close', msg => console.log('closing', msg))  
}

RED.nodes.registerType("pgproc",Pgproc)

var util = {
  rand: () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1),
  date: () => new Date().toISOString()
}

var rend = (str = '', opt = {}) => (str instanceof String) ? str.replace(/\$\{[A-Za-z0-9]/g, key => opt[key.substring(1)] || (util[key] ? util[key]() : key)) : str

}
