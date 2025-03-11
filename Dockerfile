# Use an official Python runtime as the base image
FROM python:3.11-slim

# Install JMeter dependencies and Node.js for React build
RUN apt-get update && apt-get install -y \
    openjdk-17-jre-headless \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy project files (including JMeter)
COPY . /app

# Ensure JMeter is executable
RUN chmod +x /app/apache-jmeter-5.6.3/bin/jmeter

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Install Node.js dependencies and build React with increased timeout
RUN npm install --timeout=600000 && npm run build

# Expose port
EXPOSE 5000

# Command to run Flask
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]