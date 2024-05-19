const { bot } = require('.')

const {
	parseMarkdown,
	optionsWithStart,
	optionsWithCreate,
} = require('./parseModeVariables')

const {
	messageWithTimeout,
	formatMilliseconds,
	addMinutes,
	curry,
	sum,
	getValueFromContext,
	updateObjectInContext,
} = require('./utils')

const {
	handleStep4,
	handleStep3,
	handleStep2,
	handleStep1,
} = require('./steps')
const { Context } = require('./data')

console.log('Запущено на готовой версии...\n')

const curriedGetValueFromContext = curry(getValueFromContext)

const extraInfo = curriedGetValueFromContext('extraInfo')
const description = extraInfo('description')

const selections = curriedGetValueFromContext('selections')
const currencyPair = selections('currencyPair')

const screenshots = Context[2].screenshots

bot.on('message', callbackQuery => {
	if (callbackQuery.photo) {
		const fileId = callbackQuery.photo[callbackQuery.photo.length - 1].file_id
		const descriptionOfEntry = callbackQuery.caption

		if (description === '' && descriptionOfEntry !== undefined) {
			updateObjectInContext('extraInfo', 'description', descriptionOfEntry)

			setTimeout(() => console.log(`Добавлено описание входа`), 500)
		} else if (description === '' && descriptionOfEntry === '') {
			updateObjectInContext('extraInfo', 'description', '')
		} else if (description !== '' && descriptionOfEntry !== undefined) {
			updateObjectInContext(
				'extraInfo',
				'description',
				(this.key += '\n\n' + descriptionOfEntry)
			)
		}

		screenshots.push(fileId)
		console.log('Получен скриншот, всего скриншотов:', screenshots.length)

		if (screenshots.length > 1 && screenshots.length < 3 && currencyPair) {
			const options = {
				reply_markup: {
					inline_keyboard: [
						[
							{ text: '0️⃣ Основа', callback_data: 'ОСНОВА' },
							{ text: '1️⃣ Перекрытие', callback_data: 'ПЕРЕКРЫТИЕ' },
							{ text: '2️⃣ 2 перекрытие', callback_data: '2 ПЕРЕКРЫТИЕ' },
						],
					],
				},
				parse_mode: 'Markdown',
			}

			bot.sendMessage(
				chatId,
				`*${'Шаг 3: Выберите с какой попытки сделка была закончена'}*\n${'(Можно добавить комментарий)'}`,
				options,
				selections('messageId')
			)
		}
	}
})

const variables = curriedGetValueFromContext('variables')
const hasMinus = variables('hasMinus')

