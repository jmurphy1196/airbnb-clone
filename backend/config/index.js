module.exports = {
  environment: process.env.NODE_ENV || "development",
  port: process.env.PORT || 8000,
  dbFile: process.env.DB_FILE,
  dbFileTest: process.env.DB_FILE_TEST,
  jwtConfig: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  here: {
    apiKey: process.env.API_KEY,
    appId: process.env.APP_ID,
  },
  s3: {
    accessKey: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
};
