export interface DatabaseConfig {
  host: string;
  port: number;
}

export default () => ({
  saludo: process.env.SALUDO,
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: process.env.NODE_ENV === 'dev',
  },
  jwtSecret: process.env.JWT_SECRET,
});
