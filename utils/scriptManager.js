const path = require('path');
const fs = require('fs');
const scriptFolder = path.join(__dirname, "../assets");
const modulesScriptFolder = path.join(__dirname, "../toopScripts");
const scripts = {};

function getInfo(rawContent) {
  const rawData = rawContent.substring(
    rawContent.indexOf("/**") + 3,
    rawContent.indexOf("**/")
  );
  return JSON.parse(rawData);
}

function getScriptFromData(rawContent) {
  const rawData = rawContent.substring(
    rawContent.indexOf("**/") + 3, rawContent.length);
  return rawData;
}

function modularize(rawContent) {
	return getScriptFromData(rawContent) + 
	`module.exports ={
    main
   }`
}


function loadScripts(){
	let content = fs.readFileSync(path.join(scriptFolder + '/toUpper.js'), "utf8");
	let scriptInfo = getInfo(content);
	let moduleContent = modularize(content)
	scripts[scriptInfo.name] = moduleContent;
	fs.writeFileSync(path.join(modulesScriptFolder, "/toUpper.js"), moduleContent);
}

function executeScript(scriptName, content) {
  let state = { text: content };
  try {
    const tool = require(`${modulesScriptFolder}/${scriptName}.js`);
    tool.main(state);
  } catch (e) {
    if (e.code === "MODULE_NOT_FOUND") {
      state.error = new Error("Script not found " + scriptName);
      return state;
    }
    state.error = e;
    return state;
  }
  return state;
}

module.exports = {
  executeScript,
  loadScripts,
};