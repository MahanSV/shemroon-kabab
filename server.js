// server.js

const express = require('express'); 
const { MongoClient } = require('mongodb'); 
const path = require('path'); 

const uri = 'mongodb://localhost:27017/shop';
const client = new MongoClient(uri);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to the database successfully');
    } catch (error) {
        console.error('Failed to connect to the database', error);
        process.exit(1);
    }
}

connectToDatabase();

const app = express();
app.use(express.json());
app.use(express.static('views')); 

app.get('/products', async (req, res) => {
    const page = parseInt(req.query.page) || 1; // صفحه فعلی
    const limit = 5; // حداکثر تعداد محصولات در هر صفحه
    const skip = (page - 1) * limit; // تعداد محصولاتی که باید نادیده گرفته شوند

    try {
        const database = client.db('shop');
        const productsCollection = database.collection('products');

        // دریافت محصولات با استفاده از skip و limit
        const products = await productsCollection.find().skip(skip).limit(limit).toArray();
        const totalProducts = await productsCollection.countDocuments(); // تعداد کل محصولات
        const totalPages = Math.ceil(totalProducts / limit); // محاسبه تعداد کل صفحات

        res.json({
            products,
            totalProducts,
            totalPages,
            currentPage: page
        });
    } catch (error) {
        res.status(500).send(error);
    }
});


app.get('/product', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'product.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'main.html'));
});

app.listen(3000, () => {
    console.log('Server is running on port http://localhost:3000');
});
