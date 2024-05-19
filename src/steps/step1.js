const { bot } = require('../')

const handleStep1 = msg => {
	const chatId = msg.chat.id

	const options = {
		reply_markup: {
			inline_keyboard: [
				[
					{ text: '🇦🇺 AUD/CAD 🇨🇦', callback_data: 'AUD/CAD 🇦🇺/🇨🇦' },
					{ text: '🇦🇺 AUD/CHF 🇨🇭', callback_data: 'AUD/CHF 🇦🇺/🇨🇭' },
					{ text: '🇦🇺 AUD/JPY 🇯🇵', callback_data: 'AUD/JPY 🇦🇺/🇯🇵' },
				],
				[
					{ text: '🇦🇺 AUD/USD 🇺🇸', callback_data: 'AUD/USD 🇦🇺/🇺🇸' },
					{ text: '🇨🇦 CAD/CHF 🇨🇭', callback_data: 'CAD/CHF 🇨🇦/🇨🇭' },
					{ text: '🇨🇦 CAD/JPY 🇯🇵', callback_data: 'CAD/JPY 🇨🇦/🇯🇵' },
				],
				[
					{ text: '🇨🇭 CHF/JPY 🇯🇵', callback_data: 'CHF/JPY 🇨🇭/🇯🇵' },
					{ text: '🇪🇺 EUR/AUD 🇦🇺', callback_data: 'EUR/AUD 🇪🇺/🇦🇺' },
					{ text: '🇪🇺 EUR/CAD 🇨🇦', callback_data: 'EUR/CAD 🇪🇺/🇨🇦' },
				],
				[
					{ text: '🇪🇺 EUR/CHF 🇨🇭', callback_data: 'EUR/CHF 🇪🇺/🇨🇭' },
					{ text: '🇪🇺 EUR/GBP 🇬🇧', callback_data: 'EUR/GBP 🇪🇺/🇬🇧' },
					{ text: '🇪🇺 EUR/JPY 🇯🇵', callback_data: 'EUR/JPY 🇪🇺/🇯🇵' },
				],
				[
					{ text: '🇪🇺 EUR/USD 🇺🇸', callback_data: 'EUR/USD 🇪🇺/🇺🇸' },
					{ text: '🇬🇧 GBP/AUD 🇦🇺', callback_data: 'GBP/AUD 🇬🇧/🇦🇺' },
					{ text: '🇬🇧 GBP/CAD 🇨🇦', callback_data: 'GBP/CAD 🇬🇧/🇨🇦' },
				],
				[
					{ text: '🇬🇧 GBP/CHF 🇨🇭', callback_data: 'GBP/CHF 🇬🇧/🇨🇭' },
					{ text: '🇬🇧 GBP/JPY 🇯🇵', callback_data: 'GBP/JPY 🇬🇧/🇯🇵' },
					{ text: '🇬🇧 GBP/USD 🇺🇸', callback_data: 'GBP/USD 🇬🇧/🇺🇸' },
				],
				[
					{ text: '🇺🇸 USD/CAD 🇨🇦', callback_data: 'USD/CAD 🇺🇸/🇨🇦' },
					{ text: '🇺🇸 USD/CHF 🇨🇭', callback_data: 'USD/CHF 🇺🇸/🇨🇭' },
					{ text: '🇺🇸 USD/JPY 🇯🇵', callback_data: 'USD/JPY 🇺🇸/🇯🇵' },
				],
				[{ text: '🇺🇸 USD/CNH 🇨🇳', callback_data: 'USD/CNH 🇺🇸/🇨🇳' }],
			],
		},
		parse_mode: 'Markdown',
	}

	bot.sendMessage(
		chatId,
		`_${'Для того, чтобы добавить итог сделки выполните несколько действий'}_.\n\n*${'Шаг 1: Выберите валютную пару'}*`,
		options
	)
}

module.exports = {
	handleStep1,
}
