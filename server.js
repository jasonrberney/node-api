
require('dotenv').config({ silent: true });

let express = require('express');
let multer = require('multer');
let upload = multer();
let bodyParser = require('body-parser');
let morgan = require('morgan');
let pg = require('pg');
let cors = require('cors');
const http = require('http');
const azureFileCrud = require('./src/utils/azureFileCrud');
const fileCrudApi = require('./routes/fileCrud');

const {
    Aborter,
    BlockBlobURL,
    ContainerURL,
    ServiceURL,
    SharedKeyCredential,
    StorageURL,
    uploadBrowserDataToBlockBlob,
    uploadStreamToBlockBlob,
    uploadFileToBlockBlob
} = require('@azure/storage-blob');

const fs = require("fs");
let stream = require('stream');
const path = require("path");

const STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const ACCOUNT_ACCESS_KEY = process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY;


console.log(process.env.PGUSER, process.env.PGHOST, process.env.PGDATABASE, process.env.PGPASSWORD, process.env.PGPORT)


//***************************************************API************************************************//
let app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.use(function(request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    next();
})

// Locations
const portland = 'portland';
// Document types
const containerName = 'test';
// Azure file CRUD
const portlandContainerName = azureFileCrud(containerName, portland);

require('./routes/spatialRoutes.js')(app);

fileCrudApi(app, 'portland/test', portlandContainerName);

//app.listen(port, () => console.log('Listening on port ' + port));

const server = http.createServer(app);
const port = process.env.PORT || 3000;

server.listen(port, function () {
    console.log(`Listening on port ${port}`);
});

console.log("Server running at http://localhost:%d", port);
