const { bot } = require('../')
const {
	formatToMinutes,
	messageWithTimeout,
	updateObjectInContext,
	getValueFromContext,
	curry,
} = require('../utils')
const { parseMarkdown } = require('../parseModeVariables')
const { Context } = require('../data')

const curriedGetValueFromContext = curry(getValueFromContext)
const variables = curriedGetValueFromContext('variables')

const allFindingTimes = Context[4].allFindingTimes
const findingTimeElements = Context[3].findingTimeElements

const handleStep2 = callbackQuery => {
	const chatId = callbackQuery.message.chat.id
	let currencyPair = ''

	const currencyPairs = [
		'AUD/CAD 🇦🇺/🇨🇦',
		'AUD/CHF 🇦🇺/🇨🇭',
		'AUD/JPY 🇦🇺/🇯🇵',
		'AUD/USD 🇦🇺/🇺🇸',
		'CAD/CHF 🇨🇦/🇨🇭',
		'CAD/JPY 🇨🇦/🇯🇵',
		'CHF/JPY 🇨🇭/🇯🇵',
		'EUR/AUD 🇪🇺/🇦🇺',
		'EUR/CAD 🇪🇺/🇨🇦',
		'EUR/CHF 🇪🇺/🇨🇭',
		'EUR/GBP 🇪🇺/🇬🇧',
		'EUR/JPY 🇪🇺/🇯🇵',
		'EUR/USD 🇪🇺/🇺🇸',
		'GBP/AUD 🇬🇧/🇦🇺',
		'GBP/CAD 🇬🇧/🇨🇦',
		'GBP/CHF 🇬🇧/🇨🇭',
		'GBP/JPY 🇬🇧/🇯🇵',
		'GBP/USD 🇬🇧/🇺🇸',
		'USD/CAD 🇺🇸/🇨🇦',
		'USD/CHF 🇺🇸/🇨🇭',
		'USD/JPY 🇺🇸/🇯🇵',
		'USD/CNH 🇺🇸/🇨🇳',
	]

	const check = currencyPairs.includes(callbackQuery.data)

	if (check === true) {
		currencyPair = callbackQuery.data
		updateObjectInContext('selections', 'currencyPair', currencyPair)
		console.log('Валютная пара:', currencyPair)

		let key = 'Поиск' + variables('findingTimeIncrement')
		endFindingTime = new Date() // and start fulfilling the trade.
		const timeDifferenceFinding = endFindingTime - startFindingTime
		const formattedFindingTime = formatToMinutes(timeDifferenceFinding)
		const formatMinutesEnding = formattedFindingTime.replace(
			/[ минут[\] минуты[\] минута]/gm,
			''
		)
		const formattedFindingTimeForAverage = Number(formatMinutesEnding)

		allFindingTimes.push(formattedFindingTimeForAverage)

		const findingTimeElement = {
			[key]: formattedFindingTime,
		}

		findingTimeElements.push(findingTimeElement)

		bot.sendMessage(
			chatId,
			`*${'Ушло времени на поиск: ' + formattedFindingTime}*`,
			parseMarkdown
		)
		messageWithTimeout(
			chatId,
			`*${'Шаг 2: Прикрепите скриншоты'}* ${'(минимум: 2)'}`,
			parseMarkdown,
			250
		)
	} else {
		bot.answerCallbackQuery(callbackQuery.id, {
			text: 'Корректно выберите валютную пару',
			show_alert: false,
		})
	}
}

module.exports = {
	handleStep2,
}
