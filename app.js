
require('monaco-editor');
(self).MonacoEnvironment = {
    getWorkerUrl: () => './editor.worker.bundle.js'
}
require('./scripts/client');