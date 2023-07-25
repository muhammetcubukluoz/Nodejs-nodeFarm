const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

//////////////////
// Files

// //Blocing code (syn)-> blocking
// const textInput=fs.readFileSync("./txt/input.txt","utf-8");
// console.log(textInput);

// const textOut= `This is what we know about the avacado: ${textInput} \n Created on: ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt",textOut);

// console.log("written...");

// //non-Blocing code (asyn)-> blocking

// fs.readFile("./txt/starts.txt","utf-8", (err,data)=>{
//     //if(err) return console.log("ERRORR");
//     fs.readFile(`./txt/${data}.txt`,"utf-8", (err,data2)=>{
//         console.log(data2);
//         fs.readFile("./txt/append.txt","utf-8", (err,data3)=>{
//             console.log(data3);

//             fs.writeFile("./txt/final.txt",`${data2}\n${data3}`,"utf-8", err =>{
//                 console.log("your file has been written...");
//             });
//         });
//     }) ;
// }) ;

// console.log("will read file...");

//

//////////////////
// SERVER
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

//console.log(slugify('Fresh Avocados',{lower:true}));

const server = http.createServer((req, res) => {
  //console.log(req.url);
  //console.log(url.parse(req.url));
  //const pathName=req.url;

  const { query, pathname } = url.parse(req.url, true);

  //Overview Page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);

    //Product Name
  } else if (pathname === '/product') {
    //console.log(query);

    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    //API
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });

    res.end(data);

    //NOT FOUND
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-word',
    });
    res.end('<h1>Page not found...</h1>');
  }
});

server.listen(8000, '127.0.0.2', () => {
  console.log('Listenning to request on port 8000');
});
