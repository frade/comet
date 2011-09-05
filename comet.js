sys = require('sys'),
http = require('http');
url = require('url')
 
clientManager = new function() {
    var clients = []
 
    this.registerClient = function(client) {
      clients.push(client)
    }
 
    this.broadcastMessage = function(message) {
      for(var i=0; i<clients.length; i++) {
        var client = clients[i]
        client.writeHeader(200, {'Content-Type': 'text/plain;charset=utf-8'})
        client.write("mes:"+message.message.toString(), 'utf-8')
        client.end()
      }
      clients = []
    }
}
 
http.createServer(function (req, res) {
  var urlParsed = url.parse(req.url, true)
 
  if (urlParsed.pathname == '/publish') {
    clientManager.broadcastMessage(urlParsed.query)
    res.writeHeader(200, {'Content-Type': 'text/plain;charset=utf-8'})
    res.write('ok', 'utf-8')
    res.end()
  }
 
  if (urlParsed.pathname == '/subscribe') {
    clientManager.registerClient(res)
  }
 
}).listen(8000);
