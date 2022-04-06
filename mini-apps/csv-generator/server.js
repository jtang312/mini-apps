// The server must flatten the JSON hierarchy, mapping each item/object in the JSON to a single line of CSV report 
// (see included sample output), where the keys of the JSON objects will be the columns of the CSV report.

// You may assume the JSON data has a regular structure and hierarchy (see included sample file). 
// In other words, all sibling records at a particular level of the hierarchy will have the same set of properties, but child objects might not contain the same properties. 
// In all cases, every property you encounter must be present in the final CSV output.

// You may also assume that child records in the JSON will always be in a property called `children`.

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const Promise = require('bluebird');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
})
const upload = multer({storage: storage});
// const upload = multer({dest: 'uploads'});

const app = express();
const port = 3000;

// middleware
// Serve the client files
app.use(express.static('client'));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // to support URL-encoded bodies

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

let generateCSV = (jsonData, headers) => {
  let result = [];
  for (let key in jsonData) {
    if (key === 'children') {
      for (let i = 0; i < jsonData[key].length; i++) {
        result = result + '\n';
        result += generateCSV(jsonData.children[i], headers)[0];
      }
    } else {
      headers[key] = key;
      result.push(jsonData[key]);
    }
  }
  return [result, headers];
}

let generateCSVAsync = (jsonData, headers) => {
  let result = [];
  for (let key in jsonData) {
    if (key === 'children') {
      for (let i = 0; i < jsonData[key].length; i++) {
        result = result + '\n';
        result += generateCSV(jsonData.children[i], headers)[0];
      }
    } else {
      headers[key] = key;
      result.push(jsonData[key]);
    }
  }
  return new Promise((resolve, reject) => {
    resolve([result, headers])
  });
}

app.post('/', (req, res) => {
  let data = JSON.parse(req.body.fileData);
  console.log(data);
  // fs.readFile('uploads/' + req.file.filename, (err, data) => {
  //   data = JSON.parse(data.toString());
  //   console.log('hi there', data);
  //   let [rows, headers] = generateCSV(data, []);
  //   let result = Object.keys(headers).join() + '<br>' + rows.join();
  
  //   console.log(result);
  //   res.send(`<form action="/" method="post">
  //     <label for="textarea">JSON data</label>
  //     <input type="file" id="data" name="jsonData"><br><br>
  //     <input type="submit" value="Submit">
  //   </form><br><p>${result}</p>`);
  // })

  // let readFileAsync = Promise.promisify(fs.readFile);
  // readFileAsync('uploads/' + JSONData)
  // .then((data) => {
  //   data = JSON.parse(data.toString());
  //   return generateCSVAsync(data, []);
  // })
  // .then(([rows, headers]) => {
  //   let result = Object.keys(headers).map(header => header.toUpperCase()).join() + '<br>' + rows.join();
  //   res.send(`<form action="/" method="post">
  //     <label for="textarea">JSON data</label>
  //     <input type="file" id="data" name="jsonData"><br><br>
  //     <input type="submit" value="Submit">
  //   </form><br><p>${result}</p>`);
  // })
  // .catch((err) => res.send(err));

  let [rows, headers] = generateCSV(data, []);
  let result = Object.keys(headers).map(header => header.toUpperCase()).join() + '\n' + rows;
  fs.writeFile('convertedCSV.csv', result, (err) => {
    if (err) {
      res.sendStatus(404);
    }
    console.log('writeFile sucess');
  })
  res.end();
});

app.get('/download_csv', (req, res) => {
  res.download('convertedCSV.csv');
})