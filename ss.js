var url = require('url');
var fs = require('fs');
var http = require('http');
var path = require('path');

http.createServer((req, res) => {
	var pathname = __dirname + '/dist' + url.parse(req.url).pathname;
	if (path.extname(pathname) == '') {
		pathname += '/';
	}
	if (pathname.charAt(pathname.length - 1) == '/') {
		pathname += 'index.html';
	}
	fs.exists(pathname, (exists) => {
		if (exists) {
			switch (path.extname(pathname)) {
				case ".html":
					res.writeHead(200, {"Content-Type": "text/html"});
					break;
				case ".js":
					res.writeHead(200, {"Content-Type": "text/javascript"});
					break;
				case ".css":
					res.writeHead(200, {"Content-Type": "text/css"});
					break;
				case ".gif":
					res.writeHead(200, {"Content-Type": "image/gif"});
					break;
				case ".jpg":
					res.writeHead(200, {"Content-Type": "image/jpeg"});
					break;
				case ".png":
					res.writeHead(200, {"Content-Type": "image/png"});
					break;
				default:
					res.writeHead(200, {"Content-Type": "application/octet-stream"});
			}
			fs.readFile(pathname, function (err, data) {
				res.end(data);
			});
		} else {
			res.writeHead(404, {"Content-Type": "text/html"});
			res.end("<h1>404 Not Found</h1>");
		}
	});
}).listen(4666);
console.log('localhost:4666');