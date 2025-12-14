import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

interface SendConfirmationRequest {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  totalAmount: number;
}

function generateEmailTemplate(
  orderNumber: string,
  customerName: string,
  totalAmount: number
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #7c3aed; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .order-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .button { display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>شكراً لك! Thank You!</h1>
          </div>
          <div class="content">
            <p>عزيزي/عزيزتي ${customerName},</p>
            <p>Dear ${customerName},</p>
            
            <div class="order-info">
              <h2>تفاصيل الطلب / Order Details</h2>
              <p><strong>رقم الطلب / Order Number:</strong> ${orderNumber}</p>
              <p><strong>المبلغ الإجمالي / Total Amount:</strong> $${totalAmount.toFixed(2)}</p>
            </div>
            
            <p>تم استلام طلبك بنجاح وسيتم معالجته قريباً.</p>
            <p>Your order has been received and will be processed soon.</p>
            
            <p>سنقوم بإرسال تحديثات حول حالة طلبك عبر البريد الإلكتروني.</p>
            <p>We will send you updates about your order status via email.</p>
            
            <div class="footer">
              <p>شكراً لاختيارك متجرنا!</p>
              <p>Thank you for choosing our store!</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const body: SendConfirmationRequest = await request.json();
    const { orderNumber, customerEmail, customerName, totalAmount } = body;

    // If Resend API key is not configured, just log the email
    if (!process.env.RESEND_API_KEY) {
      console.log('📧 Order Confirmation Email (Resend not configured):', {
        to: customerEmail,
        subject: `Order Confirmation - ${orderNumber}`,
        orderNumber,
        customerName,
        totalAmount,
      });

      return NextResponse.json({
        success: true,
        message: 'Email logged (Resend not configured)',
      });
    }

    // Send email using Resend
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: customerEmail,
      subject: `Order Confirmation - ${orderNumber}`,
      html: generateEmailTemplate(orderNumber, customerName, totalAmount),
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email', details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Confirmation email sent',
      emailId: data?.id,
    });
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to send confirmation email',
      },
      { status: 500 }
    );
  }
}

