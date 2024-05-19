const Context = (Object.prototype.context = [
	{
		id: 'selections',
		currencyPair: '',
		outcome: '',
		attempt: '',
		end: '',
		messageId: null,
	},
	{
		id: 'extraInfo',
		comment: '',
		description: '',
	},
	{
		id: 'screenshots',
		screenshots: [],
	},
	{
		id: 'findingTimeElements',
		findingTimeElements: [],
	},
	{
		id: 'allFindingTimes',
		allFindingTimes: [],
	},
	{
		id: 'attempts',
		attempts: [],
	},
	{
		id: 'fulfillingTimeElements',
		fulfillingTimeElements: [],
	},
	{
		id: 'allFulfillingTimes',
		allFulfillingTimes: [],
	},
	{
		id: 'endings',
		endings: [],
	},
	{
		id: 'variables',
		hasMinus: false,
		pluses: 0,
		cancelles: 0,
		plusesGlobal: 0,
		startCounter: 0,
		createCounter: 0,
		createBtnClicked: 0,
		createCounterGlobal: 0,
		findingTimeIncrement: 1,
		fulfillingTimeIncrement: 0,
	},
])

const getValueFromContext = (id, key) => {
	const elem = Object.prototype.context.find(item => item.id === id)

	if (id && key) {
		return elem[key]
	} else if (id && !key) {
		return elem[id]
	} else {
		console.log('нет такого ключа бля')
		return undefined
	}
}

module.exports = {
	Context,
}
