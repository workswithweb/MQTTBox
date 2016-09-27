var dest = './build',
  src = './src';

module.exports = {
  browserSync: {
    server: {
      // We're serving the src folder as well
      // for sass sourcemap linking
      baseDir: [dest, src]
    },
    files: [
      dest + '/**'
    ]
  },
  markup: {
    src: src + "/www/**",
    dest: dest
  },
  browserify: {
    // Enable source maps
    debug: true,
    // A separate bundle will be generated for each
    // bundle config in the list below
    bundleConfigs: [{
      entries: src + '/app/app.js',
      dest: dest,
      outputName: 'app.js'
    },{
        entries: src + '/app/platform/background_chrome.js',
        dest: dest,
        outputName: 'platform/background_chrome.js'
    },{
        entries: src + '/app/platform/PlatformMqttClientService.js',
        dest: dest,
        outputName: 'platform/PlatformMqttClientService.js'
    },{
        entries: src + '/app/platform/PlatformMqttLoadService.js',
        dest: dest,
        outputName: 'platform/PlatformMqttLoadService.js'
    }],
    extensions: ['.js'],
  }
};
