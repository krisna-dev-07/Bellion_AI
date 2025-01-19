import dotenv from 'dotenv'
dotenv.config({
    path:'./.env'
})
import http from 'http'
import app from './app.js'
import connectDB from './db/db.js'






const server=http.createServer(app);


connectDB()
    .then(() => {
        server.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port: ${process.env.PORT}`);

        })
    })
    // then is a method that handles the resolved promise. It is executed if the promise returned by connectDB() resolves successfully
    .catch((err) => {
        console.error("MongoDB connect failure:", err.message);
    });