# react-image-uploader

React Image Uploader + Server Handler (using Hapi 17)

## Starting Demo

First go to `config/default.json` and update the image upload path to where you want your temporary files to be uploaded. Then run the following:

```
git clone git@github.com:timhysniu/react-image-uploader.git
cd react-image-uploader
npm i
npm run server
```

Now that you started the server you want to start the demo react app.

```
cd client
npm i
npm start
```

## Instructions

The client app can be accessible in http://localhost:3000.
If you did `npm start` then this should already be open in your browser.

Server is accessible in http://localhost:3001 and it has two main routes. One is for uploads and one is for deleting uploads. I used Hapi 17, but you can use anything you like.

![React Image Uploader](/client/public/img/screenshot.png?raw=true "React Image Uploader")

## Usage

```
      <ImageUploadMulti name="images" 
          uploadLink="/upload"
          removeLink="/upload"
      />
```

`uploadLink` is the server side URL responsible for uploading image (eg. POST /upload)

`removeLink` is the server side URL responsible for deleting image (eg. DELETE /upload?filename=xyz.jpg)

### Why server?

Most image uploader components don't *need* a server. However, most libraries I've seen so far either cover client side or server side but not both. The reality is that for an app you usually need both.

Server is responsible for receiving  all asynchronously uploaded photos and storing them in a staging directory on the server. As user is uploading and removing photos, they are also synced to server. Once photo selection is done you are done!

This is why server needs two routes, one for uploading photos and one for downloading photos.

After you're done you may want to do further processing, move them to CDN or whatever you wish. You can leave them in staging directory but I don't recommend this. This is just a temp location in server and you should clean this after.

#### Security Note

One of the routes is responsible for removing photos from staging directory in server as user is removing photos. Be sure that you have permissions set correctly to disallow removing files outside of your staging directory. 

If you dont want to allow removing photos then just don't provide `removeLink` as a prop. In this case you will want to have some kind of job to clean up staging directory from time to time.

```
      <ImageUploadMulti name="images" 
          uploadLink="/upload"
      />
```
