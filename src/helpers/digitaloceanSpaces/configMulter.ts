const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");


const { S3_ENDPOINT, BUCKET_NAME} = process.env;

const spacesEndpoint = new aws.Endpoint(S3_ENDPOINT);

const s3 = new aws.S3({
  endpoint: spacesEndpoint,
  
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: BUCKET_NAME,
    acl: 'public-read',
    key: (request:any, file:any, cb:any) => {
      cb(null, Date.now()+file.originalname);
    },
  }),
});

export { upload, s3 };