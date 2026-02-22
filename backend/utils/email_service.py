"""
Email Service using Brevo API (Production Safe)
No SMTP connection issues
Uses EMAIL_HOST_PASSWORD as Brevo API key
"""
import requests
from django.conf import settings

BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"

def send_email_via_brevo(to_email, subject, html_content, to_name=None):
    """
    Send email using Brevo API
    
    Args:
        to_email: Recipient email address
        subject: Email subject
        html_content: HTML content of email
        to_name: Optional recipient name
    
    Returns:
        tuple: (success: bool, message: str)
    """
    try:
        # Get API key from EMAIL_HOST_PASSWORD
        api_key = getattr(settings, 'EMAIL_HOST_PASSWORD', None)
        if not api_key:
            print("⚠️ EMAIL_HOST_PASSWORD (Brevo API key) not configured")
            return False, "Email service not configured"
        
        # Get sender email from DEFAULT_FROM_EMAIL
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@jodhpurpg.com')
        
        # Prepare headers
        headers = {
            "accept": "application/json",
            "api-key": api_key,
            "content-type": "application/json"
        }
        
        # Prepare email payload
        payload = {
            "sender": {
                "name": "Jodhpur Boys PG",
                "email": from_email
            },
            "to": [{"email": to_email, "name": to_name or "User"}],
            "subject": subject,
            "htmlContent": html_content
        }
        
        # Log email attempt
        print(f"📧 Sending email via Brevo API")
        print(f"   To: {to_email}")
        print(f"   Subject: {subject}")
        
        # Send email via Brevo API
        response = requests.post(BREVO_API_URL, json=payload, headers=headers, timeout=10)
        
        # Check response
        if response.status_code in [200, 201]:
            print(f"✓ Email sent successfully via Brevo API")
            return True, "Email sent successfully"
        else:
            error_msg = f"Brevo API error: {response.status_code} - {response.text}"
            print(f"⚠️ {error_msg}")
            return False, error_msg
            
    except requests.exceptions.Timeout:
        error_msg = "Email service timeout"
        print(f"⚠️ {error_msg}")
        return False, error_msg
    except Exception as e:
        error_msg = f"Email error: {type(e).__name__}: {str(e)}"
        print(f"⚠️ {error_msg}")
        return False, error_msg


def send_otp_email(to_email, otp, user_name=None):
    """Send OTP email for password reset"""
    name = user_name or "User"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
            .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }}
            .otp-box {{ background: white; border: 2px solid #2563eb; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }}
            .otp-code {{ font-size: 36px; font-weight: bold; color: #2563eb; letter-spacing: 8px; }}
            .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Jodhpur Boys PG</h1>
            </div>
            <div class="content">
                <h2>Hello {name},</h2>
                <p>You requested to reset your password for your Jodhpur Boys PG account.</p>
                <p>Your One-Time Password (OTP) is:</p>
                <div class="otp-box">
                    <div class="otp-code">{otp}</div>
                </div>
                <p><strong>This OTP is valid for 10 minutes.</strong></p>
                <p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
                <p>Best regards,<br>Jodhpur Boys PG Team</p>
            </div>
            <div class="footer">
                <p>This is an automated email. Please do not reply.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return send_email_via_brevo(
        to_email=to_email,
        subject="Password Reset OTP - Jodhpur Boys PG",
        html_content=html_content,
        to_name=name
    )


def send_lead_notification_email(recipients, lead_name, lead_mobile, lead_date):
    """Send lead notification to admin users"""
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
            .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }}
            .info-box {{ background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb; }}
            .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>New Lead Inquiry</h1>
            </div>
            <div class="content">
                <p>A new inquiry has been received from the Jodhpur Boys PG website:</p>
                <div class="info-box">
                    <p><strong>Name:</strong> {lead_name}</p>
                    <p><strong>Mobile:</strong> {lead_mobile}</p>
                    <p><strong>Date:</strong> {lead_date}</p>
                </div>
                <p>Please contact them as soon as possible.</p>
            </div>
            <div class="footer">
                <p>Jodhpur Boys PG - Lead Management System</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Send to all recipients
    results = []
    for recipient in recipients:
        success, message = send_email_via_brevo(
            to_email=recipient,
            subject=f"New Lead: {lead_name}",
            html_content=html_content,
            to_name="Admin"
        )
        results.append((recipient, success, message))
    
    return results
