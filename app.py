from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import subprocess
import os
import google.generativeai as genai
import pandas as pd
import smtplib
import json
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

# Configure Flask app
app = Flask(__name__, static_folder='static')
CORS(app)  # Enable CORS for frontend communication

# Paths for uploads, JMeter, JMX files, and results
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
JMX_FOLDER = os.path.join(BASE_DIR, "jmx_files")
RESULTS_FOLDER = os.path.join(BASE_DIR, "results")
#STATIC_FOLDER = os.path.join(BASE_DIR, "static")
JMETER_PATH = r"C:\apache-jmeter-5.6.3\bin\jmeter.bat"  # Update this if needed
EMAIL_FILE = "emails.json"  # Define EMAIL_FILE constant

# Ensure necessary folders exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(JMX_FOLDER, exist_ok=True)
os.makedirs(RESULTS_FOLDER, exist_ok=True)
#os.makedirs(STATIC_FOLDER, exist_ok=True)

# Set up Gemini API key
GEMINI_API_KEY = "AIzaSyARWzo_UYaVxTM6w2h-Sq1uBT_NncX7pGo"
genai.configure(api_key=GEMINI_API_KEY)

# Serve frontend (optional)
@app.route('/')
def serve_frontend():
    return send_from_directory(STATIC_FOLDER, "")

# Run JMeter Test Endpoint
@app.route('/run-test/<test_filename>', methods=['POST'])
def run_test(test_filename):
    if 'file' not in request.files:
        return jsonify({'status': 'error', 'message': 'No file uploaded'}), 400
    file = request.files['file']
    jmx_file = os.path.join(JMX_FOLDER, test_filename)
    file.save(jmx_file)

    result_filename = f"{test_filename.replace('.jmx', '')}_{datetime.now().strftime('%Y%m%d%H%M%S')}.jtl"
    result_file = os.path.join(RESULTS_FOLDER, result_filename)

    command = [JMETER_PATH, '-n', '-t', jmx_file, '-l', result_file]

    try:
        process = subprocess.run(command, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        with open(result_file, 'r') as jtl_file:
            jtl_content = jtl_file.read()
        return jsonify({
            'status': 'success',
            'message': f'Test completed. Results saved to {result_filename}',
            'output': process.stdout,
            'result_file': result_filename,
            'jtl_content': jtl_content
        }), 200
    except subprocess.CalledProcessError as e:
        return jsonify({'status': 'error', 'message': f'Error executing JMeter: {e.stderr}'}), 500
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Error reading result file: {str(e)}'}), 500

# Download Result File Endpoint
@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    try:
        return send_from_directory(RESULTS_FOLDER, filename, as_attachment=True)
    except FileNotFoundError:
        return jsonify({'status': 'error', 'message': 'File not found'}), 404

# Analyze JTL File Endpoint
def analyze_jtl(file_path):
    try:
        df = pd.read_csv(file_path)
        required_columns = {"label", "elapsed", "responseCode", "allThreads"}
        if not required_columns.issubset(df.columns):
            return {"error": "The uploaded file is missing required columns."}

        summary = df.groupby("label").agg(
            avg_response_time=("elapsed", "mean"),
            error_rate=("responseCode", lambda x: (x.astype(str) != '200').mean() * 100),
            throughput=("label", "count"),
            concurrent_users=("allThreads", "max")
        ).reset_index()

        performance_summary = "\n".join(
            f"The {row['label']} API shows an average response time of {row['avg_response_time']:.2f}ms "
            f"with an error rate of {row['error_rate']:.2f}%. "
            f"Throughput is {row['throughput']} requests over {row['concurrent_users']} users."
            for _, row in summary.iterrows()
        )

        messages = [
            {
                "role": "user",
                "parts": [{"text": (
                    "You are a performance analysis assistant. "
                    "Your task is to generate a structured summary of API performance metrics, "
                    "root cause analysis for failures and performance issues, "
                    "and provide suggestions to improve performance.\n\n"
                    f"Here are the performance test results:\n\n{performance_summary}\n\n"
                    "Provide root cause analysis for any failures and performance issues. "
                    "Suggest ways to improve performance and fix failures."
                    "Give the output in Markdown only"
                )}]
            }
        ]

        model = genai.GenerativeModel("gemini-1.5-pro")
        response = model.generate_content(messages)
        return {"analysis": response.text if response else "Error: No response from Gemini API."}

    except Exception as e:
        return {"error": f"Error processing JTL file: {str(e)}"}

@app.route("/analyzeJTL", methods=["POST"])
def analyze_jtl_api():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Empty file uploaded"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    result = analyze_jtl(file_path)
    return jsonify(result)

# Existing Send Email Endpoint (kept for reference)
def send_email_with_attachment(file_path):
    try:
        if not os.path.exists("emails.json"):
            return {"error": "No email addresses found."}

        with open("emails.json", "r") as f:
            emails = json.load(f).get("emails", [])

        if not emails:
            return {"error": "No email addresses stored."}

        sender_email = "20ucs121@lnmiit.ac.in"
        sender_password = "bgat mvla ieqr rvxv"
        subject = "JTL Analysis Results"

        msg = MIMEMultipart()
        msg["Subject"] = subject
        msg["From"] = sender_email
        msg["To"] = ", ".join(emails)
        msg.attach(MIMEText("Hi,\nPlease find the analysis report attached.", "plain"))

        with open(file_path, "rb") as attachment:
            part = MIMEBase("application", "octet-stream")
            part.set_payload(attachment.read())
            encoders.encode_base64(part)
            part.add_header("Content-Disposition", f"attachment; filename={os.path.basename(file_path)}")
            msg.attach(part)

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, emails, msg.as_string())

        return {"success": f"Email sent to {len(emails)} recipients with attachment."}

    except Exception as e:
        return {"error": f"Failed to send email: {str(e)}"}

