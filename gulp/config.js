var dest = './build',
  src = './src',
  mui = './node_modules/material-ui/src';

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
        entries: src + '/app/workers/MqttClientDbWorker.js',
        dest: dest,
        outputName: 'workers/MqttClientDbWorker.js'
    },{
        entries: src + '/app/electron/ElectronMain.js',
        dest: dest,
        outputName: 'ElectronMain.js'
    },{
        entries: src + '/app/workers/MqttClientConnectionWorker.js',
        dest: dest,
        outputName: 'workers/MqttClientConnectionWorker.js'
    }],
    extensions: ['.js'],
  }
};
