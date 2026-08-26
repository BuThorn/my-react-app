const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';

app.use(express.json({ limit: '6mb' }));
app.use(cors({ origin: true, credentials: true }));


// Create MySQL Connection Pool
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'my_app_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
}).promise(); // Allows using async/await

// ================================
// 2. SOCKET.I0 SETUP EVENTS 
// ================================

const io = new Server(server, {
    cors: {
        origin: true,
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // កាលណា User ចូលប្រអប់ Chat ណាមួយ ឱ្យចូល Room នៃ Chat ID នោះ
    socket.on('join_room', (conversationId) => {
        const roomId = Number(conversationId);
        if (!Number.isInteger(roomId) || roomId <= 0) return;

        socket.join(String(roomId));
        console.log(`User ${socket.id} joined room: ${roomId}`);
    });

    socket.on('disconnect', () => {
        console.log(`User Disconnected: ${socket.id}`);
    });
});
// ============================================
// 4. AUTH ROUTES (REGISTER & LOGIN)
// ============================================


// 1. Register API

const validateConversationId = (req, res, next) => {
    const conversationId = Number(req.params.id);
    if (!Number.isInteger(conversationId) || conversationId <= 0) {
        return res.status(400).json({ message: 'Conversation ID មិនត្រឹមត្រូវ' });
    }

    req.conversationId = conversationId;
    next();
};

const requireConversation = async (req, res, next) => {
    try {
        const [conversations] = await db.query('SELECT id FROM conversations WHERE id = ?', [req.conversationId]);
        if (conversations.length === 0) {
            return res.status(404).json({ message: 'រកមិនឃើញការសន្ទនានេះទេ' });
        }

        next();
    } catch (error) {
        console.error('Error validating conversation:', error);
        res.status(500).json({ message: 'មិនអាចផ្ទៀងផ្ទាត់ការសន្ទនាបានទេ' });
    }
};
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
// 🆕 បន្ថែមផ្នែកទាក់ទងនឹងប្រព័ន្ធជជែក (Chats System)
// ==========================================

// 3. ទាញយកបញ្ជីការសន្ទនាទាំងអស់ (Conversations List)
app.get(['/api/chats', '/api/conversations'], verifyToken, async (req, res) => {
    try {
        // ទាញទិន្នន័យទំនាក់ទំនងទាំងអស់ដើម្បីបង្ហាញនៅ Sidebar ខាងឆ្វេង
        const [conversations] = await db.query('SELECT * FROM conversations ORDER BY id DESC');
        res.json(conversations);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ message: 'មិនអាចទាញយកបញ្ជីសារបានទេ' });
    }
});

// 4. ទាញយកសារលម្អិតនៅក្នុង Chat នីមួយៗ (Messages by Conversation ID)
app.get(['/api/chats/:id/messages', '/api/conversations/:id/messages'], verifyToken, validateConversationId, requireConversation, async (req, res) => {
    try {
        const conversationId = req.conversationId;
        const [messages] = await db.query(
            'SELECT * FROM messages WHERE conversation_id = ? ORDER BY id ASC', 
            [conversationId]
        );
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages for conversation:', error);
        res.status(500).json({ message: 'មិនអាចទាញយកសារលម្អិតបានទេ' });
    }
});

