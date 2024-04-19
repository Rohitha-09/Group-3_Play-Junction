const express = require( 'express' );
const app = express();
const bodyParser=require( 'body-parser' );
const errorLogger = require( './Utilities/ErrorLogger' );
const requestLogger = require('./Utilities/RequestLogger');
const router = require( './routes/routes' );
const create = require( './models/dbSetup' );
const cors = require( 'cors' );
const userRoute = require('./routes/user');
const eventRoute = require('./routes/events');
const eventRatingsRouting = require('./routes/eventrating');
const userRatingsRouting = require('./routes/userrating');
const bookingRouting = require('./routes/booking');


// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const create = require('./create'); // Assuming create module is defined in a separate file
const { requestLogger, errorLogger } = require('./logger'); // Assuming logger module is defined in a separate file

// Initialize express app
const app = express();

// Define middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(requestLogger);

// Define routes
const router = express.Router();

router.get("/setupDB", async (req, res, next) => {
  try {
    const response = await create.setupDB();
    if (response) {
      res.json({ message: `Successfully inserted ${response} documents into the database` });
    }
  } catch (error) {
    next(error);
  }
});

// Use middleware and router
app.use(router);
app.use(errorLogger);

// Set up server
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});

app.use('/v1/user', userRoute);
app.use('/v1/events', eventRoute);

app.use('/v1/event-rating', eventRatingsRouting);
app.use('/v1/user-rating', userRatingsRouting);
app.use('/v1/booking', bookingRouting);


app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
