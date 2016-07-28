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

export default CommonUtils;