bot.on('message', callbackQuery => {
	const chatId = callbackQuery.chat.id
	const text = callbackQuery.text

	if (
		text &&
		currencyPair !== '' &&
		text !== '/stop' &&
		text !== '/test' &&
		text !== '/help' &&
		text !== '/start' &&
		text !== '/create' &&
		text !== '/statistic' &&
		!text.toLowerCase().includes('невнимательност') &&
		!text.toLowerCase().includes('спешк') &&
		!text.toLowerCase().includes('рын') &&
		!text.toLowerCase().includes('нет') &&
		!text.toLowerCase().includes('да')
	) {
		const comment = callbackQuery.text

		updateObjectInContext('extraInfo', 'comment', comment)
		console.log('Добавлен комментарий')

		bot.sendMessage(chatId, `*${'Комментарий обновлён'}*`, parseMarkdown)
	} else if (hasMinus === true && text.toLowerCase().includes('спешк')) {
		messageWithTimeout(
			chatId,
			`Если ты получил минус из-за спешки, то успокойся. И закончи сессию.`,
			parseMarkdown,
			2000
		)
		messageWithTimeout(chatId, `_${'Закончишь? 🤨'}_`, parseMarkdown, 5000)
	} else if (
		hasMinus === true &&
		text.toLowerCase().includes('невнимательност')
	) {
		messageWithTimeout(
			chatId,
			`Если ты получил минус из-за невнимательности, то тебе нужно *${'закончить сессию ПРЯМО СЕЙЧАС.'}*\n\nНе переживай, завтра повысишь сумму! 😉`,
			parseMarkdown,
			4000
		)
		messageWithTimeout(chatId, `_${'Закончишь? 🙂'}_`, parseMarkdown, 7000)
	} else if (hasMinus === true && text.toLowerCase().includes('рын')) {
		messageWithTimeout(
			chatId,
			`Что же, сегодня рынок решил пойти против тебя, такое бывает и это нормально! Лучше тебе всё-таки пойти отдохнуть, а завтра поднимешь сумму!`,
			parseMarkdown,
			4000
		)
	} else if (
		hasMinus === true &&
		(text.toLowerCase().includes('да') || text.toLowerCase().includes('yes'))
	) {
		messageWithTimeout(
			chatId,
			`Ты сделал ПРАВИЛЬНОЕ решение, молодец! Следование грамотной системе сильно поможет тебе.\n\nСессия закончена, отдохни!`,
			parseMarkdown,
			1000
		)
	} else if (
		hasMinus === true &&
		(text.toLowerCase().includes('нет') || text.toLowerCase().includes('no'))
	) {
		messageWithTimeout(
			chatId,
			`Ты точно наделаешь ошибок, поэтому прошу тебя, ОСТАНОВИ СЕССИЮ. Сохрани свой баланс, нервы и ВРЕМЯ.\n\nНе забывавай, ты можешь поторговать завтра с повышенным объёмом!`,
			parseMarkdown,
			1000
		)
		messageWithTimeout(chatId, `_${'Закончишь? 😕'}_`, parseMarkdown, 5000)
	} else {
		// console.log('хуйня какая-то братик...')
	}
})

// Обработчик команды /start
bot.onText(/\/start/, msg => {
	const chatId = msg.chat.id

	if (hasMinus === false) {
		startTime = new Date()
		// startCounter++
		updateObjectInContext('variables', 'startCounter', +1)
		console.log('Сессия начата!', startTime)

		const rules = `*${'ПРАВИЛА:'}*\n1. Никакой жадности, никаких надежд.\n2. Строгое отношение к рынку.\n_${'Как будто с полицейским разговариваю.'}_\n3. Нельзя беситься. _${'Цитата ниже.'}_\n4. Заполнить бота прежде, чем выражать эмоции.\n5. *${'Цель:'}* всеми силами сохранить как можно больший баланс. _${'Нужно стараться "избежать ДТП".'}_\n\nПо анализу:\n1. В районе десятка свечей от текущей, необходима четкая ОСО с экстремумами.\n2. Если ситуация теряет актуальность – есть право выйти из этой ситуации.\n3. Обновлять границы области.\n\n*${'«Негативные эмоции тормозят процесс размышлений»'}*`

		messageWithTimeout(chatId, rules, optionsWithCreate, 250)
	} else if (hasMinus === true) {
		bot.sendMessage(
			chatId,
			`*${'Ты получил лося, отдохни, расслабься. Ты сейчас ничего не вернёшь, наоборот, только хуже сделаешь. Но сессию ты остановил, молодец!'}*`,
			parseMarkdown
		)
	}
})

const findingTimeElements = Context[3].findingTimeElements
const allFindingTimes = Context[4].allFindingTimes

