import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import traceback
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Load SMTP Configuration from .env
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SENDER_EMAIL = os.getenv("SENDER_EMAIL")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")
SMTP_USE_SSL = os.getenv("SMTP_USE_SSL", "False").lower() == "true"
SMTP_USE_TLS = (
    os.getenv("SMTP_USE_TLS", "True").lower() == "true"
)  # TLS enabled by default

# OTP Expiry Time in minutes
OTP_EXPIRE_MINUTES = 5


# Function to send OTP Email
def send_otp_email(to_email, subject, otp):
    text = f"""
    Hello,

    You requested to reset your password. Here is your OTP:

    {otp}

    The OTP is valid for {OTP_EXPIRE_MINUTES} minutes.

    If you didn't request this, please ignore this email.

    Best Regards,
    Bespoke Health
    """

    html = f"""
    <html>
      <head>
        <style>
          body {{
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
            padding: 20px;
            margin: 0;
          }}
          .container {{
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }}
          .header {{
            background-color: #4CAF50;
            padding: 10px;
            border-radius: 10px 10px 0 0;
            text-align: center;
            color: white;
          }}
          .content {{
            padding: 20px;
          }}
          .otp-code {{
            font-size: 24px;
            font-weight: bold;
            color: #333;
          }}
          .footer {{
            text-align: center;
            margin-top: 20px;
            color: #888;
            font-size: 12px;
          }}
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>You requested to reset your password. Here is your OTP:</p>
            <p class="otp-code">{otp}</p>
            <p>The OTP is valid for {OTP_EXPIRE_MINUTES} minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <p>Best Regards,<br>Health DOM</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Bespoke Health. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
    """

    return send_email(to_email, subject, text, html)


# Function to send General Notifications
def send_notification_email(to_email, subject, body):
    text = f"""
    {body}
    Hello,
    Please Fill the KYC Updated for full features.
    
    Best Regards,
    Bespoke Health
    """

    html = f"""
    <html>
      <head>
        <style>
          body {{
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
            padding: 20px;
            margin: 0;
          }}
          .container {{
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }}
          .header {{
            background-color: #007bff;
            padding: 10px;
            border-radius: 10px 10px 0 0;
            text-align: center;
            color: white;
          }}
          .content {{
            padding: 20px;
          }}
          .footer {{
            text-align: center;
            margin-top: 20px;
            color: #888;
            font-size: 12px;
          }}
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Important Notification</h1>
          </div>
          <div class="content">
            <p>{body}</p>
            <p>Best Regards,<br>Health DOM</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Bespoke Health. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
    """

    return send_email(to_email, subject, text, html)


# Core function to send email used by OTP and notifications
def send_email(to_email, subject, text_body, html_body):
    message = MIMEMultipart("alternative")
    message["From"] = SENDER_EMAIL
    message["To"] = to_email
    message["Subject"] = subject

    plain_text = MIMEText(text_body, "plain")
    html_text = MIMEText(html_body, "html")

    message.attach(plain_text)
    message.attach(html_text)

    try:
        if SMTP_USE_TLS:
            print(f"Using TLS for SMTP connection to {SMTP_SERVER}:{SMTP_PORT}")
            with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
                server.ehlo()
                server.starttls()
                server.ehlo()
                server.login(SENDER_EMAIL, SENDER_PASSWORD)
                server.sendmail(SENDER_EMAIL, to_email, message.as_string())
        elif SMTP_USE_SSL:
            print(f"Using SSL for SMTP connection to {SMTP_SERVER}:{SMTP_PORT}")
            with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as server:
                server.login(SENDER_EMAIL, SENDER_PASSWORD)
                server.sendmail(SENDER_EMAIL, to_email, message.as_string())
        else:
            raise ValueError(
                "SMTP_USE_TLS or SMTP_USE_SSL must be set to True in the .env file."
            )

        print(f"Email sent successfully to {to_email}")
    except smtplib.SMTPAuthenticationError as e:
        print(f"SMTP Authentication Error: {e}")
    except Exception as e:
        print(f"Error sending email to {to_email}: {e}")
        traceback.print_exc()
