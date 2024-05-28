const http = require('http');

const fs = require('fs');

const server = http.createServer((request, response) => {
    let fileName = 'index.html';
    let contentType = 'text/html';

    if(request.url == '/styles.css') {
        fileName = 'styles.css';
        contentType = 'text/css';
    }

    fs.readFile(fileName, function (err, content) {
        if(err) {
            response.statusCode = 500;
            response.end("Could not serve index.html");
        }
        else {
            response.statusCode = 200;
            response.setHeader('Content-Type', contentType);
            response.end(content);
        }
    });
});


server.listen({ port: 3000, host: 'localhost' }, () => {
    console.log('127.0.0.1:3000');
    console.log('server is running');
});
