import os
import random
import smtplib
from email.mime.text import MIMEText  # Corrected import
from email.mime.multipart import MIMEMultipart
import logging
import traceback

# logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

OTP_EXPIRE_MINUTES = 5

# SMTP Email Setup
SENDER_EMAIL = os.getenv("SENDER_EMAIL")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587


# Function to generate a random OTP
def generate_otp():
    return str(random.randint(100000, 999999)).zfill(6)


# Function to send email with OTP
def send_otp_email(to_email, subject, otp):

    text = f"""
    Hello,

    You requested to reset your password. Here is your OTP:

    {otp}

    The OTP is valid for {OTP_EXPIRE_MINUTES} minutes.

    If you didn't request this, please ignore this email.

    Best Regards,
    Health DOM
    """

    # HTML version of the email
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
            <p>&copy; 2024 Health DOM. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
    """

    # Create the email message
    message = MIMEMultipart("alternative")
    message["From"] = SENDER_EMAIL
    message["To"] = to_email
    message["Subject"] = subject

    # Attaching the plain and html text
    plain_text = MIMEText(text, "plain")
    html_text = MIMEText(html, "html")

    message.attach(plain_text)
    message.attach(html_text)

    # Send the email
    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.ehlo()
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, to_email, message.as_string())
            print("OTP email sent successfully!")
    except Exception as e:
        print(f"Error sending OTP email: {e}")
        traceback.print_exc()
