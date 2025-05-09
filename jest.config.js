module.exports = {
    verbose: true,
    // globalTeardown: "./tests/teardown.js",
    reporters: [
        'default',
        ['github-actions', {silent: false}], 
        'summary',
        ['jest-junit', { suiteName: "Edge.js integrations tests" }]
        // ["jest-html-reporters", {
        //     publicPath: './tests/report',
        //     filename: 'report.html',
        //     darkTheme: true,
        //     pageTitle: 'edge-integrations',
        //     expand: true,
        //     urlForTestFiles: 'https://github.com/agracio/edge-integrations/blob/main'
        //   }
        // ]
    ],
    // "collectCoverageFrom": [
    //     "src/**/*.js"
    // ],
}