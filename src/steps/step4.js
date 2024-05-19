const { bot } = require('../')
const { Context } = require('../data')
const { formatToMinutes, updateObjectInContext, curry, getValueFromContext } = require('../utils')
const {
	parseMarkdown,
	optionsWithCreateAndStop,
} = require('../parseModeVariables')

const curriedGetValueFromContext = curry(getValueFromContext)
const selections = curriedGetValueFromContext('selections')
const currencyPair = selections('currencyPair')
const screenshots = Context[2].screenshots

const handleStep4 = callbackQuery => {
	const chatId = callbackQuery.message.chat.id
	let end = ''

	const endingsArray = [
		'ПРОПУЩЕНО 🚫',
		'ОТМЕНЕНО 🛠',
		'ПЛЮС ⚡️',
		'МИНУС 💢',
		'МИНУС ❌',
		'ПЛЮС 💥',
		'ВОЗВРАТ ♻️',
		'ПЛЮС ✅',
		'ПЛЮС 🚀',
	]

	const check = endingsArray.includes(callbackQuery.data)

	if (check === true) {
		end = callbackQuery.data
		updateObjectInContext('selections', 'end', end)

		endFulfilling = new Date()
		const formattedDifferenceFulfilling = endFulfilling - endFindingTime
		let formattedFulfillingTime = formatToMinutes(formattedDifferenceFulfilling)
		let asdf = formattedFulfillingTime.replace(
			/[ минут[\] минуты[\] минута]/gm,
			null
		)
		let formattedFulfillingTimeForAverage = parseInt(asdf)

		Context[7].allFulfillingTimes.push(formattedFulfillingTimeForAverage)

		fulfillingTimeIncrement++
		let key = 'Отработка' + fulfillingTimeIncrement

		const fulfillingTimeElement = {
			[key]: formattedFulfillingTime,
		}

		Context[6].fulfillingTimeElements.push(fulfillingTimeElement)

		Context[8].endings.push(end)
		selections('end') = end
		console.log('Итог сделки:', end)

		const attempt = selections('attempt')

		const message = `Валютная пара: *${currencyPair}*\nПопытка: *${
			attempt
		}*\nИтог сделки: *${selections('end')}* ${
			description !== ''
				? `\n\n*${'Описание:'}*\n${description}`
				: ''
		} ${
			extraInfo('comment') !== ''
				? `\n\n*${'Комментарий:'}*\n_${extraInfo('comment')}_`
				: ''
		}`

		// bot.sendDice(chatId, parseMarkdown)
		bot
			.sendMessage(chatId, `_${'Отправлено в канал:'}_`, parseMarkdown)
			.then(() => {
				if (screenshots.length > 0) {
					const media = screenshots.map((fileId, index) => {
						const mediaOptions = {
							type: 'photo',
							media: fileId,
							parse_mode: 'Markdown',
						}

						if (index === 0) {
							mediaOptions.caption = message
						}
						return mediaOptions
					})

					if (
						end === 'ПЛЮС 🚀' ||
						end === 'ПЛЮС ✅' ||
						end === 'ПЛЮС 💥' ||
						end === 'ПЛЮС ⚡️' ||
						end === 'ПЛЮС ❤️‍🔥'
					) {
						Context[9].plusesGlobal + 1
						Context[9].pluses + 1
					}

					if (end === 'ОТМЕНЕНО 🛠') {
						messageWithTimeout(
							chatId,
							`Тебе отменили сделку. Успокойся и продолжай! :)`,
							optionsWithCreateAndStop,
							500
						)
						Context[9].cancelles + 1
					} else if (
						end === 'МИНУС 💢' &&
						attempt === '2 ПЕРЕКРЫТИЕ'
					) {
						messageWithTimeout(
							chatId,
							`Ты получил минус из-за ошибки. Подумай пару минут, вспомни 3-е правило, подумай над причиной такого исхода и закончи предложение:\n_${'«Я получил минус из-за ...» (Напр.: спешки, невнимательности)'}_`,
							optionsWithStop,
							1000
						)
						hasMinus = true
						setTimeout(() => (hasMinus = false), 21600000)
					} else if (
						end === 'МИНУС ❌' &&
						attempt === '2 ПЕРЕКРЫТИЕ'
					) {
						messageWithTimeout(
							chatId,
							`Ты получил минус из-за рынка. Если ты действительно уверен, что ты не наделал ошибок, то закончи это предложение:\n_${'«Я получил минус из-за ...» (Напр.: спешки, невнимательности, рынка)'}_`,
							optionsWithStop,
							1000
						)
						hasMinus = true
						setTimeout(() => (hasMinus = false), 21600000)
					} else {
						messageWithTimeout(
							chatId,
							`*${`Ушло времени на отработку: ${formattedFulfillingTime}`}*`,
							optionsWithCreateAndStop,
							500
						)
					}

					const channelId = '-1001875103729' // ID of my BO trades channel
					// bot
					// 	.sendMediaGroup(channelId, media, parseMarkdown)
					// 	.then(() => console.log('Итог опубликован.')) // Send created post to channel
					bot.sendMediaGroup(chatId, media, parseMarkdown).then(() => {
						Context[9].findingTimeIncrement + 1
						Context[9].createCounterGlobal + 1
						Context[9].createCounter + 1
						console.log('Итог создан.')
					})
				} else {
					bot.sendMessage(chatId, `*${'Итог не создан.'}*`, parseMarkdown)
					console.log('Скриншоты не прикреплены.')
				}
			})
	} else {
		bot.answerCallbackQuery(callbackQuery.id, {
			text: 'Корректно выберите итог',
			show_alert: false,
		})
	}
}

module.exports = {
	handleStep4,
}
