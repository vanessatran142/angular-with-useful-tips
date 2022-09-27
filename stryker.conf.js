module.exports = {
    mutate: ['/app/src/app.component.spec.ts'],
    testRunner: 'jest',
    jest: {
        projectType: 'custom',
        config: require('./jest.config'),
        enableFindRelatedTests: true
    },
    timeoutMS: 5000,
    dryRunTimeoutMinutes: 30,
    reporters: ['progress', 'clear-text', 'html'],
    maxConcurrentTestRunners: 4,
    coverageAnalysis: 'off',
    allowConsoleColors: true
}
