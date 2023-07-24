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


function getFilesInFolder(folderPath) {
  const filesArray = [];
  const queue = [folderPath];

  while (queue.length > 0) {
    const currentPath = queue.shift();
    const files = fs.readdirSync(currentPath);

    files.forEach(file => {
      const filePath = path.join(currentPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isFile()) {
        filesArray.push(file);
      } else if (stat.isDirectory()) {
        queue.push(filePath);
      }
    });
  }

  return filesArray;
}

function loadScripts(){
  let files = getFilesInFolder(path.join(scriptFolder));

  files.forEach((fileInfo)=> {
    loadScript(fileInfo);
  });
}

function loadScript(name){
	let content = fs.readFileSync(path.join(scriptFolder +  "/" +  name), "utf8");
  let scriptInfo = getInfo(content);
	let moduleContent = modularize(content)
	scripts[scriptInfo.name] = moduleContent;
	fs.writeFileSync(path.join(modulesScriptFolder +  "/" +  name), moduleContent);
}

function executeScript(scriptName, content) {
  let state = { text: content, error: { message: ""}};
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