# Stage 1: Install dependencies and build the application
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
# RUN npm install

# Copy the rest of the application code
COPY . .

RUN npm install
# Build the Next.js application and capture logs
RUN npm run build

# RUN rm -rf node_modules

# Stage 2: Run the application
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /app/ ./

# Install production dependencies
# RUN npm install

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application

ENTRYPOINT [ "npm", "run", "start" ]
# CMD ["sleep", "infinity"]

