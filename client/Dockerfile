# Use node alpine as it's a small node image
FROM node:alpine

# Create the directory on the node image 
# where our Next.js app will live
RUN mkdir -p /usr/src/app

# Set /usr/src/app as the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
# to the /usr/src/app working directory
COPY package*.json /usr/src/app

# Install dependencies in /usr/src/app
RUN npm install

# Copy the rest of our Next.js folder into /usr/src/app
COPY . /usr/src/app

# Ensure port 3000 is accessible to our system
EXPOSE 3000

CMD ["npm", "run", "dev"]