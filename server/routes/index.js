"use strict"

const uuid = require('node-uuid');
const config = require('config');
const Joi = require('joi');
const Uploader = require('../lib/uploader');

const Routes = (server) => {

    server.route({
        method: 'POST',
        path: '/upload',
        config: {
            payload: {
                parse: true,
                maxBytes: 50000000,
                output: 'file',
            }
        },
        handler: async function(request, h) {
            try {
                const uploadOpts = { dest: config.imageTmpPath };
                const data = request.payload;
                const newFilename = await Uploader.handleUpload(data.images, uploadOpts);
                const response = h.response({newFilename, id: data.id});

                return response;
            } catch (err) {
                console.log(err);
            }
        }
    });

    server.route({
        method: 'DELETE',
        path: '/upload',
        handler: async function(request, h) {
            try {
                const fullPath = [config.imageTmpPath, request.query.filename].join('/');
                Uploader.handleDelete(fullPath);
                return {fullPath, removed: true};
            } catch (err) {
                console.log(err);
            }
        }       
    });
}

module.exports = Routes;
