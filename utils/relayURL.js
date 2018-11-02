import { apiPHP } from './config';

function relayURL(url) {
  return `${apiPHP}/relay?url=${encodeURIComponent(url)}`;
}

module.exports = relayURL;
