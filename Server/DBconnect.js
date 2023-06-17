const mongoose = require("mongoose");

module.exports = async () => {
  const mongo_URI =
    "mongodb+srv://Umair_Khan:ROxqj0ciFIUPeTBG@socialmediadatabase.zmgutjx.mongodb.net/?retryWrites=true&w=majority";

  try {
    const connect = await mongoose.connect(mongo_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB connected: ${connect.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1); //Exit from the code if there is no connection.
  }
};
