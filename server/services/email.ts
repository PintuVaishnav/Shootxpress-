import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  console.warn("SENDGRID_API_KEY environment variable not set. Email functionality will be disabled.");
}

const mailService = new MailService();
if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn("SendGrid API key not configured. Email not sent.");
    return false;
  }

  try {
    await mailService.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export async function sendBookingConfirmation(booking: any): Promise<boolean> {
  const fromEmail = process.env.FROM_EMAIL || "info@shootxpress.com";
  
  const html = `
    <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); color: white; padding: 40px 20px; text-align: center;">
        <h1 style="font-size: 2.5rem; font-weight: 900; margin: 0;">
          SHOOT<span style="color: #FF4500;">X</span>PRESS
        </h1>
        <p style="font-size: 1.2rem; margin: 10px 0;">Booking Confirmation</p>
      </div>
      
      <div style="padding: 40px 20px; background: white;">
        <h2 style="color: #000; margin-bottom: 20px;">Hello ${booking.firstName}!</h2>
        <p style="color: #666; line-height: 1.6;">
          Thank you for choosing ShootXpress! Your booking has been confirmed and we're excited to capture your special moments.
        </p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #000; margin: 0 0 15px 0;">Booking Details</h3>
          <p><strong>Package:</strong> ${booking.packageType}</p>
          <p><strong>Event Date:</strong> ${new Date(booking.eventDate).toLocaleDateString()}</p>
          <p><strong>Event Time:</strong> ${booking.eventTime}</p>
          <p><strong>Event Type:</strong> ${booking.eventType}</p>
          <p><strong>Location:</strong> ${booking.eventLocation}</p>
          <p><strong>Total Amount:</strong> ₹${booking.totalAmount}</p>
          <p><strong>Advance Paid:</strong> ₹${booking.advanceAmount}</p>
          ${booking.specialRequirements ? `<p><strong>Special Requirements:</strong> ${booking.specialRequirements}</p>` : ''}
        </div>
        
        <div style="background: #FF4500; color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0;">Important Reminders</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Please be ready 15 minutes before the scheduled time</li>
            <li>Remaining balance will be collected on the day of shoot</li>
            <li>Same-day reel delivery as per package</li>
            <li>Contact us for any changes at least 24 hours in advance</li>
          </ul>
        </div>
        
        <p style="color: #666; line-height: 1.6;">
          If you have any questions or need to make changes to your booking, please contact us at 
          <a href="tel:+919818186301" style="color: #FF4500;">+91 98181 86301</a> or 
          <a href="mailto:info@shootxpress.com" style="color: #FF4500;">info@shootxpress.com</a>
        </p>
        
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #999;">Follow us on social media for updates and inspiration!</p>
          <div style="margin: 20px 0;">
            <a href="#" style="display: inline-block; margin: 0 10px; color: #FF4500;">Instagram</a>
            <a href="#" style="display: inline-block; margin: 0 10px; color: #FF4500;">WhatsApp</a>
            <a href="#" style="display: inline-block; margin: 0 10px; color: #FF4500;">YouTube</a>
          </div>
        </div>
      </div>
    </div>
  `;

  return await sendEmail({
    to: booking.email,
    from: fromEmail,
    subject: `ShootXpress - Booking Confirmed for ${new Date(booking.eventDate).toLocaleDateString()}`,
    html,
  });
}

export async function sendContactNotification(contact: any): Promise<boolean> {
  const fromEmail = process.env.FROM_EMAIL || "info@shootxpress.com";
  const adminEmail = process.env.ADMIN_EMAIL || "admin@shootxpress.com";
  
  const html = `
    <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); color: white; padding: 40px 20px; text-align: center;">
        <h1 style="font-size: 2.5rem; font-weight: 900; margin: 0;">
          SHOOT<span style="color: #FF4500;">X</span>PRESS
        </h1>
        <p style="font-size: 1.2rem; margin: 10px 0;">New Contact Form Submission</p>
      </div>
      
      <div style="padding: 40px 20px; background: white;">
        <h2 style="color: #000; margin-bottom: 20px;">New Message from ${contact.firstName} ${contact.lastName}</h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #000; margin: 0 0 15px 0;">Contact Details</h3>
          <p><strong>Name:</strong> ${contact.firstName} ${contact.lastName}</p>
          <p><strong>Email:</strong> ${contact.email}</p>
          ${contact.phone ? `<p><strong>Phone:</strong> ${contact.phone}</p>` : ''}
          ${contact.eventType ? `<p><strong>Event Type:</strong> ${contact.eventType}</p>` : ''}
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #000; margin: 0 0 15px 0;">Message</h3>
          <p style="color: #333; line-height: 1.6;">${contact.message}</p>
        </div>
        
        <p style="color: #666;">
          Please respond to this inquiry at your earliest convenience.
        </p>
      </div>
    </div>
  `;

  return await sendEmail({
    to: adminEmail,
    from: fromEmail,
    subject: `New Contact Form Submission from ${contact.firstName} ${contact.lastName}`,
    html,
  });
}
