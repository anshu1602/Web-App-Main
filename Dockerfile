# Use Python 3.11-slim as the base image
FROM python:3.11-slim

# Install system dependencies: Java (for JMeter) and Node.js (for React)
RUN apt-get update && apt-get install -y \
    openjdk-17-jre-headless \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app

# Copy project files into the container
COPY . /app

# Make JMeter executable
RUN chmod +x /app/apache-jmeter-5.6.3/bin/jmeter

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Install Node.js dependencies and build React
COPY package.json package-lock.json ./
RUN npm config set fetch-timeout 600000 && npm install && npm run build

# Expose the port Flask will use
EXPOSE 5000

# Run the Flask app with Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
