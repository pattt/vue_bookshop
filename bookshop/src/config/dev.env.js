var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  api_url: 'http://autoshop.local:8081/api/'
})
