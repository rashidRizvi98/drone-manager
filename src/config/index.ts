export const port = process.env.PORT;

export const dbConfig = {
    username: "postgres",
    password: "password",
    port: 5432,
    host: "localhost",
    name: "drone-manager"
  };

  export const awsConfig = {
    aws_access_key_id : process.env.AWS_ACCESS_KEY_ID,
    aws_secret_access_key : process.env.AWS_SECRET_ACCESS_KEY,
    bucket_name: process.env.BUCKET_NAME
  }