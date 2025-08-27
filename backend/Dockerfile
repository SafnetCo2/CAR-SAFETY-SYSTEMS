# Use Node.js LTS
FROM node:18

# Set working dir
WORKDIR /app

# Copy package.json first (for caching layers)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of code
COPY . .

# Expose API port
EXPOSE 5000

# Start app
CMD ["npm", "start"]
