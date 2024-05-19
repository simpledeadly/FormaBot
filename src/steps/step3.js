const { bot } = require('../')
const { Context } = require('../data')
const { updateObjectInContext } = require('../utils')

const handleStep3 = callbackQuery => {
	const chatId = callbackQuery.message.chat.id
	let attempt = ''

	const attemptsArray = ['ОСНОВА', 'ПЕРЕКРЫТИЕ', '2 ПЕРЕКРЫТИЕ']

	const check = attemptsArray.includes(callbackQuery.data)

	const attempts = Context[5].attempts
	const screenshots = Context[2].screenshots

	if (check === true) {
		attempt = callbackQuery.data
		attempts.push(attempt)
		updateObjectInContext('selections', 'attempt', attempt)
		console.log('Попытка:', attempt)

		const options = {
			reply_markup: {
				inline_keyboard: [
					[
						{ text: '🚫 Пропустил', callback_data: 'ПРОПУЩЕНО 🚫' },
						{ text: '🛠 Отменили', callback_data: 'ОТМЕНЕНО 🛠' },
						{ text: '⚡️ Импульс', callback_data: 'ПЛЮС ⚡️' },
					],
					[
						{ text: '💢 Ошибся', callback_data: 'МИНУС 💢' },
						{ text: '❌ Рынок', callback_data: 'МИНУС ❌' },
						{ text: '💥 Вау', callback_data: 'ПЛЮС 💥' },
					],
					[
						{ text: '♻️ Возврат', callback_data: 'ВОЗВРАТ ♻️' },
						{ text: '✅ Плюс', callback_data: 'ПЛЮС ✅' },
						{ text: '🚀 Уверенно', callback_data: 'ПЛЮС 🚀' },
					],
				],
			},
			parse_mode: 'Markdown',
		}
		bot.sendMessage(chatId, `*${'Шаг 4: Выберите итог сделки'}*`, options)
	} else if (screenshots.length < 2) {
		bot.answerCallbackQuery(callbackQuery.id, {
			text: 'Добавьте как минимум 2 скриншота',
			show_alert: false,
		})
	} else {
		bot.answerCallbackQuery(callbackQuery.id, {
			text: 'Корректно выберите попытку',
			show_alert: false,
		})
	}
}

module.exports = {
	handleStep3,
}
