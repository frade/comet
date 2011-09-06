var sys = require('sys'),
    http = require('http'),
    url = require('url'),

    clientManager = new function() {
        var clients = [];

        this.registerClient = function(client) {
            clients[clients.length] = client;
            console.log('new client, total: ', clients.length);

        }

        this.broadcastMessage = function(message) {
            var msg = message && message.msg || 'empty';
            console.log('broadcast: ', msg, ' <= ', message);

            for(var i = clients.length; i--;) {
                console.log('client push: ', i);

                var client = clients[i];
                client.writeHeader(200, { 'Content-Type': 'text/plain;charset=utf-8'})
                client.write('msg: ' + msg, 'utf-8')
                client.end();

                clients.length--;
            }

        }

    };


http.createServer(function (req, res) {
    var urlParsed = url.parse(req.url, true);

    console.log('pathname: ', urlParsed.pathname);

    switch(urlParsed.pathname) {

        case '/':
            console.log('index page');
            res.writeHeader(200, {'Content-Type': 'text/plain;charset=utf-8'});
            res.write('Hello, world!', 'utf-8');
            res.end();
            break;

        case '/publish':
            console.log('query: ', urlParsed.query);
            res.writeHeader(200, {'Content-Type': 'text/plain;charset=utf-8'});
            res.write('OK 200, message sent.', 'utf-8');
            res.end();
            clientManager.broadcastMessage(urlParsed.query);
            break;

        case '/subscribe':
            console.log('subscribe new client');
            clientManager.registerClient(res);
            break;

        default:
            console.log('error 404');
            res.writeHeader(404, {'Content-Type': 'text/plain;charset=utf-8'});
            res.write('Error 404, file not found.', 'utf-8');
            res.end();
    }

}).listen(8080);
