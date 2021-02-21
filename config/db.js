const mongoose = require('mongoose');

mongoose
    .connect('mongodb+srv://'+process.env.DB_USER_PASS+'@project-mern.hiiw4.mongodb.net/mern-project',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        }
    )
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("failed to connect to mongoDB", err));