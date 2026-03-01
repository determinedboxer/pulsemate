// API Route: Contact Form Submission
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseServer } from '@/lib/supabase';
import { currentUser } from '@clerk/nextjs/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // Validate input
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Get current user if authenticated
    const user = await currentUser();
    let userId: string | null = null;

    if (user) {
      const { data: dbUser } = await supabaseServer
        .from('users')
        .select('id')
        .eq('clerk_user_id', user.id)
        .single();
      
      userId = dbUser?.id || null;
    }

    // Save ticket to database
    const { data: ticket, error: dbError } = await supabaseServer
      .from('support_tickets')
      .insert({
        user_id: userId,
        ticket_type: 'contact',
        subject: subject,
        message: message,
        email: email,
        status: 'open',
        user_agent: req.headers.get('user-agent'),
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save ticket' },
        { status: 500 }
      );
    }

    // Send email notification via Resend
    try {
      await resend.emails.send({
        from: 'PulseMate Support <support@pulsemate.ai>',
        to: ['support@pulsemate.ai'], // Your support email
        replyTo: email,
        subject: `Contact Form: ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><small>Ticket ID: ${ticket.id}</small></p>
          <p><small>User ID: ${userId || 'Anonymous'}</small></p>
        `,
      });
    } catch (emailError) {
      console.error('Email send error:', emailError);
      // Don't fail the request if email fails - ticket is already saved
    }

    return NextResponse.json({
      success: true,
      ticketId: ticket.id,
      message: 'Your message has been received. We\'ll respond within 24 hours.',
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
