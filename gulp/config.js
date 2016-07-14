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
    debug: false,
    // A separate bundle will be generated for each
    // bundle config in the list below
    bundleConfigs: [{
      entries: src + '/app/app.js',
      dest: dest,
      outputName: 'app.js'
    },{
        entries: src + '/app/workers/BrokerSettingsDbWorker.js',
        dest: dest,
        outputName: './js/BrokerSettingsDbWorker.js'
    },{
        entries: src + '/app/workers/ConnectionWorker.js',
        dest: dest,
        outputName: './js/ConnectionWorker.js'
    },{
        entries: src + '/app/workers/MqttLoadSettingsDbWorker.js',
        dest: dest,
        outputName: './js/MqttLoadSettingsDbWorker.js'
    },{
        entries: src + '/app/workers/MqttLoadResultsDbWorker.js',
        dest: dest,
        outputName: './js/MqttLoadResultsDbWorker.js'
    },{
        entries: src + '/app/workers/MqttLoadTestWorker.js',
        dest: dest,
        outputName: './js/MqttLoadTestWorker.js'
    }],
    extensions: ['.js'],
  }
};
