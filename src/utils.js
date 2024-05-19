const { bot } = require('.')
const { Context } = require('./data')

const setToInitial = () => {} // TODO: to clear objs and arrs

const curry = func => {
	return a => {
		return b => {
			return func(a, b)
		}
	}
}

const getValueFromContext = (id, key) => {
	const elem = Context.find(item => item.id === id)

	if (id && key === 'all') {
		return elem
	} else if (id && key) {
		return elem[key]
	} else if (id && !key) {
		return elem[id]
	} else {
		console.log('нет такого ключа')
		return undefined
	}
}

const updateObjectInContext = (id, key, value) => {
	var elem = Context.find(item => item.id === id)
	elem && (elem[key] = value)
}

const pushInContext = (id, value) => {
	var arr = Context.find(item => item.id === id)
	arr.push(value) // TODO
}

const sum = arr => {
	const stepOne = arr.reduce((partialSum, a) => partialSum + a, 0)
	const stepTwo = stepOne / getValueFromContext('allFulfillingTimes').length // TODO

	return stepTwo
}

const messageWithTimeout = (chatId, message, option, timeout) => {
	setTimeout(() => {
		bot.sendMessage(chatId, message, option)
	}, timeout)
}

const roundUp = (num, precision) => {
	precision = Math.pow(10, precision)
	return Math.ceil(num * precision) / precision
}

const findLastSymbol = txt => {
	const lastSymbol = txt.toString().slice(-1)
	return lastSymbol
}

const formatMilliseconds = ms => {
	const hours = Math.floor(ms / (1000 * 60 * 60))
	const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))

	return `${hours} ${'часов'} ${addMinutes(minutes, 0)}`
}

const formatToMinutes = ms => {
	const minutes = Math.floor(ms / 60000)
	let formattedTime = 0

	if (findLastSymbol(minutes) === '1' && minutes !== 11) {
		formattedTime = `${minutes} ${'минута'}`
	} else if (
		(findLastSymbol(minutes) === '2' && minutes !== 12) ||
		(findLastSymbol(minutes) === '3' && minutes !== 13) ||
		(findLastSymbol(minutes) === '4' && minutes !== 14)
	) {
		formattedTime = `${minutes} ${'минуты'}`
	} else {
		formattedTime = `${minutes} ${'минут'}`
	}
	return formattedTime
}

const addMinutes = (mn, precision) => {
	let withMinutes
	const roundedMinutes = roundUp(mn, precision)

	if (findLastSymbol(roundedMinutes) === '1' && roundedMinutes !== 11) {
		withMinutes = `${roundedMinutes} ${'минута'}`
	} else if (
		(findLastSymbol(roundedMinutes) === '2' && roundedMinutes !== 12) ||
		(findLastSymbol(roundedMinutes) === '3' && roundedMinutes !== 13) ||
		(findLastSymbol(roundedMinutes) === '4' && roundedMinutes !== 14)
	) {
		withMinutes = `${roundedMinutes} ${'минуты'}`
	} else {
		withMinutes = `${roundedMinutes} ${'минут'}`
	}
	return withMinutes
}

module.exports = {
	getValueFromContext,
	updateObjectInContext,
	pushInContext,
	curry,
	sum,
	messageWithTimeout,
	roundUp,
	findLastSymbol,
	formatMilliseconds,
	formatToMinutes,
	addMinutes,
}