// Обработчик команды /create
bot.onText(/\/create/, msg => {
	const chatId = msg.chat.id
	// createBtnClicked++
	updateObjectInContext('variables', 'createBtnClicked', +1)
	startFindingTime = new Date()

	if (variables('startCounter') !== 0) {
		handleStep1(msg)

		if (currencyPair !== '' && selections('attempt') === '') {
			findingTimeElements.pop()
			allFindingTimes.pop()
		}

		// selections = {
		// 	currencyPair: '',
		// 	outcome: '',
		// 	attempt: '',
		// 	end: '',
		// 	messageId: null,
		// }
		// extraInfo = {
		// 	comment: '',
		// 	description: '',
		// }
		// screenshots = []

		console.log(`Создание нового итога...`)
	} else if (hasMinus === true) {
		bot.sendMessage(
			chatId,
			`*${'Ты получил лося, отдохни, расслабься. Ты сейчас ничего не вернёшь, наоборот, только хуже сделаешь. Но сессию ты остановил, молодец!'}*`,
			parseMarkdown
		)
	} else {
		bot.sendMessage(
			chatId,
			`*${'Чтобы создать итог, начните сессию командой /start.'}*`,
			parseMarkdown
		)
	}
})

// Обработчик команды /stop
bot.onText(/\/stop/, msg => {
	const chatId = msg.chat.id

	if (variables('startCounter') !== 0) {
		const endTime = new Date()
		const timeDifference = endTime - startTime
		const formattedDifference = formatMilliseconds(timeDifference)

		if (currencyPair !== '' && selections('attempt') === '') {
			allFindingTimes.pop()
			findingTimeElements.pop()
		}

		console.log('Сессия закончена!', new Date())

		let trades = []

		const formattedArray = (arr, i) => {
			const mody = JSON.stringify(arr)
				.replace(/[{}[\]h\/feading[\]'[\]"[\]ul]/gm, '')
				.replace(/,/gm, '\n')
				.replace(/[к][\d][:]/gm, 'к_ ')
				.replace(/[к][\d][\d][:]/gm, 'к_ ')
				.replace(/[а][\d][:]/gm, 'а_ ')
				.replace(/[а][\d][\d][:]/gm, 'а_ ')
				.replace(/[:][П]/gm, 'П')
				.replace(/[:][О]/gm, 'О')
				.replace(/:/gm, '\n')
				.replace(/_/gm, ':')
				.replace(/-/gm, ', ')

			return mody
		}

		const showAllTrades = () => {
			for (let i = 0; i < allFindingTimes.length; i++) {
				let n = i + 1

				const template = {
					heading: `*${
						n + ' сделка' + '_' + ' ' + attempts[i] + '-' + endings[i]
					}*`,
					finding: findingTimeElements[i],
					fulfilling: fulfillingTimeElements[i],
				}
				trades.push(template)
			}
			// return formattedArray(trades, i)
			return formattedArray(trades)
		}

		const avgFinding = sum(allFindingTimes)
		const avgFulfilling = sum(allFulfillingTimes)

		if (
			variables('createCounter') === variables('pluses') &&
			variables('pluses') >= 5
		) {
			setTimeout(() => {
				bot.sendMessage(
					chatId,
					`*${'ИТОГИ СЕССИИ:'}*\nПродолжительность: *${formattedDifference}*\nОпубликовано: *${createCounter}*\nОтработано: *${pluses}*\n${
						variables('createCounter') !== 0
							? showAllTrades()
							: `_${'\nНет ни одного законченного итога. '}_`
					} ${
						avgFinding >= 0
							? `\n\nСреднее время поиска: *${addMinutes(avgFinding, 1)}*`
							: ''
					} ${
						avgFulfilling >= 0
							? `\nСреднее время отработки: *${addMinutes(avgFulfilling, 1)}*`
							: ''
					}\n\n_${'Хорошая получилась сессия!'}_`,
					optionsWithStart
				)
			}, 300)
		} else if (hasMinus === true) {
			setTimeout(() => {
				bot.sendMessage(
					chatId,
					`*${'ИТОГИ СЕССИИ:'}*\nПродолжительность: *${formattedDifference}*\nОпубликовано: *${createCounter}*\nОтработано: *${pluses}*\n${
						createCounter !== 0
							? showAllTrades()
							: `_${'\nНет ни одного законченного итога. '}_`
					} ${
						avgFinding >= 0
							? `\n\nСреднее время поиска: *${addMinutes(avgFinding, 1)}*`
							: ''
					} ${
						avgFulfilling >= 0
							? `\nСреднее время отработки: *${addMinutes(avgFulfilling, 1)}*`
							: ''
					}\n\n_${'Успокойся, не переживай. Ты молодец, ты смог остановиться. Ты на верном пути к избавлению от жадности! Всё обязательно наладиться, только соблюдай систему и будь внимателен!'}_`,
					parseMarkdown
				)
			}, 300)
		} else {
			const templa = `*${'ИТОГИ СЕССИИ:'}*\nПродолжительность: *${formattedDifference}*\nОпубликовано: *${createCounter}*\nОтработано: *${pluses}*\n${
				createCounter !== 0
					? showAllTrades()
					: `_${'\nНет ни одного законченного итога. '}_`
			} ${
				avgFinding >= 0
					? `\n\nСреднее время поиска: *${addMinutes(avgFinding, 1)}*`
					: ''
			} ${
				avgFulfilling >= 0
					? `\nСреднее время отработки: *${addMinutes(avgFulfilling, 1)}*`
					: ''
			}`

			setTimeout(() => {
				bot.sendMessage(chatId, templa, optionsWithStart)
			}, 300)
		}

		setTimeout(() => {
			// pluses = 0
			// startTime = null
			// startCounter = 0
			// createCounter = 0
			// createBtnClicked = 0
			// findingTimeIncrement = 1
			// fulfillingTimeIncrement = 0
			// endings = []
			// attempts = []
			// screenshots = []
			// allFindingTimes = []
			// allFulfillingTimes = []
			// findingTimeElements = []
			// fulfillingTimeElements = []
			// selections = {
			// 	currencyPair: '',
			// 	outcome: '',
			// 	attempt: '',
			// 	end: '',
			// 	messageId: null,
			// }
			// extraInfo = {
			// 	comment: '',
			// 	description: '',
			// }
		}, 1000)
	} else if (hasMinus === true) {
		bot.sendMessage(
			chatId,
			`*${'Сессия уже закончена, подумай почему ты получил минус и отдохни!'}*`,
			parseMarkdown
		)
	} else {
		bot.sendMessage(
			chatId,
			`*${'Чтобы закончить сессию, начните её командой /start.'}*`,
			parseMarkdown
		)
	}
})

// Обработчик команды /help
bot.onText(/\/help/, msg => {
	const chatId = msg.chat.id
	const commands = `*${'КОМАНДЫ:'}*\n/start *${'— Начать сессию'}*\n/create *${'— Создать пост'}*\n/stop *${'— Остановить сессию'}*\n/help *${'— Список команд'}*\n/test *${'— Для тестов'}*\n/statistic *${'— Вся статистика'}*`

	bot.sendMessage(chatId, commands, parseMarkdown)
})

// Обработчик команды /statistic
bot.onText(/\/statistic/, msg => {
	const chatId = msg.chat.id
	const statistic = `*${'СТАТИСТИКА:'}*\nОпубликовано: *${createCounterGlobal}*\nОтработано: *${plusesGlobal}*\nОтменено: *${cancelles}*`

	bot.sendMessage(chatId, statistic, optionsWithStart)
})

bot.on('callback_query', callbackQuery => {
	const selections = getValueFromContext('selections', 'all')
	const step = Object.keys(selections).filter(
		// NOTE: в объекте selections ещё есть ключ "id"
		key => selections[key] === ''
	).length

	if (
		step === 4 &&
		updateObjectInContext('variables', 'startCounter') !== 0 &&
		variables('createBtnClicked') !== 0
	) {
		handleStep2(callbackQuery)
	} else if (step === 3) {
		handleStep3(callbackQuery)
	} else if (step === 2) {
		handleStep4(callbackQuery)
	}
})

bot.on('polling_error', error =>
	console.error('Ошибка при получении обновлений:', error)
)

module.exports = {
	selections,
	extraInfo,
	variables,
	currencyPair,
	description,
	screenshots,
	allFindingTimes,
	findingTimeElements,
}
