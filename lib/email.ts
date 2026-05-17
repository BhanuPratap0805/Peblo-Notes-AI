import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendWelcomeEmail(email: string, name: string) {
  if (!resend) {
    console.warn('RESEND_API_KEY is not configured. Skipping welcome email for:', email);
    return null;
  }

  try {
    const data = await resend.emails.send({
      from: 'Peblo AI <onboarding@resend.dev>',
      to: email,
      subject: 'Welcome to Peblo AI! 🚀',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #4f46e5;">Welcome to Peblo AI, ${name}!</h1>
          <p>We're thrilled to have you on board.</p>
          <p>Peblo AI is your high-performance collaborative notes workspace powered by GPT-4.</p>
          <p>Here are a few things you can do to get started:</p>
          <ul>
            <li>Create your first intelligent note</li>
            <li>Use AI to draft, summarize, or brainstorm ideas</li>
            <li>Organize your workspace with smart tags</li>
          </ul>
          <br/>
          <p>If you have any questions, simply reply to this email.</p>
          <p>Happy noting!</p>
          <p>— The Peblo Team</p>
        </div>
      `,
    });

    console.log('Welcome email sent:', data);
    return data;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return null;
  }
}
