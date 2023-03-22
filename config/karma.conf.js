const configuration = {
    basePath: '',
    frameworks: [
        'mocha',
        'browserify',
        'detectBrowsers'
    ],
    files: [
        '../test/index.test.js'
    ],
    // reporters: ['progress'],
    port: 9876,
    colors: true,
    autoWatch: false,

    /**
     * see
     * @link https://github.com/litixsoft/karma-detect-browsers
     */
    detectBrowsers: {
        enabled: true,
        usePhantomJS: false,
        postDetection: function (availableBrowser) {
            // return ['Chrome']; // comment in to test specific browser
            // return ['Firefox']; // comment in to test specific browser
            console.log('availableBrowser:');
            console.dir(availableBrowser);
            const browsers = availableBrowser
                .filter(b => !['PhantomJS', 'FirefoxAurora', 'FirefoxNightly'].includes(b));
            return browsers;
        }
    },

    // Karma plugins loaded
    plugins: [
        'karma-mocha',
        'karma-browserify',
        'karma-chrome-launcher',
        'karma-edge-launcher',
        'karma-firefox-launcher',
        'karma-ie-launcher',
        'karma-opera-launcher',
        'karma-safari-launcher',
        'karma-detect-browsers',
        'karma-env-preprocessor'
    ],

    // Source files that you wanna generate coverage for.
    // Do not include tests or libraries (these files will be instrumented by Istanbul)
    preprocessors: {
        '../test/*.test.js': ['browserify', 'env']
    },

    envPreprocessor: [
        'GITHUB_ACTIONS',
    ],
    client: {
        mocha: {
            bail: true,
            timeout: 12000
        },
        captureConsole: true
    },
    //    browsers: ['ChromeNoSandbox'],
    browserDisconnectTimeout: 24000,
    processKillTimeout: 24000,
    customLaunchers: {
        Chrome_travis_ci: {
            base: 'ChromeHeadless',
            flags: ['--no-sandbox']
        }
    },
    singleRun: true,
    concurrency: 1
};

module.exports = function (config) {
    config.set(configuration);
};
