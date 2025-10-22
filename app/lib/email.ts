interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  eventDate: string;
  venue?: string;
  message: string;
}

interface EmailConfig {
  service: 'sendgrid' | 'nodemailer' | 'console';
  apiKey?: string;
  fromEmail: string;
  toEmail: string;
  smtpConfig?: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
}

// Email template for contact form submissions
function generateEmailTemplate(data: ContactFormData): { subject: string; html: string; text: string } {
  const subject = `New Booking Enquiry from ${data.name}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; border-bottom: 2px solid #e52560; padding-bottom: 10px;">
        New Booking Enquiry
      </h2>
      
      <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #333; margin-top: 0;">Contact Details</h3>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        ${data.phone ? `<p><strong>Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>` : ''}
      </div>
      
      <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #333; margin-top: 0;">Event Details</h3>
        <p><strong>Event Date:</strong> ${new Date(data.eventDate).toLocaleDateString('en-GB', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}</p>
        ${data.venue ? `<p><strong>Venue:</strong> ${data.venue}</p>` : ''}
      </div>
      
      <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #333; margin-top: 0;">Message</h3>
        <p style="white-space: pre-wrap;">${data.message}</p>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
        <p>This enquiry was submitted through the Reever website contact form.</p>
        <p>Submitted at: ${new Date().toLocaleString('en-GB')}</p>
      </div>
    </div>
  `;
  
  const text = `
New Booking Enquiry from ${data.name}

Contact Details:
- Name: ${data.name}
- Email: ${data.email}
${data.phone ? `- Phone: ${data.phone}` : ''}

Event Details:
- Event Date: ${new Date(data.eventDate).toLocaleDateString('en-GB')}
${data.venue ? `- Venue: ${data.venue}` : ''}

Message:
${data.message}

---
This enquiry was submitted through the Reever website contact form.
Submitted at: ${new Date().toLocaleString('en-GB')}
  `;
  
  return { subject, html, text };
}

// Send email using SendGrid
async function sendWithSendGrid(config: EmailConfig, emailData: { subject: string; html: string; text: string }, formData: ContactFormData) {
  if (!config.apiKey) {
    throw new Error('SendGrid API key not configured');
  }
  
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{
        to: [{ email: config.toEmail }],
        subject: emailData.subject,
      }],
      from: { email: config.fromEmail, name: 'Reever Website' },
      reply_to: { email: formData.email, name: formData.name },
      content: [
        { type: 'text/plain', value: emailData.text },
        { type: 'text/html', value: emailData.html },
      ],
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SendGrid error: ${error}`);
  }
}

// Send email using Nodemailer (for SMTP)
async function sendWithNodemailer(emailData: { subject: string; html: string; text: string }, formData: ContactFormData) {
  // This would require installing nodemailer
  // For now, we'll throw an error with instructions
  throw new Error('Nodemailer not implemented. Please install nodemailer and implement SMTP sending.');
}

// Log email to console (for development)
function logToConsole(emailData: { subject: string; html: string; text: string }, formData: ContactFormData) {
  console.log('=== EMAIL NOTIFICATION ===');
  console.log('Subject:', emailData.subject);
  console.log('From:', formData.email);
  console.log('Message:');
  console.log(emailData.text);
  console.log('========================');
}

// Main email sending function
export async function sendContactEmail(formData: ContactFormData): Promise<void> {
  const config: EmailConfig = {
    service: (process.env.EMAIL_SERVICE as 'sendgrid' | 'nodemailer' | 'console') || 'console',
    apiKey: process.env.SENDGRID_API_KEY,
    fromEmail: process.env.FROM_EMAIL || 'noreply@reever.band',
    toEmail: process.env.CONTACT_EMAIL || 'bookings@reever.band',
    smtpConfig: process.env.SMTP_HOST ? {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    } : undefined,
  };
  
  const emailData = generateEmailTemplate(formData);
  
  try {
    switch (config.service) {
      case 'sendgrid':
        await sendWithSendGrid(config, emailData, formData);
        break;
      case 'nodemailer':
        await sendWithNodemailer(emailData, formData);
        break;
      case 'console':
      default:
        logToConsole(emailData, formData);
        break;
    }
  } catch (error) {
    console.error('Email sending failed:', error);
    // Log to console as fallback
    logToConsole(emailData, formData);
    throw error;
  }
}