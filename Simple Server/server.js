const http = require('http');
const fs = require('fs');
const pgsql=require('./pgsql');
const querystring = require('querystring');

const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  const ep=req.url;

  if(ep=="/")
  {
    fs.readFile('index.html', function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
    });
  }
  else if(req.method === 'POST'){
    if(ep=="/thankyou")
    {
      let body = '';

      //everytime it recives data
      req.on('data', function(data) {
        body += data;
      });
  
      //end of reciving data
      req.on('end', function() {
        // Parse the form data
        const formData = querystring.parse(body);
        console.log(formData);
        //send into db
        pgsql.sendQuery(formData['Name'].toString());
        // Send a response
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Form submitted successfully. Thank you '+formData['Name']);
      });
  }
  }else{
    res.statusCode = 404;
    res.end("404 not Found");
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
