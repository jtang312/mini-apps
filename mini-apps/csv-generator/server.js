// The server must flatten the JSON hierarchy, mapping each item/object in the JSON to a single line of CSV report 
// (see included sample output), where the keys of the JSON objects will be the columns of the CSV report.

// You may assume the JSON data has a regular structure and hierarchy (see included sample file). 
// In other words, all sibling records at a particular level of the hierarchy will have the same set of properties, but child objects might not contain the same properties. 
// In all cases, every property you encounter must be present in the final CSV output.

// You may also assume that child records in the JSON will always be in a property called `children`.

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// middleware
// Serve the client files
app.use(express.static('client'));
// app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // to support URL-encoded bodies

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

let generateCSV = (json, headers) => {
  let result = [];
  for (let key in json) {
    if (key === 'children') {
      for (let i = 0; i < json[key].length; i++) {
        result[result.length - 1] += '<br>';
        result = result.concat(generateCSV(json.children[i], headers)[0]);
      }
    } else {
      headers[key] = key;
      result.push(json[key]);
    }
  }
  return [result, headers];
}

app.post('/generateCSV', (req, res) => {
  let len = req.body.jsonData.length;
  if (req.body.jsonData[len - 1] === ';') {
    req.body.jsonData = req.body.jsonData.slice(0, len - 1);
  }
  let data = JSON.parse(req.body.jsonData);
  // console.log(data, typeof data);
  let [rows, headers] = generateCSV(data, [])
  let result = Object.keys(headers).join() + '<br>' + rows.join();
  
  console.log(result);
  res.send(`<form action="/generateCSV" method="post">
  <label for="textarea">JSON data</label>
  <textarea rows="10" cols="100" id="data" name="jsonData"></textarea><br><br>
  <input type="submit" value="Submit">
</form><br><p>${result}</p>`);
})