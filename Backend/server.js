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

// ==========================================
// 🆕 បន្ថែមផ្នែកទាក់ទងនឹងប្រព័ន្ធផ្ញើសារ (Messages System)
// ==========================================

// 3. ទាញយកបញ្ជីការសន្ទនាទាំងអស់ (Conversations List)
app.get('/api/conversations', verifyToken, async (req, res) => {
    try {
        // ទាញទិន្នន័យទំនាក់ទំនងទាំងអស់ដើម្បីបង្ហាញនៅ Sidebar ខាងឆ្វេង
        const [conversations] = await db.query('SELECT * FROM conversations ORDER BY id DESC');
        res.json(conversations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'មិនអាចទាញយកបញ្ជីសារបានទេ' });
    }
});

// 4. ទាញយកសារលម្អិតនៅក្នុង Chat នីមួយៗ (Messages by Conversation ID)
app.get('/api/conversations/:id/messages', verifyToken, async (req, res) => {
    try {
        const conversationId = req.params.id;
        const [messages] = await db.query(
            'SELECT * FROM messages WHERE conversation_id = ? ORDER BY id ASC', 
            [conversationId]
        );
        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'មិនអាចទាញយកសារលម្អិតបានទេ' });
    }
});

// 5. ផ្ញើសារថ្មី និងធ្វើបច្ចុប្បន្នភាព Preview (Send Message & Update Preview)
app.post('/api/conversations/:id/messages', verifyToken, async (req, res) => {
    try {
        const conversationId = req.params.id;
        const text = String(req.body.text || '').trim();
        const author = 'You'; // កំណត់ថាជាយើងផ្ញើចេញ

        if (!text) {
            return res.status(400).json({ message: 'សារមិនអាចទទេបានទេ' });
        }

        // បង្កើតម៉ោងបច្ចុប្បន្ន (HH:MM)
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

        // ក. បញ្ចូលសារថ្មីទៅក្នុងតារាង messages
        await db.query(
            'INSERT INTO messages (conversation_id, author, text, time) VALUES (?, ?, ?, ?)',
            [conversationId, author, text, currentTime]
        );

        // ខ. កែប្រែអក្សរ Preview និងម៉ោងចុងក្រោយនៅក្នុងតារាង conversations
        await db.query(
            'UPDATE conversations SET preview = ?, time = ? WHERE id = ?',
            [text, currentTime, conversationId]
        );

        res.status(201).json({ success: true, text, time: currentTime, author });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'ការផ្ញើសារមានបញ្ហា' });
    }
});

// 6. លុបចំនួន Unread ឱ្យទៅជា 0 ពេលចុចមើល Chat
app.put('/api/conversations/:id/read', verifyToken, async (req, res) => {
    try {
        const conversationId = req.params.id;
        await db.query('UPDATE conversations SET unread = 0 WHERE id = ?', [conversationId]);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'មានបញ្ហាបច្ចេកទេស' });
    }
});

// ==========================================

// 7. Protected Dashboard API
app.get('/api/dashboard', verifyToken, (req, res) => {
    res.json({ message: `សូមស្វាគមន៍មកកាន់ Dashboard, ${req.user.username}!` });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

const PORT = process.env.PORT || 5000;

app.get('/api/greeting', verifyToken, (req, res) => {
    const fallbackGreeting = `សូមស្វាគមន៍មកកាន់ Dashboard, ${req.user.username}!`;
    const greeting = process.env.GREETING || fallbackGreeting;

    res.json({ greeting });
});


// ==========================================
// 🆕 ប្រព័ន្ធគ្រប់គ្រងក្រុមការងារ (Team Members API)
// ==========================================

// 1. ទាញយកបញ្ជីសមាជិកទាំងអស់
app.get('/api/team', verifyToken, async (req, res) => {
    try {
        const [members] = await db.query('SELECT * FROM team_members ORDER BY id DESC');
        res.json(members);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'មិនអាចទាញយកទិន្នន័យសមាជិកបានទេ' });
    }
});

// 2. បន្ថែមសមាជិកថ្មី (Create)
app.post('/api/team', verifyToken, async (req, res) => {
    try {
        const { name, email, role, status } = req.body;
        if (!name || !email || !role) {
            return res.status(400).json({ message: 'សូមបំពេញព័ត៌មានចាំបាច់ឲ្យបានគ្រប់គ្រាន់' });
        }

        // ពិនិត្យមើលអ៊ីមែលជាន់គ្នា
        const [existing] = await db.query('SELECT * FROM team_members WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'អ៊ីមែលនេះមានគេប្រើរួចហើយ!' });
        }

        const [result] = await db.query(
            'INSERT INTO team_members (name, email, role, status) VALUES (?, ?, ?, ?)',
            [name, email, role, status || 'Active']
        );

        res.status(201).json({ 
            id: result.insertId, 
            name, email, role, status: status || 'Active',
            message: 'បន្ថែមសមាជិកបានជោគជ័យ!' 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'មានបញ្ហាក្នុងការបន្ថែមសមាជិក' });
    }
});

// 3. កែប្រែព័ត៌មានសមាជិក (Update)
app.put('/api/team/:id', verifyToken, async (req, res) => {
    try {
        const memberId = req.params.id;
        const { name, email, role, status } = req.body;

        await db.query(
            'UPDATE team_members SET name = ?, email = ?, role = ?, status = ? WHERE id = ?',
            [name, email, role, status, memberId]
        );

        res.json({ success: true, message: 'ធ្វើបច្ចុប្បន្នភាពបានជោគជ័យ!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'មានបញ្ហាក្នុងការកែប្រែទិន្នន័យ' });
    }
});

// 4. លុបសមាជិកចេញពីប្រព័ន្ធ (Delete)
app.delete('/api/team/:id', verifyToken, async (req, res) => {
    try {
        const memberId = req.params.id;
        await db.query('DELETE FROM team_members WHERE id = ?', [memberId]);
        res.json({ success: true, message: 'លុបសមាជិកបានជោគជ័យ!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'មានបញ្ហាក្នុងការលុបទិន្នន័យ' });
    }
});


app.listen(PORT, () => console.log(`Server កំពុងដំណើរការលើ Port ${PORT} ជាមួយ MySQL`));