// 5. ផ្ញើសារថ្មី និងធ្វើបច្ចុប្បន្នភាព Preview (Send Message & Update Preview)
app.post(['/api/chats/:id/messages', '/api/conversations/:id/messages'], verifyToken, validateConversationId, requireConversation, async (req, res) => {
    try {
        const conversationId = req.conversationId;
        const text = String(req.body.text || '').trim();
        const attachmentName = String(req.body.attachment_name || '').trim();
        const attachmentData = String(req.body.attachment_data || '').trim();
        const replyToId = req.body.reply_to_id ? Number(req.body.reply_to_id) : null;
        const author = req.user.username;

        if (!text && !attachmentData) {
            return res.status(400).json({ message: 'សារមិនអាចទទេបានទេ' });
        }

        if (attachmentData.length > 5 * 1024 * 1024) {
            return res.status(413).json({ message: 'ឯកសារធំពេក។ អនុញ្ញាតត្រឹម 5MB' });
        }

        if (replyToId !== null && (!Number.isInteger(replyToId) || replyToId <= 0)) {
            return res.status(400).json({ message: 'Reply message ID មិនត្រឹមត្រូវ' });
        }

        if (replyToId !== null) {
            const [repliedMessages] = await db.query(
                'SELECT id FROM messages WHERE id = ? AND conversation_id = ?',
                [replyToId, conversationId]
            );
            if (repliedMessages.length === 0) {
                return res.status(400).json({ message: 'មិនអាច Reply ទៅសារនេះបានទេ' });
            }
        }

        // បង្កើតម៉ោងបច្ចុប្បន្ន (HH:MM)
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

        // ក. បញ្ចូលសារថ្មីទៅក្នុងតារាង messages
        const [result] = await db.query(
            'INSERT INTO messages (conversation_id, author, text, time, attachment_name, attachment_data, reply_to_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [conversationId, author, text, currentTime, attachmentName || null, attachmentData || null, replyToId]
        );

        // ខ. កែប្រែអក្សរ Preview និងម៉ោងចុងក្រោយនៅក្នុងតារាង conversations
        await db.query(
            'UPDATE conversations SET preview = ?, time = ? WHERE id = ?',
            [text, currentTime, conversationId]
        );

        const newMessage = {
            id: result.insertId,
            conversation_id: Number(conversationId),
            author,
            text,
            time: currentTime,
            attachment_name: attachmentName || null,
            attachment_data: attachmentData || null,
            reply_to_id: replyToId,
            read_at: null,
        };
        
        // Real-time Brodcast 
        io.to(String(conversationId)).emit('receive_message', newMessage);
        io.emit('update_sidebar', {
            conversationId: Number(conversationId),
            text,
            time: currentTime,
        });

        res.status(201).json({ success: true, ...newMessage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'ការផ្ញើសារមានបញ្ហា' });
    }
});

// 6. លុបចំនួន Unread ឱ្យទៅជា 0 ពេលចុចមើល Chat
app.put(['/api/chats/:id/read', '/api/conversations/:id/read'], verifyToken, validateConversationId, requireConversation, async (req, res) => {
    try {
        const conversationId = req.conversationId;
        await db.query('UPDATE conversations SET unread = 0 WHERE id = ?', [conversationId]);
        await db.query('UPDATE messages SET read_at = COALESCE(read_at, NOW()) WHERE conversation_id = ?', [conversationId]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error marking conversation as read:', error);
        res.status(500).json({ message: 'មានបញ្ហាបច្ចេកទេស' });
    }
});

app.put(['/api/chats/:conversationId/messages/:messageId', '/api/conversations/:conversationId/messages/:messageId'], verifyToken, async (req, res) => {
    try {
        const conversationId = Number(req.params.conversationId);
        const messageId = Number(req.params.messageId);
        const text = String(req.body.text || '').trim();

        if (!Number.isInteger(conversationId) || conversationId <= 0 || !Number.isInteger(messageId) || messageId <= 0 || !text) {
            return res.status(400).json({ message: 'ទិន្នន័យកែប្រែមិនត្រឹមត្រូវ' });
        }

        const [result] = await db.query(
            'UPDATE messages SET text = ?, edited_at = NOW() WHERE id = ? AND conversation_id = ? AND author = ?',
            [text, messageId, conversationId, req.user.username]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'មិនអាចកែសារនេះបានទេ' });
        }

        const [messages] = await db.query('SELECT * FROM messages WHERE id = ?', [messageId]);
        io.to(String(conversationId)).emit('message_updated', messages[0]);
        res.json({ success: true, message: messages[0] });
    } catch (error) {
        console.error('Error editing message:', error);
        res.status(500).json({ message: 'ការកែសារមានបញ្ហា' });
    }
});

