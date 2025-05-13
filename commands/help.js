const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'help',
  description: 'Displays a list of available commands',
  role: [1, 2],
  execute: (message, args, userRole) => {
    const commandsFolder = path.join(__dirname, '..', 'commands');
    const commandFiles = fs.readdirSync(commandsFolder).filter(file => file.endsWith('.js'));
    const commandList = commandFiles.map((file, index) => {
      const command = require(path.join(commandsFolder, file));
      if (command.role && command.role.includes(userRole)) {
        return `${index + 1}. ${command.name} - ${command.description}`;
      }
    }).filter(Boolean);
    const helpMessage = `[ |BOT COMMANDS| ]\n${commandList.join('\n')}`;
    message.reply(helpMessage);
  }
};
