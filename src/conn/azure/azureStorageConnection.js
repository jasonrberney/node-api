
const { Aborter, ContainerURL, ServiceURL,
    SharedKeyCredential, StorageURL } = require('@azure/storage-blob');

require('dotenv').config({ silent: true });

const ONE_MEGABYTE = 1024 * 1024;
const FOUR_MEGABYTES = 4 * ONE_MEGABYTE;
const ONE_MINUTE = 60 * 1000;

azureStorageConnect = async (containerName) => {
    const STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const ACCOUNT_ACCESS_KEY = process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY;
    console.log(STORAGE_ACCOUNT_NAME, ACCOUNT_ACCESS_KEY);

    const credentials = new SharedKeyCredential(STORAGE_ACCOUNT_NAME, ACCOUNT_ACCESS_KEY);
    const pipeline = StorageURL.newPipeline(credentials);
    const serviceURL = new ServiceURL(`https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`, pipeline);
    const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
    const aborter = Aborter.timeout(30 * ONE_MINUTE);

    return { containerURL: containerURL, aborter: aborter};
}

module.exports = { azureStorageConnect };