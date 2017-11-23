// see http://vuejs-templates.github.io/webpack for documentation.

let config = {}

switch (process.env.NODE_ENV) {
  case 'development':
    config = require('./dev.env')
}

export default config
