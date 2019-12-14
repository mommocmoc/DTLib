os = require("os");
var hostName = os.networkInterfaces()
console.log(hostName);

// var host = hostName.en0[1].address || '0.0.0.0';
var host = hostName.en1[1].address||hostName.en0[1].address|| '0.0.0.0';

var port = process.env.PORT || 8080;


var cors_proxy = require('cors-anywhere');

cors_proxy.createServer({
    originWhitelist:[],
    requireHeader:['origin','x-requested-with'],
    removeHeader:['cookie','cookie2']
}).listen(port,host,function () {
    console.log(`Running CORS ANYWHERE on ${host}:${port}` );
})