app.delete(['/api/chats/:conversationId/messages/:messageId', '/api/conversations/:conversationId/messages/:messageId'], verifyToken, async (req, res) => {
    try {
        const conversationId = Number(req.params.conversationId);
        const messageId = Number(req.params.messageId);

        if (!Number.isInteger(conversationId) || conversationId <= 0 || !Number.isInteger(messageId) || messageId <= 0) {
            return res.status(400).json({ message: 'ទិន្នន័យលុបមិនត្រឹមត្រូវ' });
        }

        const [result] = await db.query(
            "UPDATE messages SET text = 'Message deleted', attachment_name = NULL, attachment_data = NULL, deleted_at = NOW() WHERE id = ? AND conversation_id = ? AND author = ?",
            [messageId, conversationId, req.user.username]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'មិនអាចលុបសារនេះបានទេ' });
        }

        const deletedMessage = { id: messageId, conversation_id: conversationId, text: 'Message deleted', deleted_at: new Date().toISOString() };
        io.to(String(conversationId)).emit('message_deleted', deletedMessage);
        res.json({ success: true, message: deletedMessage });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ message: 'ការលុបសារមានបញ្ហា' });
    }
});

// ==========================================
// 6. TEAM MEMBERS ROUTES (CRUD)
// ==========================================



// 7. Protected Dashboard API
app.get('/api/dashboard', verifyToken, (req, res) => {
    res.json({ message: `សូមស្វាគមន៍មកកាន់ Dashboard, ${req.user.username}!` });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

app.get('/api/greeting', verifyToken, (req, res) => {
    const fallbackGreeting = `សូមស្វាគមន៍មកកាន់ Dashboard, ${req.user.username}!`;
    const greeting = process.env.GREETING || fallbackGreeting;

    res.json({ greeting });
});


// ==========================================
// 🆕 ប្រព័ន្ធគ្រប់គ្រងក្រុមការងារ (Team Members API)
// ==========================================

// 1. ទាញយកបញ្ជីសមាជិកទាំងអស់
// ទាញយកបញ្ចីសមាជិកទាំងអស់
app.get('/api/team', verifyToken, async (req, res) => {
    try {
        const [members] = await db.query('SELECT * FROM team_members ORDER BY id DESC');
        res.json(members);
    } catch (error) {
        console.error("Error Team Error:", error);
        res.status(500).json({ message: 'មិនអាចទាញយកទិន្នន័យសមាជិកបានទេ'});
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

// ==========================================
// USER PROFILE ROUTES
// ==========================================

// ក. ទាញយកព័ត៌មាន Profile (Get Profile)
app.get('/api/profile', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const [users] = await db.query(
            'SELECT id, username, cover_image, description, skills FROM users WHERE id = ?', 
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'រកមិនឃើញគណនីនេះទេ' });
        }

        res.json(users[0]);
    } catch (error) {
        console.error("Profile Fetch Error:", error);
        res.status(500).json({ message: 'មានបញ្ហាក្នុងការទាញយកទិន្នន័យ Profile' });
    }
});

// ខ. ធ្វើបច្ចុប្បន្នភាព Profile (Update Profile)
app.put('/api/profile', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, cover_image, description, skills } = req.body;

        // ពិនិត្យមើលក្រែងលោ Username ថ្មីជាន់ជាមួយអ្នកដទៃ (លើកលែងតែខ្លួនឯង)
        const [existing] = await db.query('SELECT * FROM users WHERE username = ? AND id != ?', [username, userId]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'ឈ្មោះ (Username) នេះមានគេប្រើរួចហើយ!' });
        }

        await db.query(
            'UPDATE users SET username = ?, cover_image = ?, description = ?, skills = ? WHERE id = ?',
            [username, cover_image, description, skills, userId]
        );

        res.json({ success: true, message: 'ធ្វើបច្ចុប្បន្នភាព Profile បានជោគជ័យ!' });
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ message: 'មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ' });
    }
});



// ==========================
// 8. START SERVER
// ==========================
const PORT = process.env.PORT || 5000;

// ប្រើប្រាស់ server.listen (HTTP + Socket.IO) ជំនួស app.listen
server.listen(PORT, () => {
    console.log(`Server កំពុងដំណើរការលើ​ Port ${PORT} ជាមួយ HTTP និង​ Socket.IO`);
});

