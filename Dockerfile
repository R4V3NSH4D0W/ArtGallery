# Use an official Node.js image as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

RUN npx prisma generate

# Build the Next.js application
RUN yarn run build

# Set the environment variable for the port
ENV PORT=4000

# Expose port 4000 to the host
EXPOSE 4000

# Start the Next.js app with Prisma client generation at runtime
CMD ["yarn", "run", "start"]