@app.route("/sendEmailWithAttachment", methods=["POST"])
def send_email_with_attachment_api():
    data = request.json
    result_text = data.get("analysis", "")
    if not result_text:
        return jsonify({"error": "No analysis result provided."}), 400

    file_path = os.path.join(RESULTS_FOLDER, "analysis_report.txt")
    with open(file_path, "w") as output_file:
        output_file.write(result_text)

    response = send_email_with_attachment(file_path)
    return jsonify(response)

# New Send Email Function and Endpoint
def send_email(result_text):
    """Send analysis results to all stored email addresses."""
    try:
        if not os.path.exists(EMAIL_FILE):
            return {"error": "No email addresses found."}

        with open(EMAIL_FILE, "r") as f:
            emails = json.load(f).get("emails", [])

        if not emails:
            return {"error": "No email addresses stored."}

        sender_email = "20ucs121@lnmiit.ac.in"
        sender_password = "bgat mvla ieqr rvxv"
        subject = "JTL Analysis Results"

        # Format email message (fixed MIMEText assignment)
        msg = MIMEText("Hi all,\n\nHere are the analysis results:\n\n" + result_text)
        msg["Subject"] = subject
        msg["From"] = sender_email
        msg["To"] = ", ".join(emails)

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, emails, msg.as_string())

        return {"success": f"Email sent to {len(emails)} recipients."}

    except Exception as e:
        return {"error": f"Failed to send email: {str(e)}"}

@app.route("/sendEmail", methods=["POST"])
def send_email_api():
    """API endpoint to send analysis results via email."""
    data = request.json
    result_text = data.get("analysis", "")
    output_file_name = "report.txt"
    with open(output_file_name, 'w') as output_file:
        output_file.write(result_text)

    if not result_text:
        return jsonify({"error": "No analysis result provided."}), 400

    response = send_email(result_text)  # Use result_text directly
    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True, port=5000)