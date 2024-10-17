import express from 'express'
import helmet from 'helmet';

const app = express();

app.use(express.json())

//Helper to send http headers appropiately
app.use(helmet())

//Reduces fingerprinting
app.disable("x-powered by")


export default app