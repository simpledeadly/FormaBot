const { Context } = require('./data')

// bot.on('message', callbackQuery => {
// 	if (callbackQuery.photo) {
// 		const fileId = callbackQuery.photo[callbackQuery.photo.length - 1].file_id
// 		const descriptionOfEntry = callbackQuery.caption

// 		if (extraInfo.description === '' && descriptionOfEntry !== undefined) {
// 			// extraInfo.description = descriptionOfEntry
// 			extraInfo.update('description', descriptionOfEntry)

// 			setTimeout(() => console.log(`Добавлено описание входа`), 500)
// 		} else if (extraInfo.description === '' && descriptionOfEntry === '') {
// 			// extraInfo.description = ''
// 			extraInfo.update('description', '')
// 		} else if (
// 			extraInfo.description !== '' &&
// 			descriptionOfEntry !== undefined
// 		) {
// 			// extraInfo.description += '\n\n' + descriptionOfEntry
// 			extraInfo.update('description', (this.key += '\n\n' + descriptionOfEntry))
// 		}

// 		screenshots.protoPush(fileId)
// 		console.log(`Получен скриншот`)

// 		if (
// 			screenshots.length > 1 &&
// 			screenshots.length < 3 &&
// 			selections.currencyPair
// 		) {
// 			const options = {
// 				reply_markup: {
// 					inline_keyboard: [
// 						[
// 							{ text: '0️⃣ Основа', callback_data: 'ОСНОВА' },
// 							{ text: '1️⃣ Перекрытие', callback_data: 'ПЕРЕКРЫТИЕ' },
// 							{ text: '2️⃣ 2 перекрытие', callback_data: '2 ПЕРЕКРЫТИЕ' },
// 						],
// 					],
// 				},
// 				parse_mode: 'Markdown',
// 			}

// 			bot.sendMessage(
// 				chatId,
// 				`*${'Шаг 3: Выберите с какой попытки сделка была закончена'}*\n${'(Можно добавить комментарий)'}`,
// 				options,
// 				selections.messageId
// 			)
// 		}
// 	}
// })

// bot.on('message', callbackQuery => {
// 	const chatId = callbackQuery.chat.id
// 	const text = callbackQuery.text

// 	console.log('лог из второго ифа:', selections)

// 	if (
// 		text &&
// 		selections.currencyPair !== '' &&
// 		text !== '/stop' &&
// 		text !== '/test' &&
// 		text !== '/help' &&
// 		text !== '/start' &&
// 		text !== '/create' &&
// 		text !== '/statistic' &&
// 		!text.toLowerCase().includes('невнимательност') &&
// 		!text.toLowerCase().includes('спешк') &&
// 		!text.toLowerCase().includes('рын') &&
// 		!text.toLowerCase().includes('нет') &&
// 		!text.toLowerCase().includes('да')
// 	) {
// 		const comment = callbackQuery.text

// 		// extraInfo.comment = comment
// 		extraInfo.update('comment', comment)
// 		console.log('Добавлен комментарий')

// 		bot.sendMessage(chatId, `*${'Комментарий обновлён'}*`, parseMarkdown)
// 	} else if (hasMinus === true && text.toLowerCase().includes('спешк')) {
// 		messageWithTimeout(
// 			chatId,
// 			`Если ты получил минус из-за спешки, то успокойся. И закончи сессию.`,
// 			parseMarkdown,
// 			2000
// 		)
// 		messageWithTimeout(chatId, `_${'Закончишь? 🤨'}_`, parseMarkdown, 5000)
// 	} else if (
// 		hasMinus === true &&
// 		text.toLowerCase().includes('невнимательност')
// 	) {
// 		messageWithTimeout(
// 			chatId,
// 			`Если ты получил минус из-за невнимательности, то тебе нужно *${'закончить сессию ПРЯМО СЕЙЧАС.'}*\n\nНе переживай, завтра повысишь сумму! 😉`,
// 			parseMarkdown,
// 			4000
// 		)
// 		messageWithTimeout(chatId, `_${'Закончишь? 🙂'}_`, parseMarkdown, 7000)
// 	} else if (hasMinus === true && text.toLowerCase().includes('рын')) {
// 		messageWithTimeout(
// 			chatId,
// 			`Что же, сегодня рынок решил пойти против тебя, такое бывает и это нормально! Лучше тебе всё-таки пойти отдохнуть, а завтра поднимешь сумму!`,
// 			parseMarkdown,
// 			4000
// 		)
// 	} else if (
// 		hasMinus === true &&
// 		(text.toLowerCase().includes('да') || text.toLowerCase().includes('yes'))
// 	) {
// 		messageWithTimeout(
// 			chatId,
// 			`Ты сделал ПРАВИЛЬНОЕ решение, молодец! Следование грамотной системе сильно поможет тебе.\n\nСессия закончена, отдохни!`,
// 			parseMarkdown,
// 			1000
// 		)
// 	} else if (
// 		hasMinus === true &&
// 		(text.toLowerCase().includes('нет') || text.toLowerCase().includes('no'))
// 	) {
// 		messageWithTimeout(
// 			chatId,
// 			`Ты точно наделаешь ошибок, поэтому прошу тебя, ОСТАНОВИ СЕССИЮ. Сохрани свой баланс, нервы и ВРЕМЯ.\n\nНе забывавай, ты можешь поторговать завтра с повышенным объёмом!`,
// 			parseMarkdown,
// 			1000
// 		)
// 		messageWithTimeout(chatId, `_${'Закончишь? 😕'}_`, parseMarkdown, 5000)
// 	} else {
// 		// console.log('хуйня какая-то братик... | а может нет?')
// 		console.log(Object.prototype.context)
// 	}
// })
