import dotenv from "dotenv";

dotenv.config();    

const config = {
    PORT: process.env.PORT || 5000,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_FRONTEND_API_KEY: process.env.CLERK_FRONTEND_API_KEY,
    CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
    INGEST_SIGNING_KEY: process.env.INGEST_SIGNING_KEY,
    COULDNARY_API_KEY: process.env.COULDNARY_API_KEY,
    COULDNARY_API_SECRET: process.env.COULDNARY_API_SECRET,
    COULDNARY_CLOUD_NAME: process.env.COULDNARY_CLOUD_NAME,
};   

export default config;  