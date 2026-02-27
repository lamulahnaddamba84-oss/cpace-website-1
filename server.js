// Simple Express server to accept investor applications, save them, and send email via SendGrid
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');

const UPLOAD_DIR = path.join(__dirname, 'uploads');
const DATA_FILE = path.join(__dirname, 'data', 'investments.json');

// Ensure directories exist
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
if (!fs.existsSync(path.dirname(DATA_FILE))) fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([]));

// Load SendGrid API key from env
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
const FROM_EMAIL = process.env.FROM_EMAIL || 'no-reply@cpace.cloud';
const TO_EMAIL = process.env.TO_EMAIL || 'invest@cpace.cloud';

if (SENDGRID_API_KEY) {
    sgMail.setApiKey(SENDGRID_API_KEY);
} else {
    console.warn('Warning: SENDGRID_API_KEY not set. Emails will not be sent.');
}

// Nodemailer Ethereal test account (fallback when SendGrid not configured)
let transporter = null;
let transporterInit = null;
if (!SENDGRID_API_KEY) {
    transporterInit = nodemailer.createTestAccount().then(testAccount => {
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: { user: testAccount.user, pass: testAccount.pass }
        });
        console.log('Nodemailer Ethereal account ready. Preview emails via returned URL in logs.');
    }).catch(err => {
        console.error('Failed to create Ethereal account for test emails:', err);
    });
}

// Helper to send mail via SendGrid or Nodemailer fallback
async function sendMailOptions(mailOptions) {
    if (SENDGRID_API_KEY) {
        // Convert nodemailer-style attachments (if any) to SendGrid attachments
        const sgAttachments = (mailOptions.attachments || []).map(a => ({
            content: Buffer.isBuffer(a.content) ? a.content.toString('base64') : Buffer.from(String(a.content)).toString('base64'),
            filename: a.filename || 'attachment',
            type: a.contentType || a.contentType || 'application/octet-stream',
            disposition: 'attachment'
        }));

        const msg = {
            to: mailOptions.to,
            from: mailOptions.from || FROM_EMAIL,
            subject: mailOptions.subject,
            html: mailOptions.html,
            attachments: sgAttachments
        };
        return sgMail.send(msg);
    } else {
        if (transporterInit) await transporterInit;
        if (!transporter) throw new Error('No mail transporter available');
        const info = await transporter.sendMail({
            from: mailOptions.from || FROM_EMAIL,
            to: mailOptions.to,
            subject: mailOptions.subject,
            html: mailOptions.html,
            attachments: (mailOptions.attachments || []).map(a => ({
                filename: a.filename,
                content: a.content,
                contentType: a.contentType || 'application/octet-stream'
            }))
        });
        const preview = nodemailer.getTestMessageUrl(info);
        console.log('Preview URL:', preview);
        return info;
    }
}

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic rate limiter for API endpoints
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
});

// Simple in-memory captcha store (token -> {answer, expires})
const captchaStore = new Map();
function cleanupCaptchas() {
    const now = Date.now();
    for (const [k, v] of captchaStore.entries()) {
        if (v.expires <= now) captchaStore.delete(k);
    }
}
setInterval(cleanupCaptchas, 60 * 1000);

// Captcha endpoint (returns short math question + token)
app.get('/api/captcha', (req, res) => {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    const op = Math.random() > 0.5 ? '+' : '-';
    const question = `${a} ${op} ${b} = ?`;
    const answer = op === '+' ? a + b : a - b;
    const token = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
    captchaStore.set(token, { answer: String(answer), expires: Date.now() + 5 * 60 * 1000 });
    res.json({ question, token, expires: 300 });
});

// Serve static site files (optional)
app.use(express.static(path.join(__dirname)));

// Multer setup for file uploads (PDF only)
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowed = ['.pdf'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowed.includes(ext)) cb(null, true);
        else cb(new Error('Only PDF uploads allowed'));
    }
});

// Helper: append record
function appendRecord(record) {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8') || '[]');
    data.push(record);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Apply rate limiter specifically to this sensitive endpoint
app.post('/api/invest', apiLimiter, upload.single('attachment'), async (req, res) => {
    try {
        const { name, email, company, amount, type, message, captchaToken, captchaAnswer } = req.body;

        // Validate captcha
        if (!captchaToken || !captchaAnswer) {
            return res.status(400).json({ error: 'Captcha required.' });
        }
        const entry = captchaStore.get(captchaToken);
        if (!entry || entry.expires <= Date.now() || String(entry.answer) !== String(captchaAnswer).trim()) {
            return res.status(400).json({ error: 'Invalid or expired captcha.' });
        }
        // consume captcha
        captchaStore.delete(captchaToken);

        // Basic server-side validation
        if (!name || !email || !amount || !type || !message) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        const record = {
            id: Date.now(),
            name,
            email,
            company: company || null,
            amount: Number(amount),
            type,
            message,
            file: req.file ? path.relative(__dirname, req.file.path) : null,
            timestamp: new Date().toISOString()
        };

        // persist
        appendRecord(record);

        // Send notification email via configured provider or local test transporter
        try {
            const attachments = [];
            if (req.file) {
                const fileBuffer = fs.readFileSync(req.file.path);
                attachments.push({
                    content: fileBuffer,
                    filename: req.file.originalname,
                    contentType: 'application/pdf'
                });
            }

            // Admin notification
            await sendMailOptions({
                to: TO_EMAIL,
                from: FROM_EMAIL,
                subject: `New Investor Application — ${name}`,
                html: `
                    <h3>New Investor Application</h3>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Company:</strong> ${company || '—'}</p>
                    <p><strong>Amount (USD):</strong> ${amount}</p>
                    <p><strong>Type:</strong> ${type}</p>
                    <p><strong>Message:</strong><br/>${message.replace(/\n/g,'<br/>')}</p>
                    <p><em>Submitted at ${record.timestamp}</em></p>
                `,
                attachments
            });

            // Applicant confirmation
            await sendMailOptions({
                to: email,
                from: FROM_EMAIL,
                subject: 'Cpace — Application Received',
                html: `<p>Thanks ${name},</p><p>We received your investor application. Our team will review it and contact you within 5 business days.</p>`
            });
        } catch (mailErr) {
            console.error('Mail send error (continuing):', mailErr);
        }

        return res.json({ ok: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Investor API listening on http://localhost:${PORT}`));
