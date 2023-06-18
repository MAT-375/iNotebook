const mongoose = require('mongoose');
const mongoURI = "mongodb://127.0.0.1:27017/inotebook?directConnection=true&tls=false&readPreference=primary"


const connectToMongo = async () => {
    await mongoose.connect(mongoURI);
    console.log("connected successfully");
}

module.exports = connectToMongo;