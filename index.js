// Require express
const express = require('express');

// Import && Require MongoDB, Dotenv, Cors && ObjectId
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;


// Make App && Port
const app = express();
const port = process.env.PORT || 5000;


// Set MiddleWare
app.use(cors());
app.use(express.json());

/***************************************
 * Connection URI with mongodb dataBase
 * ************************************/
 const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ttpfp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
 const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

/*************************************************************
 * Jerins Parlour Node Server "CURD" Operation Start From Here
 * ***********************************************************/

// CRUD Async Function Start From Here
async function run(){

    try{
        
        // Connect With MongoDB Client Here
        await client.connect();


        // Recognize the database and data collection
        const database = client.db('Jerins_Parlour'); // Database name
        const servicesCollection = database.collection('Services');
        const bookingsCollection = database.collection('Bookings');
        const adminsCollection = database.collection('Admin');

        
        /*******************************
        * All Post Api Here
        * *****************************/

        // Take booking info and set to the db
        app.post('/bookings', async(req, res) => {
            const bookings = req.body;
            const result = await bookingsCollection.insertOne(bookings);
            res.json(result);
            
        }); 
        
        // Take service info and set to the db
        app.post('/services', async(req, res) => {
            const serviceInfo = req.body;
            const result = await servicesCollection.insertOne(serviceInfo);
            res.json(result);
            
        }); 
        
        // Take admins info and set to the db
        app.post('/admins', async(req, res) => {
            const adminsInfo = req.body;
            const result = await adminsCollection.insertOne(adminsInfo);
            console.log(result);
            res.json(result);
            
        }); 



        /*******************************
        * All Get Api Here
        * *****************************/

        // Get the featured services data from the mongodb services collection
        app.get('/featuredServices', async (req, res) => {
            const findService = servicesCollection.find({});
            const services = await findService.limit(6).toArray();
            res.send(services);
        });
     
        // Get the services data from the mongodb services collection
        app.get('/services', async (req, res) => {
            const findService = servicesCollection.find({});
            const services = await findService.toArray();
            res.send(services);
        });


        // Get the booked services data from the mongodb bookings collection
        app.get('/bookedServices', async (req, res) => {
            const findBooking = bookingsCollection.find({});
            const booking = await findBooking.toArray();
            res.send(booking);
        });


        /*******************************
         * All Delete Api
         ******************************/
         app.delete('/bookedServices/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id:ObjectId(id) };
            const result = await bookingsCollection.deleteOne(query);
            res.json(result);
        });

        app.delete('/services/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id:ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        });


    }


    finally{
        // await client.close();
    }
}

// Async Function Call Here
run().catch(console.dir);




/**********************************************************
 * Jerins Parlour Node Server "CURD" Operation Ends To Here
 * ********************************************************/



// Get for checking server is ok or get error
app.get('/', (req, res) => {
       res.send('Jerins Parlour Node Server is Running.');
});

// Test the port is listening the server or get error
app.listen(port, () => {
    console.log('Jerins parlour node server is runningon port', port);
});
