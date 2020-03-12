const { BlockBlobURL } = require('@azure/storage-blob');
const { azureStorageConnect } = require('../conn/azure/azureStorageConnection');
const { uploadStream } = require('./azureStorage');

module.exports = azureFileCrud;

/** Create functions needed to upload, download, and delete files.
 * @param {string} containerName The Azure BLOB container that contains the files.
 * @param {string} location The name of the location, used to identify relevant files in blob storage.
 */
function azureFileCrud(containerName, location) {
    return {
        download: async (fileName) => {
            try {
                console.log("Download: " + fileName);
                const { containerURL, aborter } = await azureStorageConnect(containerName);
                const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, fileName);
                const downloadResponse = await blockBlobURL.download(aborter, 0);
                return {
                    success: true,
                    result: downloadResponse
                };
            } catch (error) {
                console.log(error.message);
                return {
                    success: false,
                    error: error
                };
            }
        },

        upload: async (file) => {
            try {
                let scheduleMetadata = {
                    date: new Date().toUTCString(),
                    location: location
                };
                const res = await uploadStream(file, containerName, scheduleMetadata);
                return { success: res.success };
            } catch (err) {
                console.log(err.message);
                return { success: false, error: err };
            }
        },

        delete: async (fileName) => {
            try {
                // Get file BLOB
                const { containerURL, aborter } = await azureStorageConnect(containerName);
                const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, fileName);
                // Add deleted = true to metadata and update blob storage
                const properties = await blockBlobURL.getProperties(aborter);
                const metadata = properties.metadata;
                metadata.deleted = 'true';
                await blockBlobURL.setMetadata(aborter, metadata);
                // Announce success
                return {
                    success: true,
                    result: `deleted: ${fileName}`
                };
            } catch (error) {
                console.log(error.message);
                return { success: false, error: error };
            }
        },

        list: async () => {
            const { containerURL, aborter } = await azureStorageConnect(containerName);
            try {
                let response;
                let marker;
                let currentBlockBlobURL;
                let docs = [];
                do {
                    response = await containerURL.listBlobFlatSegment(aborter);
                    marker = response.marker;
                    for (let blob of response.segment.blobItems) {
                        console.log(` - ${blob.name}`);
                        currentBlockBlobURL = BlockBlobURL.fromContainerURL(containerURL, blob.name);
                        const currentBlockBlobURLProps = await currentBlockBlobURL.getProperties(aborter);
                        const metadata = currentBlockBlobURLProps.metadata;
                        docs.push({
                            name: metadata.name,
                            date: currentBlockBlobURLProps.metadata.date
                        });
                    }
                }
                while (marker);
                console.log(docs);
                return { success: true, result: docs };
            } catch (err) {
                console.log(err.message);
                return { success: false, result: docs, error: err };
            }
        }
    };
}