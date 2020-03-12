const multer = require('multer');
const upload = multer();

module.exports = configureApi;

/** Configure an API for uploading, downloading, and deleting files.
 * @param {*} app The app to configure.
 * @param {string} apiLocation The name of the location to use for the HTTP API.
 * @param {string} fileCrud File CRUD operations to use in the API.
 */
function configureApi(app, apiLocation, fileCrud) {
    app.post(`/api/${apiLocation}/upload`, upload.any(), async (request, response) => {
        const { success, result, error } = await fileCrud.upload(request.files);
        if (success) return response.status(200).send({ success: success });
        response.status(500).send({ error: error });
    });
    app.post(`/api/${apiLocation}/delete`, async (request, response) => {
        const { success, result, error } = await fileCrud.delete(request.body.fileName);
        if (success) return response.status(200).send(result);
        response.status(500).send({ error: error });
    });
    app.get(`/api/${apiLocation}/files`, async (request, response) => {
        const { success, result, error } = await fileCrud.list();
        if (success) return response.status(200).send(result);
        response.status(500).send({ error: error });
    });
    app.post(`/api/${apiLocation}/download`, async (request, response) => {
        const { success, result, error } = await fileCrud.download(request.body.fileName);
        if (success) {
            response.setHeader("Content-Type", "application/pdf");
            result.readableStreamBody.pipe(response);
            result.readableStreamBody.on('end', response.end.bind(response));
            return;
        }
        response.status(500).send({ error: error });
    });
}
