import multer from 'multer';
import multerS3 from 'multer-s3'
import path from 'path';
//import { nanoid } from 'nanoid'
import aws from "aws-sdk";
import fs  from 'fs';
import { awsConfig } from '../config';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { nanoid } from 'nanoid';

const s3Client = new S3Client({
    region: 'us-east-1',
    credentials:{
       accessKeyId: awsConfig.aws_access_key_id || '',
       secretAccessKey: awsConfig.aws_secret_access_key || ''
   }
 })
 
export const upload = multer({
     storage: multerS3({
         s3: s3Client,
         bucket: awsConfig.bucket_name || '',
         metadata: function (req, file, cb) {
             cb(null, { fieldName: file.fieldname });
         },
         key: function (req, file, cb) {
             cb(null, file.originalname)
         }
     })
 })
 

 export const getPreSignedUrl = async(key: string) => {
    const command = new GetObjectCommand({Bucket: awsConfig.bucket_name, Key: key });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 60 * 60 });
    console.log('Presigned URL: ', url);
    return url;
 }