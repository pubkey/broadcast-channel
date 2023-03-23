const isNode = require('detect-node');

if (!isNode) {
    // if browsers
    console.dir = obj => console.log(JSON.stringify(obj, null, 2));

    const errorBefore = console.error.bind(console);
    console.error = (args) => {
        console.log('console.error(): ' + args);
        errorBefore(args);
    };


}

require('./unit.test');
require('./integration.test');
require('./issues.test');
