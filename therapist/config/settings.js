const config = {
    dbUrl: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bewell",
    port: process.env.PORT || 4000,
    jwtSecret: process.env.JWT_SECRET || "ABC123"
};
  
module.exports = { config }