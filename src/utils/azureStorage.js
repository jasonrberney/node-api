const { azureStorageConnect } = require('../conn/azure/azureStorageConnection');
const {
    BlockBlobURL,
    uploadStreamToBlockBlob,
} = require('@azure/storage-blob');
let stream = require('stream');

const ONE_MEGABYTE = 1024 * 1024;
const FOUR_MEGABYTES = 4 * ONE_MEGABYTE;
const FIFTY_MEGABYTES = 50 * ONE_MEGABYTE;
const ONE_MINUTE = 60 * 1000;

getBlobNames = async (container) => {
    try {
        const { containerURL, aborter }  = await azureStorageConnect(container);

        let response;
        let marker;
        let blobNames = [];

        do {
            response = await containerURL.listBlobFlatSegment(aborter);
            marker = response.marker;
            //console.log(marker);
            for(let blob of response.segment.blobItems) {
                //console.log(` - ${ blob.name }`);
                blobNames.push(blob.name);
            }
        } while (marker);

        return blobNames;
    } catch (err) {
        console.log(err.message);
        return blobNames;
    }
}

getPlanBlobs = async (container, measureOrPlan, measureName, planName) => {
    console.log(container, measureOrPlan, measureName, planName);

    const { containerURL, aborter }  = await azureStorageConnect(container);

    let docs = [];

    try {  
        let response;
        let marker;
        let currentBlockBlobURL;

        do {
            response = await containerURL.listBlobFlatSegment(aborter);

            marker = response.marker;

            for(let blob of response.segment.blobItems) {
                //console.log(` - ${ blob.name }`);
                currentBlockBlobURL = BlockBlobURL.fromContainerURL(containerURL, blob.name);
                const currentBlockBlobURLProps = await currentBlockBlobURL.getProperties(aborter);
            }
        } while (marker);

        return docs;
    } catch (err) {
        console.log(err.message);
        return docs;
    }
}

uploadStream = async (file, container, uploadMetadata) => {
    try {  
        const { containerURL, aborter }  = await azureStorageConnect(container);

        console.log("uploading: " + file[0].originalname);
        let blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, file[0].originalname);
        const uploadOptions = {
            bufferSize: FIFTY_MEGABYTES,
            maxBuffers: 5,
        };

        // Initiate the source
        let bufferStream = new stream.PassThrough();
        // Write your buffer
        bufferStream.end(file[0].buffer);

        await uploadStreamToBlockBlob(
            aborter, 
            bufferStream, 
            blockBlobURL,
            uploadOptions.bufferSize, 
            uploadOptions.maxBuffers
        );

        blockBlobURL.setMetadata(aborter, uploadMetadata);

        console.log("success uploading ArrayBuffer");
        
        return {success: true};

    } catch (err) {
        console.log(err.message);
        return {success: false, err: err};
    }
}

deleteAzureBlob = async (fileName, container) => {
    try { 
        const { containerURL, aborter }  = await azureStorageConnect(container);
  
        console.log("Delete: " + fileName)

        let blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, fileName);

        await blockBlobURL.delete(aborter)

        return {success: true};

    } catch (err) {
        console.log(err.message);
        return {success: false, err: err};
    }
}

module.exports = { 
    getBlobNames, 
    getPlanBlobs,
    uploadStream,
    deleteAzureBlob
};