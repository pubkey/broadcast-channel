import { chooseMethod as selectMethod } from './method-chooser.js';
// the line below will be removed from es5/browser builds
import * as NodeMethod from './methods/node.js';

export function chooseMethod(options) {
    const chooseMethods = [].concat(options.methods).filter(Boolean);

    // process.browser check allows ES6 builds to be used on server or client. Bundlers like
    // Browserify, Webpack, etc. define process.browser and can then dead code eliminate the unused
    // import. However, we still use sed during build of es5/browser build to remove the import so
    // that it's also removed from non-minified version
    if (!process.browser) {
        // the line below will be removed from es5/browser builds
        chooseMethods.push(NodeMethod);
    }

    options.methods = chooseMethods;

    return selectMethod(options);
}