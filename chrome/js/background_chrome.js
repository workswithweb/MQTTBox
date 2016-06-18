chrome.app.runtime.onLaunched.addListener(function(launchData) {
    chrome.app.window.create('index.html', {
        'bounds': {
            'width': Math.round(window.screen.availWidth),
            'height': Math.round(window.screen.availHeight)
        }
    });
});
