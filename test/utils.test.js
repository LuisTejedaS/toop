const { expect } = require('chai');
const { loadScripts } = require('../utils/scriptManager');

describe('getProtocolAndHost method', function() {
  const simpleScript = `/**
  {
      "api":1,
      "name":"JS Object to JSON",
      "description":"Converts a javascript object to a formatted JSON",
      "author":"luisfontes19",
      "icon":"broom",
      "tags":"json,js,prettify,convert",
      "bias": -0.1
  }
**/

function main(state) {
  const data = state.text;
  state.text = data.toUpperCase();
}
`
  it('should return the correct host and protocol from a url', function() {
    const url = loadScripts(simpleScript); 
  });

});