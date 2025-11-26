require('ts-node').register({ transpileOnly: true });

exports.config = {
  runner: 'local',
  framework: 'mocha',
  specs: ['./mobile/tests/**/*.ts'],
  maxInstances: 1,
  logLevel: 'info',

  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': 'Android Emulator',
      'appium:platformVersion': '13',
      'appium:app': process.env.ANDROID_APP_PATH || '/path/to/WeMine.apk',
      'appium:autoGrantPermissions': true
    }
  ],

  services: [['appium', { args: { relaxedSecurity: true } }]],
  reporters: ['spec', ['allure', { outputDir: 'reports/allure-mobile' }]],

  mochaOpts: {
    ui: 'bdd',
    timeout: 120000
  }
};