import ClientLogger  from "./clientLogger";
import ClientResourceLoader  from "./ClientResourceLoader";
import { BrowserMessageReader, BrowserMessageWriter } from 'vscode-languageserver/browser';
import { createProtocolConnection } from 'vscode-languageserver-protocol/browser';

function provideCompletionItem (e){

    const textUntilPosition = e.data;
    const data = {
        suggestions: [
            {
                label: "Foobar",
                kind: 25,
                detail: "Details for completion",
                insertText: "Message from webworker"
            }
        ]
    };
   return {id: e.data.id, data: data, success: true};
}

function provideHover (e){

    const textUntilPosition = e.data;
    const data = {
        contents: [
            {
                "value": "This is fine"
            }
        ],
        range: {
            startLineNumber: 3,
            startColumn: 3,
            endLineNumber: 3,
            endColumn: 17
        }
    }
   return {id: e.data.id, data: data, success: true};
}


self.onmessage=function(e) {
  console.log("Worker: Receiving message", e.data);
  let result;
  if(e.data.action === 'provideCompletionItems'){
    result = provideCompletionItem(e)
  }
  if(e.data.action === 'provideHover'){
    result = provideHover(e)
  }
  postMessage(result);
}
