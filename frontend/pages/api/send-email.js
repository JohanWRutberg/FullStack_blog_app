import nodemailer from "nodemailer";

// Simple in-memory rate limiting store
const rateLimitStore = new Map();

// Rate limit configuration
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 3; // Max 3 emails per hour per IP

// Clean up old entries every 10 minutes
setInterval(
  () => {
    const now = Date.now();
    for (const [key, value] of rateLimitStore.entries()) {
      if (now - value.firstRequest > RATE_LIMIT_WINDOW) {
        rateLimitStore.delete(key);
      }
    }
  },
  10 * 60 * 1000,
);

// Verify reCAPTCHA token
async function verifyRecaptcha(token) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${secretKey}&response=${token}`,
    },
  );

  const data = await response.json();
  return data;
}

// Check rate limit
function checkRateLimit(identifier) {
  const now = Date.now();
  const userLimit = rateLimitStore.get(identifier);

  if (!userLimit) {
    rateLimitStore.set(identifier, {
      count: 1,
      firstRequest: now,
    });
    return true;
  }

  if (now - userLimit.firstRequest > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(identifier, {
      count: 1,
      firstRequest: now,
    });
    return true;
  }

  if (userLimit.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  userLimit.count++;
  return true;
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, subject, message, recaptchaToken, website } = req.body;

    // Honeypot check - if website field is filled, it's a bot
    if (website) {
      console.log("Honeypot triggered - bot detected");
      // Return success to not reveal the honeypot
      return res.status(200).json({ message: "Email sent successfully" });
    }

    // Validate required fields
    if (!name || !email || !subject || !message || !recaptchaToken) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Server-side validation
    if (name.length < 2 || name.length > 30) {
      return res
        .status(400)
        .json({ error: "Name must be between 2 and 30 characters" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    if (subject.length < 3 || subject.length > 100) {
      return res
        .status(400)
        .json({ error: "Subject must be between 3 and 100 characters" });
    }

    if (message.length < 10 || message.length > 5000) {
      return res
        .status(400)
        .json({ error: "Message must be between 10 and 5000 characters" });
    }

    // Check for suspicious patterns (random strings like the spam you showed)
    const suspiciousPattern = /^[A-Z][a-z]{2,}[A-Z][a-z]{2,}[A-Z]/;
    if (suspiciousPattern.test(name) || suspiciousPattern.test(subject)) {
      console.log("Suspicious pattern detected in name or subject");
      return res.status(400).json({ error: "Invalid input detected" });
    }

    try {
      // Verify reCAPTCHA
      const recaptchaResult = await verifyRecaptcha(recaptchaToken);

      if (!recaptchaResult.success) {
        console.log("reCAPTCHA verification failed:", recaptchaResult);
        return res.status(400).json({ error: "reCAPTCHA verification failed" });
      }

      // Check reCAPTCHA score (for v3, scores range from 0.0 to 1.0)
      if (recaptchaResult.score < 0.5) {
        console.log("reCAPTCHA score too low:", recaptchaResult.score);
        return res.status(400).json({ error: "Suspicious activity detected" });
      }

      // Rate limiting based on email
      if (!checkRateLimit(email)) {
        console.log("Rate limit exceeded for:", email);
        return res.status(429).json({
          error: "Too many requests. Please try again later.",
        });
      }

      // Configure Nodemailer
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });

      // Email content
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_ADDRESS,
        replyTo: email,
        subject: `Contact Form: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}\n\n---\nreCAPTCHA Score: ${recaptchaResult.score}`,
        html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">reCAPTCHA Score: ${recaptchaResult.score}</p>
        `,
      };

      // Send email
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully from:", email);
      res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Error sending email" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
