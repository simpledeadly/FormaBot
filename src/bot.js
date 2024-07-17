const TelegramBot = require('node-telegram-bot-api')
const token = '6646499705:AAGRg4icAJhYBl1Cp1ibkBBlBD8jvmTOhaE'

const { parseMarkdown, optionsWithStart } = require('./lib/variables.js')

console.log('Запущено!')

const bot = new TelegramBot(token, { polling: true })

const roundNumber = (num, precision) => {
	precision = Math.pow(10, precision)
	return Math.ceil(num * precision) / precision
}

bot.onText(/\/start/, msg => {
	const chatId = msg.chat.id
	const message = `Введите через пробел, используя точку:\n1. Риск ($)\n2. % до стоп-лосса\n3. Планируемое соотношение Риск/Прибыль\n\nПример: _${'5 2.39 4'}_`
	count = 0

	bot.on('message', callbackQuery => {
		if (count < 1) {
			const text = callbackQuery.text

			// let words = text.split(/(;|,|\s)/gm)
			let words = text.split(' ')
			console.log(words)

			const risk = +words[0]
			const sl = +words[1]
			const ratio = +words[2]

			let positionVolume = roundNumber(risk / (sl / 100), 0)
			const leverage = roundNumber((positionVolume * 0.4) / risk, 0)
			let margin = roundNumber(positionVolume / leverage, 4)
			const percSL = roundNumber(sl * leverage, 2)
			const percTP = roundNumber(percSL * ratio, 2)

			positionVolume = roundNumber(positionVolume * 1.0165, 0)
			margin = roundNumber(margin * 1.0165, 4)

			count++
			bot.sendMessage(
				chatId,
				`Номинальный объём: *${positionVolume}*\nПлечо: *${
					leverage + 'x'
				}*\nМаржа: *${'$' + margin}*\nСтоп-лосс: *${
					percSL + '%'
				}*\nТейк-профит: *${percTP + '%'}*`,
				optionsWithStart
			)
		}
	})

	bot.sendMessage(chatId, message, parseMarkdown)
})

bot.on('polling_error', error =>
	console.error('Ошибка при получении обновлений:', error)
)
