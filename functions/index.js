const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const axios = require('axios');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'bryandzumbira@gmail.com',
        pass: process.env.EMAIL_PASSWORD // You'll need to set this in Firebase environment variables
    }
});

// WhatsApp Business API configuration
const WHATSAPP_API_URL = 'https://graph.facebook.com/v17.0/263715606651/messages'; // Your WhatsApp Business number
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN; // We'll set this in Firebase environment variables

exports.sendEmail = functions.https.onRequest(async (req, res) => {
    // Enable CORS
    res.set('Access-Control-Allow-Origin', '*');
    
    if (req.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.status(204).send('');
        return;
    }

    try {
        const { to, subject, text } = req.body;

        const mailOptions = {
            from: 'bryandzumbira@gmail.com',
            to: to,
            subject: subject,
            text: text,
            html: text.replace(/\n/g, '<br>')
        };

        await transporter.sendMail(mailOptions);
        
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

exports.sendWhatsAppMessage = functions.https.onRequest(async (req, res) => {
    // Enable CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }

    try {
        const { message, phoneNumber } = req.body;

        if (!message || !phoneNumber) {
            throw new Error('Missing required fields');
        }

        // Format phone number (remove any non-numeric characters)
        const formattedPhone = phoneNumber.replace(/\D/g, '');

        // Send message using WhatsApp Business API
        const response = await axios.post(WHATSAPP_API_URL, {
            messaging_product: "whatsapp",
            to: formattedPhone,
            type: "text",
            text: { body: message }
        }, {
            headers: {
                'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        res.json({ success: true, data: response.data });
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to send message'
        });
    }
});

// Stripe Payment Processing
exports.createPaymentIntent = functions.https.onRequest(async (req, res) => {
    // Enable CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 100, // $1.00 in cents
            currency: 'usd',
            payment_method_types: ['card'],
            metadata: {
                userId: req.body.userId,
                subscriptionType: 'monthly'
            }
        });

        res.json({
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({
            error: error.message
        });
    }
});

exports.handlePaymentSuccess = functions.https.onRequest(async (req, res) => {
    // Enable CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }

    try {
        const event = req.body;
        const paymentIntent = event.data.object;

        if (event.type === 'payment_intent.succeeded') {
            const { userId } = paymentIntent.metadata;
            
            // Create subscription record in Firebase
            const admin = require('firebase-admin');
            if (!admin.apps.length) {
                admin.initializeApp();
            }

            const subscriptionData = {
                userId: userId,
                startDate: new Date().toISOString(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
                status: 'active',
                paymentIntentId: paymentIntent.id
            };

            await admin.database().ref('subscriptions').push(subscriptionData);
            
            res.json({ received: true });
        } else {
            res.status(400).json({ error: 'Unhandled event type' });
        }
    } catch (error) {
        console.error('Error handling payment success:', error);
        res.status(500).json({ error: error.message });
    }
}); 