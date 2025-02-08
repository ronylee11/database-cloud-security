const express = require('express');
const cors = require('cors');
const passport = require("passport")
const { strategy } = require("./utils/passport")

require("dotenv").config()

const indexRouter = require("./routes/index.routes");
const { errorConverter, errorHandler } = require('./utils/error');

const app = express();
// const port = process.env.PORT || 3005;
const port = 3005

app.use(express.json())
app.use(passport.initialize());
passport.use(strategy)
app.use(cors({
    origin:[
      `${process.env.CLOUDFRONT_URL || null}`,
      'http://localhost:80'
    ]

  }));
app.use("/api", indexRouter)

app.get('/health', (req, res) => {
  return res.json({ status: 'UP' });
});

// Error handlers so that the app doesnt crash everytime an error gets thrown
app.use(errorConverter)
app.use(errorHandler)


// change to ip address of elastic load balancer EC2 auto-scaler link later
app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});
