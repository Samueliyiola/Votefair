import { config } from "dotenv";

config();

config({path: `.env.${process.env.NODE_ENV || 'development'}.local`});

const requireEnv = (key: string) : string => {
    const value = process.env[key];
    if(!value){
        return "Missing environment variable: " + key;
    }
    return value;
}

export const env = {
    PORT: requireEnv("PORT"),
    DATABASE_HOST: requireEnv("DATABASE_HOST"),
    DATABASE_PORT: requireEnv("DATABASE_PORT"),
    DATABASE_NAME: requireEnv("DATABASE_NAME"),
    DATABASE_USER: requireEnv("DATABASE_USER"),
    DATABASE_PASSWORD: requireEnv("DATABASE_PASSWORD"),
    JWT_SECRET: requireEnv("JWT_SECRET"),
    EMAIL_FROM: requireEnv("EMAIL_FROM"),
    EMAIL_HOST: requireEnv("EMAIL_HOST"),
    EMAIL_PORT: requireEnv("EMAIL_PORT"),
    EMAIL_USER: requireEnv("EMAIL_USER"),
    EMAIL_PASS: requireEnv("EMAIL_PASS"),
    APP_URL: requireEnv("APP_URL"),
}