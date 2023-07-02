# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code from the src directory to the working directory
COPY src/ ./src
COPY templates/ ./templates

# Expose the port that your application listens on
EXPOSE 3000

# Specify the command to run your application using nodemon
CMD ["npx", "nodemon", "src/index.js"]
