import AppConstants from './AppConstants';

class CommonUtils {}


CommonUtils.getUrlQueryParameter = function(searchString,name) {
    var parts = searchString.substring(1).split('&');
    var params = {};
    for (var i = 0; i < parts.length; i++) {
        var nv = parts[i].split('=');
        if (!nv[0]) continue;
        params[nv[0]] = nv[1];
    }
    return params[name];
};

CommonUtils.openWindow = function(url) {
    if(AppConstants.isChromeApp()) {
        chrome.app.window.create(url, {
            outerBounds: {
                width: Math.round(window.screen.availWidth -(window.screen.availWidth/70)),
                height: Math.round(window.screen.availHeight-(window.screen.availHeight/70))
            }
        });
    } else {
        window.open(url,'_blank');
    }
};

export default CommonUtils;