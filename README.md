# An Image Repository
### For the Shopify Dev Infra/SRE/Backend Challenge

Application Hosted here for use:


This application consists of two parts. The server (ImgRepository) and a rudimentary client (img-frontend) to demo the capabilities of the server.

The entire application is written in TypeScript. The server is written in Node and the client in React.

The application is built is on top of GCP. Namely,
- The backend and frontend are both deployed on individual domains on the GCP App Engine. 
- I use GCP Cloud Storage Buckets to store the photos, and 
- Cloud Firestore to store references to them. 
- I used the GCP Vision API to tag them for objects, which are then used for searching.

## Features

- A user is able to **SEARCH** and **ADD** images to the repository.

**ADDING**

- Bulk Uploading for an enormous amount of images
- Public and Private storage (a user can upload an image privately and receive a key for it)
- File type validation for images to prevent malicious files
- File size validation to prevent attacks from files that are too large
- Files are immediately tagged upon upload

**SEARCHING**

- Search Private and Public Images Seperately
- Search by tags created on the image

## Getting Started Locally

### Server

Very started to any other relevant Node.JS or Typescript application. When first pulling the repository, ensure you have created a GCP Project and an equivalent service account file. Also, ensure that you have enabled Native Cloud Firestore and Cloud Storage. Then, create a .env file and format it like this:

```
PROJECT_ID=
KEYFILE_NAME=
```

The `PROJECT_ID` is the Id of the project you created and the `KEYFILE_NAME` is the path to the service account file. Replace them with yours.

Then,

```
npm install
npm start
```

To deploy,

```
gcloud app deploy
```

### Client

The client was created using `create-react-app`. Run `npm install` to install all dependencies.

Before starting the app, you need to specify what the Server Url is. This can be done by changing the `baseApiUrl` variable in `src/shared/constants.ts`. 

### Potential Future Developments

This application is pretty rudimentary but it was an interesting and enjoyable exercise. It could be developed by adding:

- Proper authentication (either user accounts or anonymous authentication)
- Ability to delete photos
- Better searching that is not only tag based on objects in the image
- Clean up frontend styling to make it more user intuitive (though a bit outside the scope of a backend challenge)









