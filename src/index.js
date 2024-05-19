const TelegramBot = require('node-telegram-bot-api')
const token = '6067868221:AAGdT7AdMod-qBEcNaqMk3KSfYSCQm8hnL8'

const bot = new TelegramBot(token, { polling: true })

module.exports = {
	bot,
}
