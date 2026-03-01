// API Route: Issue Report Submission
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseServer } from '@/lib/supabase';
import { currentUser } from '@clerk/nextjs/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { issueType, description, email, severity } = body;

    // Validate input
    if (!issueType || !description || !email || !severity) {
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

    // Save report to database
    const { data: report, error: dbError } = await supabaseServer
      .from('support_tickets')
      .insert({
        user_id: userId,
        ticket_type: 'report',
        subject: issueType,
        message: description,
        email: email,
        severity: severity,
        status: 'open',
        user_agent: req.headers.get('user-agent'),
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save report' },
        { status: 500 }
      );
    }

    // Send email notification via Resend
    try {
      const severityEmoji = severity === 'high' ? '🔴' : severity === 'medium' ? '🟡' : '🟢';
      
      await resend.emails.send({
        from: 'PulseMate Support <support@pulsemate.ai>',
        to: ['support@pulsemate.ai'], // Your support email
        replyTo: email,
        subject: `${severityEmoji} Issue Report: ${issueType} [${severity.toUpperCase()}]`,
        html: `
          <h2>New Issue Report</h2>
          <p><strong>Severity:</strong> ${severityEmoji} ${severity.toUpperCase()}</p>
          <p><strong>Issue Type:</strong> ${issueType}</p>
          <p><strong>From:</strong> ${email}</p>
          <p><strong>Description:</strong></p>
          <p>${description.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><strong>User Agent:</strong> ${req.headers.get('user-agent')}</p>
          <p><small>Report ID: ${report.id}</small></p>
          <p><small>User ID: ${userId || 'Anonymous'}</small></p>
        `,
      });
    } catch (emailError) {
      console.error('Email send error:', emailError);
      // Don't fail the request if email fails - report is already saved
    }

    return NextResponse.json({
      success: true,
      reportId: report.id,
      message: 'Your report has been submitted. Thank you for helping us improve!',
    });

  } catch (error) {
    console.error('Report form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
