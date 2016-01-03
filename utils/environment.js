'use strict';

const MISSING_SINGLE_VAR = 'The following environment variable must be set: ';
const MISSING_MULTI_VARS = 'One of the following environment varibles must be set: ';

/**
 * Retrieve and cache an environment variable.
 *
 * @example
 * var env = require('environs');
 * var SECRET = env('APP_SESSION_SECRET', { required: true });
 * env( 'NODE_ENV', { alias: 'ENV', default: 'development' });
 * var environment = env.NODE_ENV;
 *
 * @param {Object} config - The environment variable to retrieve and cache.
 * @param {(String|String[])} config.name - The name(s) of the environment variable(s) to look up. Lookup will stop after the first match.
 * @param {String} [config.alias] - The alias name used to retrieve the value. If alias isn't provided, `config.name` will be used.
 * @param {String} [config.default] - Value to use if the provided environment variable name(s) are not specified.
 * @param {Boolean} [config.required=false] - When required, the function will throw if it cannot find an env var or default value.
 *
 * @return {*} The final value for this alias. By default all environment variables are strings, but the caller can change the alias' type via a `config.transform` function.
 */
function env(name, config) {
  const names = Array.isArray( name ) ? name : [name];
  const alias = config.alias || names[0];
  const required = !!config.required || false;
  let value = getNames( names ) || config.default;

  if( required && value === undefined ) {
    let message = names.length == 1 ? MISSING_SINGLE_VAR : MISSING_MULTI_VARS;
    message += names.join(', ');
    throw new Error(message);
  }

  if( typeof config.transform === 'function' ) {
    var fn = config.transform;
    value = fn(value);
  }

  env[alias] = value;
  return env[alias];
}

function getNames(names) {
  for (let name of names) {
    let val = process.env[name];

    // Existant env vars are strings, non-existant ones are `undefined`
    if( typeof val !== 'undefined' ) {
      return val;
    }
  }
}

module.exports = env;
