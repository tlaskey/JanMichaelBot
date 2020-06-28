FROM node:latest

# Create the directory
RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

# Install dependencies
COPY package.json /usr/src/bot
RUN npm install

# Copy project files to container WORKDIR
COPY . /usr/src/bot

# Run the bot!
CMD ["node", "discord-bot.js"]
