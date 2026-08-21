const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

// Create MySQL Connection Pool
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
}).promise(); // Allows using async/await

// 1. Register API
app.post('/api/register', async (req, res) => {
    try {
        const username = String(req.body.username || '').trim();
        const password = String(req.body.password || '');

        if (!username || !password) {
            return res.status(400).json({ message: 'សូមបំពេញព័ត៌មានឲ្យបានគ្រប់គ្រាន់' });
        }

        const [existingUser] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'ឈ្មោះនេះមានគេប្រើហើយ!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

        res.status(201).json({ message: 'ចុះឈ្មោះបានជោគជ័យ!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'មានបញ្ហាបច្ចេកទេសខាង Server' });
    }
});

// 2. Login API
app.post('/api/login', async (req, res) => {
    try {
        const username = String(req.body.username || '').trim();
        const password = String(req.body.password || '');

        if (!username || !password) {
            return res.status(400).json({ message: 'សូមបំពេញព័ត៌មានឲ្យបានគ្រប់គ្រាន់' });
        }

        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'រកមិនឃើញគណនីនេះទេ!' });
        }

        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'ពាក្យសម្ងាត់មិនត្រឹមត្រូវ!' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Login ជោគជ័យ!', token, username: user.username });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'មានបញ្ហាបច្ចេកទេសខាង Server' });
    }
});

// Protected Route Middleware
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(403).json({ message: 'តម្រូវឲ្យមាន Token ដើម្បីចូល' });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token មិនត្រឹមត្រូវ ឬហួសកំណត់' });
        }

        req.user = decoded;
        next();
    });
};

// 3. Protected Dashboard API
app.get('/api/dashboard', verifyToken, (req, res) => {
    res.json({ message: `សូមស្វាគមន៍មកកាន់ Dashboard, ${req.user.username}!` });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server កំពុងដំណើរការលើ Port ${PORT} ជាមួយ MySQL`));
