//Express is an external dependency, library
//By using "require" we tell node.js that it has to be pulled into our code because we need it.
const express = require('express')
const body_parser = require('body-parser');

//CORS is Node.js package for providing a Connect/Express middleware
var cors = require('cors');
const app = express()
app.use(cors());
//parse JSON (application/json content-type) with body-parser
app.use(body_parser.json());
const port = 3000

const parseUserData = (data, properNaming) => {
    const dataArray = data.split("");
    const firstNameArray = [];
    const lastNameArray = [];
    const userIdArray = [];
    let firstName = true;
    let lastName = false;
    //creating a second type of data array with "000"
    if (!properNaming) {
      for (let i = 0; i < dataArray.length; i++) {
        if (firstName) {
          firstNameArray.push(dataArray[i]);
          if (dataArray[i] === '0' && dataArray[i+1] !== '0') {
            firstName = false;
            lastName = true;
          }
        } else if (lastName) {
          lastNameArray.push(dataArray[i]);
          if (dataArray[i] === '0' && dataArray[i+1] !== '0') {
            lastName = false;
          }
        } else {
          userIdArray.push(dataArray[i]);
        }
      }
    //creating a second type of data array without "0"
    } else {
      for (let i = 0; i < dataArray.length; i++) {
        //when we get "0"
        if (dataArray[i] === '0') {
          if (dataArray[i] === '0' && dataArray[i+1] !== '0') {
            if (firstName) {
              lastName = true;
              firstName = false;
            } else if (!firstName && lastName) {
              lastName = false;
            }
            continue;
          } else {
            continue;
          }
        }
        if (firstName) {
          firstNameArray.push(dataArray[i]);
        } else if (lastName) {
          lastNameArray.push(dataArray[i]);
        } else {
          if (userIdArray.length === 3) userIdArray.push("-");
          userIdArray.push(dataArray[i]);
        }
      }
    }
    //return an object
    return {
      firstName: firstNameArray.join(''),
      lastName: lastNameArray.join(''),
      clientId: userIdArray.join('')
    };
}

app.get('/', (req, res) => res.json("Welcome! Page without any url is here"))

app.get('/test', (req, res) => res.json("Testing"))

//app.get('/test', (req, res) => res.send('Hello World!'))
app.get('/client-data', (req, res) => res.json(
    [
        {"data": "JOHN0000MICHAEL0009994567"}
    ]))

app.listen(port, () => console.log(`Example, app is listening port ${port}!`))
  
app.post("/api/v1/parse", (req, res) => {
    const item = req.body.data;
    //const item = req.body;
    console.log('Adding a new item: ', item);
    const userData = parseUserData(item);
    // return updated list
    res.json(userData);
});  
  
app.post("/api/v2/parse", (req, res) => {
    const item = req.body.data;
    //const item = req.body;
    console.log('Adding a new item: ', item);
    const userData = parseUserData(item, true);
    res.json(userData);
});