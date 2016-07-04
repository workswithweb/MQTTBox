var dest = './mqttbox',
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
        entries: src + '/app/workers/DbWorker.js',
        dest: dest,
        outputName: 'DbWorker.js'
    },{
        entries: src + '/app/workers/ChromeConnectionWorker.js',
        dest: dest,
        outputName: './js/chromeConnectionWorker.js'
    }],
    extensions: ['.js'],
  }
};
