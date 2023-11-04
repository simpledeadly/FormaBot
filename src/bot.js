const TelegramBot = require('node-telegram-bot-api')
const token = '6067868221:AAGdT7AdMod-qBEcNaqMk3KSfYSCQm8hnL8'

const {
  parseMarkdown,
  optionsWithStop,
  optionsWithStart,
  optionsWithCreate,
  optionsWithCreateAndStop
} = require('./lib/variables.js')

console.log('Запущено на готовой версии!')

const bot = new TelegramBot(token, { polling: true })

let selections = {
  currencyPair: '',
  outcome: '',
  attempt: '',
  end: '',
  messageId: null
}

let extraInfo = {
  comment: '',
  description: ''
}

let screenshots = []

bot.on('message', callbackQuery => {
  if (callbackQuery.photo) {
    const fileId = callbackQuery.photo[callbackQuery.photo.length - 1].file_id
    const chatId = callbackQuery.chat.id
    const descriptionOfEntry = callbackQuery.caption

    if (extraInfo.description === '' && descriptionOfEntry !== undefined) {
      extraInfo.description = descriptionOfEntry

      setTimeout(() => console.log(`Добавлено описание входа`), 500)
    } else if (extraInfo.description === '' && descriptionOfEntry === '') {
      extraInfo.description = ''
    } else if (extraInfo.description !== '' && descriptionOfEntry !== undefined) {
      extraInfo.description += '\n\n' + descriptionOfEntry
    }

    screenshots.push(fileId)
    console.log(`Получен скриншот`)

    if (screenshots.length > 1 && screenshots.length < 3 && selections.currencyPair) {
      const options = {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '0️⃣ Основа', callback_data: 'ОСНОВА' },
              { text: '1️⃣ Перекрытие', callback_data: 'ПЕРЕКРЫТИЕ' },
              { text: '2️⃣ 2 перекрытие', callback_data: '2 ПЕРЕКРЫТИЕ' }
            ]
          ]
        },
        parse_mode: 'Markdown'
      }
    
      bot.sendMessage(
        chatId,
        `*${'Шаг 3: Выберите с какой попытки сделка была закончена'}*\n${'(Можно добавить комментарий)'}`,
        options,
        selections.messageId
      )
    }
  }
})

const messageWithTimeout = (chatId, message, option, timeout) => {
  setTimeout(() => {
    bot.sendMessage(chatId, message, option)
  }, timeout)
}

bot.on('message', callbackQuery => {
  const chatId = callbackQuery.chat.id
  const text = callbackQuery.text

  if (
    text
    && selections.currencyPair !== ''
    && text !== '/stop'
    && text !== '/test'
    && text !== '/help'
    && text !== '/start'
    && text !== '/create'
    && text !== '/statistic'
    && !text.toLowerCase().includes('невнимательност')
    && !text.toLowerCase().includes('спешк')
    && !text.toLowerCase().includes('рын')
    && !text.toLowerCase().includes('нет')
    && !text.toLowerCase().includes('да')
  ) {
    const comment = callbackQuery.text
    
    extraInfo.comment = comment
    console.log('Добавлен комментарий')

    bot.sendMessage(chatId, `*${'Комментарий обновлён'}*`, parseMarkdown)
  } else if (hasMinus === true && text.toLowerCase().includes('спешк')) {
    messageWithTimeout(chatId, `Если ты получил минус из-за спешки, то успокойся. И закончи сессию.`, parseMarkdown, 2000)
    messageWithTimeout(chatId, `_${'Закончишь? 🤨'}_`, parseMarkdown, 5000)
  } else if (hasMinus === true && text.toLowerCase().includes('невнимательност')) {
    messageWithTimeout(chatId, `Если ты получил минус из-за невнимательности, то тебе нужно *${'закончить сессию ПРЯМО СЕЙЧАС.'}*\n\nНе переживай, завтра повысишь сумму! 😉`, parseMarkdown, 4000)
    messageWithTimeout(chatId, `_${'Закончишь? 🙂'}_`, parseMarkdown, 7000)
  } else if (hasMinus === true && text.toLowerCase().includes('рын')) {
    messageWithTimeout(chatId, `Что же, сегодня рынок решил пойти против тебя, такое бывает и это нормально! Лучше тебе всё-таки пойти отдохнуть, а завтра поднимешь сумму!`, parseMarkdown, 4000)
  } else if (hasMinus === true && (text.toLowerCase().includes('да') || text.toLowerCase().includes('yes'))) {
    messageWithTimeout(chatId, `Ты сделал ПРАВИЛЬНОЕ решение, молодец! Следование грамотной системе сильно поможет тебе.\n\nСессия закончена, отдохни!`, parseMarkdown, 1000)
  } else if (hasMinus === true && (text.toLowerCase().includes('нет') || text.toLowerCase().includes('no'))) {
    messageWithTimeout(chatId, `Ты точно наделаешь ошибок, поэтому прошу тебя, ОСТАНОВИ СЕССИЮ. Сохрани свой баланс, нервы и ВРЕМЯ.\n\nНе забывавай, ты можешь поторговать завтра с повышенным объёмом!`, parseMarkdown, 1000)
    messageWithTimeout(chatId, `_${'Закончишь? 😕'}_`, parseMarkdown, 5000)
  }
})

const handleStep1 = msg => {
  const chatId = msg.chat.id

  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🇦🇺 AUD/CAD 🇨🇦', callback_data: 'AUD/CAD 🇦🇺/🇨🇦' },
          { text: '🇦🇺 AUD/CHF 🇨🇭', callback_data: 'AUD/CHF 🇦🇺/🇨🇭' },
          { text: '🇦🇺 AUD/JPY 🇯🇵', callback_data: 'AUD/JPY 🇦🇺/🇯🇵' }
        ],
        [
          { text: '🇦🇺 AUD/USD 🇺🇸', callback_data: 'AUD/USD 🇦🇺/🇺🇸' },
          { text: '🇨🇦 CAD/CHF 🇨🇭', callback_data: 'CAD/CHF 🇨🇦/🇨🇭' },
          { text: '🇨🇦 CAD/JPY 🇯🇵', callback_data: 'CAD/JPY 🇨🇦/🇯🇵' }
        ],
        [
          { text: '🇨🇭 CHF/JPY 🇯🇵', callback_data: 'CHF/JPY 🇨🇭/🇯🇵' },
          { text: '🇪🇺 EUR/AUD 🇦🇺', callback_data: 'EUR/AUD 🇪🇺/🇦🇺' },
          { text: '🇪🇺 EUR/CAD 🇨🇦', callback_data: 'EUR/CAD 🇪🇺/🇨🇦' }
        ],
        [
          { text: '🇪🇺 EUR/CHF 🇨🇭', callback_data: 'EUR/CHF 🇪🇺/🇨🇭' },
          { text: '🇪🇺 EUR/GBP 🇬🇧', callback_data: 'EUR/GBP 🇪🇺/🇬🇧' },
          { text: '🇪🇺 EUR/JPY 🇯🇵', callback_data: 'EUR/JPY 🇪🇺/🇯🇵' }
        ],
        [
          { text: '🇪🇺 EUR/USD 🇺🇸', callback_data: 'EUR/USD 🇪🇺/🇺🇸' },
          { text: '🇬🇧 GBP/AUD 🇦🇺', callback_data: 'GBP/AUD 🇬🇧/🇦🇺' },
          { text: '🇬🇧 GBP/CAD 🇨🇦', callback_data: 'GBP/CAD 🇬🇧/🇨🇦' }
        ],
        [
          { text: '🇬🇧 GBP/CHF 🇨🇭', callback_data: 'GBP/CHF 🇬🇧/🇨🇭' },
          { text: '🇬🇧 GBP/JPY 🇯🇵', callback_data: 'GBP/JPY 🇬🇧/🇯🇵' },
          { text: '🇬🇧 GBP/USD 🇺🇸', callback_data: 'GBP/USD 🇬🇧/🇺🇸' }
        ],
        [
          { text: '🇺🇸 USD/CAD 🇨🇦', callback_data: 'USD/CAD 🇺🇸/🇨🇦' },
          { text: '🇺🇸 USD/CHF 🇨🇭', callback_data: 'USD/CHF 🇺🇸/🇨🇭' },
          { text: '🇺🇸 USD/JPY 🇯🇵', callback_data: 'USD/JPY 🇺🇸/🇯🇵' }
        ],
        [{ text: '🇺🇸 USD/CNH 🇨🇳', callback_data: 'USD/CNH 🇺🇸/🇨🇳' }]
      ]
    },
    parse_mode: 'Markdown'
  }

  bot.sendMessage(
    chatId,
    `_${'Для того, чтобы добавить итог сделки выполните несколько действий'}_.\n\n*${'Шаг 1: Выберите валютную пару'}*`,
    options
  )
}

let findingTimeIncrement = 1
let findingTimeElements = []
let allFindingTimes = []

const handleStep2 = callbackQuery => {
  const chatId = callbackQuery.message.chat.id
  let currencyPair = ''
  
  let currencyPairs = [
    'AUD/CAD 🇦🇺/🇨🇦', 'AUD/CHF 🇦🇺/🇨🇭', 'AUD/JPY 🇦🇺/🇯🇵',
    'AUD/USD 🇦🇺/🇺🇸', 'CAD/CHF 🇨🇦/🇨🇭', 'CAD/JPY 🇨🇦/🇯🇵',
    'CHF/JPY 🇨🇭/🇯🇵', 'EUR/AUD 🇪🇺/🇦🇺', 'EUR/CAD 🇪🇺/🇨🇦',
    'EUR/CHF 🇪🇺/🇨🇭', 'EUR/GBP 🇪🇺/🇬🇧', 'EUR/JPY 🇪🇺/🇯🇵',
    'EUR/USD 🇪🇺/🇺🇸', 'GBP/AUD 🇬🇧/🇦🇺', 'GBP/CAD 🇬🇧/🇨🇦',
    'GBP/CHF 🇬🇧/🇨🇭', 'GBP/JPY 🇬🇧/🇯🇵', 'GBP/USD 🇬🇧/🇺🇸',
    'USD/CAD 🇺🇸/🇨🇦', 'USD/CHF 🇺🇸/🇨🇭', 'USD/JPY 🇺🇸/🇯🇵',
    'USD/CNH 🇺🇸/🇨🇳'
  ]
  
  const check = currencyPairs.includes(callbackQuery.data)

  if (check === true) {
    currencyPair = callbackQuery.data
    selections.currencyPair = currencyPair
    console.log('Валютная пара:', currencyPair)

    let key = 'Поиск' + findingTimeIncrement
    endFindingTime = new Date() // and start fulfilling the trade.
    const timeDifferenceFinding = endFindingTime - startFindingTime
    const formattedFindingTime = formatToMinutes(timeDifferenceFinding)
    const formatMinutesEnding = formattedFindingTime.replace(/[ минут[\] минуты[\] минута]/gm, '')
    const formattedFindingTimeForAverage = Number(formatMinutesEnding)

    allFindingTimes.push(formattedFindingTimeForAverage)

    const findingTimeElement = {
      [key]: formattedFindingTime
    }

    findingTimeElements.push(findingTimeElement)

    bot.sendMessage(chatId, `*${'Ушло времени на поиск: ' + formattedFindingTime }*`, parseMarkdown)
    messageWithTimeout(chatId, `*${'Шаг 2: Прикрепите скриншоты'}* ${'(минимум: 2)'}`, parseMarkdown, 250)
  } else {
    bot.answerCallbackQuery(callbackQuery.id, { text: 'Корректно выберите валютную пару', show_alert: false })
  }
}

let attempts = []

const handleStep3 = callbackQuery => {
  const chatId = callbackQuery.message.chat.id
  let attempt = ''

  const attemptsArray = ['ОСНОВА', 'ПЕРЕКРЫТИЕ', '2 ПЕРЕКРЫТИЕ']

  const check = attemptsArray.includes(callbackQuery.data)

  if (check === true) {
    attempt = callbackQuery.data
    attempts.push(attempt)
    selections.attempt = attempt
    console.log('Попытка:', attempt)

    const options = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🚫 Пропустил', callback_data: 'ПРОПУЩЕНО 🚫' },
            { text: '🛠 Отменили', callback_data: 'ОТМЕНЕНО 🛠' },
            { text: '⚡️ Импульс', callback_data: 'ПЛЮС ⚡️' }
          ],
          [
            { text: '💢 Ошибся', callback_data: 'МИНУС 💢' },
            { text: '❌ Рынок', callback_data: 'МИНУС ❌' },
            { text: '💥 Вау', callback_data: 'ПЛЮС 💥' }
          ],
          [
            { text: '♻️ Возврат', callback_data: 'ВОЗВРАТ ♻️' },
            { text: '✅ Плюс', callback_data: 'ПЛЮС ✅' },
            { text: '🚀 Уверенно', callback_data: 'ПЛЮС 🚀' }
          ]
        ]
      },
      parse_mode: 'Markdown'
    }
    bot.sendMessage(chatId, `*${'Шаг 4: Выберите итог сделки'}*`, options)
  } else if (screenshots.length < 2) {
    bot.answerCallbackQuery(callbackQuery.id, { text: 'Добавьте как минимум 2 скриншота', show_alert: false })
  } else {
    bot.answerCallbackQuery(callbackQuery.id, { text: 'Корректно выберите попытку', show_alert: false })
  }
}

let hasMinus = false
let pluses = 0

let fulfillingTimeIncrement = 0
let fulfillingTimeElements = []

let allFulfillingTimes = []

let endings = []

const handleStep4 = callbackQuery => {
  const chatId = callbackQuery.message.chat.id
  let end = ''

  const endingsArray = ['ПРОПУЩЕНО 🚫', 'ОТМЕНЕНО 🛠', 'ПЛЮС ⚡️', 'МИНУС 💢', 'МИНУС ❌', 'ПЛЮС 💥', 'ВОЗВРАТ ♻️', 'ПЛЮС ✅', 'ПЛЮС 🚀']

  const check = endingsArray.includes(callbackQuery.data)

  if (check === true) {
    end = callbackQuery.data
    selections.end = end

    endFulfilling = new Date()
    const formattedDifferenceFulfilling = endFulfilling - endFindingTime
    let formattedFulfillingTime = formatToMinutes(formattedDifferenceFulfilling)
    let asdf = formattedFulfillingTime.replace(/[ минут[\] минуты[\] минута]/gm, null)
    let formattedFulfillingTimeForAverage = parseInt(asdf)

    allFulfillingTimes.push(formattedFulfillingTimeForAverage)

    fulfillingTimeIncrement++
    let key = 'Отработка' + fulfillingTimeIncrement

    const fulfillingTimeElement = {
      [key]: formattedFulfillingTime
    }

    fulfillingTimeElements.push(fulfillingTimeElement)

    endings.push(end)
    selections.end = end
    console.log('Итог сделки:', end)
    
    const message = `Валютная пара: *${ selections.currencyPair }*\nПопытка: *${ selections.attempt }*\nИтог сделки: *${ selections.end }* ${ extraInfo.description !== '' ? `\n\n*${'Описание:'}*\n${ extraInfo.description }` : '' } ${ extraInfo.comment !== '' ? `\n\n*${'Комментарий:'}*\n_${ extraInfo.comment }_` : '' }`

    // bot.sendDice(chatId, parseMarkdown)
    bot.sendMessage(chatId, `_${'Отправлено в канал:'}_`, parseMarkdown).then(() => {
      if (screenshots.length > 0) {
        const media = screenshots.map((fileId, index) => {
          const mediaOptions = {
            type: 'photo',
            media: fileId,
            parse_mode: 'Markdown'
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
          plusesGlobal++
          pluses++
        }

        if (end === 'ОТМЕНЕНО 🛠') {
          messageWithTimeout(chatId, `Тебе отменили сделку. Успокойся и продолжай! :)`, optionsWithCreateAndStop, 500)
          cancelles++
        } else if (end === 'МИНУС 💢' && selections.attempt === '2 ПЕРЕКРЫТИЕ') {
          messageWithTimeout(chatId, `Ты получил минус из-за ошибки. Подумай пару минут, вспомни 3-е правило, подумай над причиной такого исхода и закончи предложение:\n_${'«Я получил минус из-за ...» (Напр.: спешки, невнимательности)'}_`, optionsWithStop, 1000)
          hasMinus = true
          setTimeout(() => hasMinus = false, 21600000)
        } else if (end === 'МИНУС ❌' && selections.attempt === '2 ПЕРЕКРЫТИЕ') {
          messageWithTimeout(chatId, `Ты получил минус из-за рынка. Если ты действительно уверен, что ты не наделал ошибок, то закончи это предложение:\n_${'«Я получил минус из-за ...» (Напр.: спешки, невнимательности, рынка)'}_`, optionsWithStop, 1000)
          hasMinus = true
          setTimeout(() => hasMinus = false, 21600000)
        } else if (selections.attempt !== 'ОСНОВА') {
          messageWithTimeout(chatId, `*${`Ушло времени на отработку: ${ formattedFulfillingTime }`}*`, optionsWithCreateAndStop, 500)
        } else {
          messageWithTimeout(chatId, `*${'Нажмите кнопки, под клавиатурой'}*`, optionsWithCreateAndStop, 500)
        }

        const channelId = '-1001875103729' // ID of my BO trades channel
        bot.sendMediaGroup(channelId, media, parseMarkdown).then(() => console.log('Итог опубликован.')) // Send created post to channel
        bot.sendMediaGroup(chatId, media, parseMarkdown).then(() => {
          findingTimeIncrement++
          createCounterGlobal++
          createCounter++
          console.log('Итог создан.')
        })
      } else {
        bot.sendMessage(chatId, `*${'Итог не создан.'}*`, parseMarkdown)
        console.log('Скриншоты не прикреплены.')
      }
    })
  } else {
    bot.answerCallbackQuery(callbackQuery.id, { text: 'Корректно выберите итог', show_alert: false })
  }
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

  return `${ hours } ${'часов'} ${ addMinutes(minutes, 0) }`
}

const formatToMinutes = ms => {
  const minutes = Math.floor(ms / 60000)
  let formattedTime = 0

  if (findLastSymbol(minutes) === '1' && minutes !== 11) {
    formattedTime = `${ minutes } ${'минута'}`
  } else if ((findLastSymbol(minutes) === '2' && minutes !== 12) || (findLastSymbol(minutes) === '3' && minutes !== 13) || findLastSymbol(minutes) === '4' && minutes !== 14) {
    formattedTime = `${ minutes } ${'минуты'}`
  } else {
    formattedTime = `${ minutes } ${'минут'}`
  }
  return formattedTime
}

const addMinutes = (mn, precision) => {
  let withMinutes
  const roundedMinutes = roundUp(mn, precision)
  
  if (findLastSymbol(roundedMinutes) === '1' && roundedMinutes !== 11) {
    withMinutes = `${ roundedMinutes } ${'минута'}`
  } else if ((findLastSymbol(roundedMinutes) === '2' && roundedMinutes !== 12) || (findLastSymbol(roundedMinutes) === '3' && roundedMinutes !== 13) || findLastSymbol(roundedMinutes) === '4' && roundedMinutes !== 14) {
    withMinutes = `${ roundedMinutes } ${'минуты'}`
  } else {
    withMinutes = `${ roundedMinutes } ${'минут'}`
  }
  return withMinutes
}

let startCounter = 0

// Обработчик команды /start
bot.onText(/\/start/, msg => {
  const chatId = msg.chat.id

  if (hasMinus === false) {
    startTime = new Date()
    startCounter++
    console.log('Сессия начата!', startTime)
  
    const rules = `*${'ПРАВИЛА:'}*\n1. Никакой жадности, никаких надежд.\n2. Строгое отношение к рынку.\n_${'Как будто с полицейским разговариваю.'}_\n3. Нельзя беситься. _${'Цитата ниже.'}_\n4. Заполнить бота прежде, чем выражать эмоции.\n5. *${'Цель:'}* всеми силами сохранить как можно больший баланс. _${'Нужно стараться "избежать ДТП".'}_\n\nПо анализу:\n1. В районе десятка свечей от текущей, необходима четкая ОСО с экстремумами.\n2. Если ситуация теряет актуальность – есть право выйти из этой ситуации.\n3. Обновлять границы области.\n\n*${'«Негативные эмоции тормозят процесс размышлений»'}*`

    messageWithTimeout(chatId, rules, optionsWithCreate, 250)
  } else if (hasMinus === true) {
    bot.sendMessage(chatId, `*${'Ты получил лося, отдохни, расслабься. Ты сейчас ничего не вернёшь, наоборот, только хуже сделаешь. Но сессию ты остановил, молодец!'}*`, parseMarkdown)
  }
})

let createCounter = 0
let createBtnClicked = 0

// Обработчик команды /create
bot.onText(/\/create/, msg => {
  const chatId = msg.chat.id
  createBtnClicked++
  startFindingTime = new Date()

  if (startCounter !== 0) {
    handleStep1(msg)

    if (selections.currencyPair !== '' && selections.attempt === '') {
      allFindingTimes.pop()
      findingTimeElements.pop()
    }

    selections = {
      currencyPair: '',
      outcome: '',
      attempt: '',
      end: '',
      messageId: null
    }
    extraInfo = {
      comment: '',
      description: ''
    }
    screenshots = []

    console.log(`Создание нового итога...`)
  } else if (hasMinus === true) {
    bot.sendMessage(chatId, `*${'Ты получил лося, отдохни, расслабься. Ты сейчас ничего не вернёшь, наоборот, только хуже сделаешь. Но сессию ты остановил, молодец!'}*`, parseMarkdown)
  } else {
    bot.sendMessage(chatId, `*${'Чтобы создать итог, начните сессию командой /start.'}*`, parseMarkdown)
  }
})

// Обработчик команды /stop
bot.onText(/\/stop/, msg => {
  const chatId = msg.chat.id
  
  if (startCounter !== 0) {
    const endTime = new Date()
    const timeDifference = endTime - startTime
    const formattedDifference = formatMilliseconds(timeDifference)

    if (selections.currencyPair !== '' && selections.attempt === '') {
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
          heading: `*${ n + ' сделка' + '_' + ' ' + attempts[i] + '-' + endings[i] }*`,
          finding: findingTimeElements[i],
          fulfilling: fulfillingTimeElements[i]
        }
        trades.push(template)
      }
      // return formattedArray(trades, i)
      return formattedArray(trades)
    }

    const sum = arr => {
      const stepOne = arr.reduce((partialSum, a) => partialSum + a, 0)
      const stepTwo = stepOne / allFulfillingTimes.length

      return stepTwo
    }

    const avgFinding = sum(allFindingTimes)
    const avgFulfilling = sum(allFulfillingTimes)
    
    if (createCounter === pluses && pluses >= 5) {
      setTimeout(() => {
        bot.sendMessage(chatId, `*${'ИТОГИ СЕССИИ:'}*\nПродолжительность: *${ formattedDifference }*\nОпубликовано: *${ createCounter }*\nОтработано: *${ pluses }*\n${ createCounter !== 0 ? showAllTrades() : `_${ '\nНет ни одного законченного итога. '}_` } ${ avgFinding >= 0 ? `\n\nСреднее время поиска: *${ addMinutes(avgFinding, 1) }*` : '' } ${ avgFulfilling >= 0 ? `\nСреднее время отработки: *${ addMinutes(avgFulfilling, 1) }*` : '' }\n\n_${'Хорошая получилась сессия!'}_`, optionsWithStart)
      }, 300)
    } else if (hasMinus === true) {
      setTimeout(() => {
        bot.sendMessage(chatId, `*${'ИТОГИ СЕССИИ:'}*\nПродолжительность: *${ formattedDifference }*\nОпубликовано: *${ createCounter }*\nОтработано: *${ pluses }*\n${ createCounter !== 0 ? showAllTrades() : `_${ '\nНет ни одного законченного итога. '}_` } ${ avgFinding >= 0 ? `\n\nСреднее время поиска: *${ addMinutes(avgFinding, 1) }*` : '' } ${ avgFulfilling >= 0 ? `\nСреднее время отработки: *${ addMinutes(avgFulfilling, 1) }*` : '' }\n\n_${'Успокойся, не переживай. Ты молодец, ты смог остановиться. Ты на верном пути к избавлению от жадности! Всё обязательно наладиться, только соблюдай систему и будь внимателен!'}_`, parseMarkdown)
      }, 300)
    } else {
      const templa = `*${'ИТОГИ СЕССИИ:'}*\nПродолжительность: *${ formattedDifference }*\nОпубликовано: *${ createCounter }*\nОтработано: *${ pluses }*\n${ createCounter !== 0 ? showAllTrades() : `_${ '\nНет ни одного законченного итога. '}_` } ${ avgFinding >= 0 ? `\n\nСреднее время поиска: *${ addMinutes(avgFinding, 1) }*` : '' } ${ avgFulfilling >= 0 ? `\nСреднее время отработки: *${ addMinutes(avgFulfilling, 1) }*` : '' }`

      setTimeout(() => {
        bot.sendMessage(chatId, templa, optionsWithStart)
      }, 300)
    }

    setTimeout(() => {
      pluses = 0
      startTime = null
      startCounter = 0
      createCounter = 0
      createBtnClicked = 0
      findingTimeIncrement = 1
      fulfillingTimeIncrement = 0
      endings = []
      attempts = []
      screenshots = []
      allFindingTimes = []
      allFulfillingTimes = []
      findingTimeElements = []
      fulfillingTimeElements = []

      selections = {
        currencyPair: '',
        outcome: '',
        attempt: '',
        end: '',
        messageId: null
      }
      extraInfo = {
        comment: '',
        description: ''
      }
    }, 1000)
  } else if (hasMinus === true) {
    bot.sendMessage(chatId, `*${'Сессия уже закончена, подумай почему ты получил минус и отдохни!'}*`, parseMarkdown)
  } else {
    bot.sendMessage(chatId, `*${'Чтобы закончить сессию, начните её командой /start.'}*`, parseMarkdown)
  }
})

// Обработчик команды /help
bot.onText(/\/help/, msg => {
  const chatId = msg.chat.id
  const commands = `*${'КОМАНДЫ:'}*\n/start *${'— Начать сессию'}*\n/create *${'— Создать пост'}*\n/stop *${'— Остановить сессию'}*\n/help *${'— Список команд'}*\n/test *${'— Для тестов'}*\n/statistic *${'— Вся статистика'}*`
  
  bot.sendMessage(chatId, commands, parseMarkdown)
})

let createCounterGlobal = 0
let plusesGlobal = 0
let cancelles = 0

// Обработчик команды /statistic
bot.onText(/\/statistic/, msg => {
  const chatId = msg.chat.id
  const statistic = `*${'СТАТИСТИКА:'}*\nОпубликовано: *${ createCounterGlobal }*\nОтработано: *${ plusesGlobal }*\nОтменено: *${ cancelles }*`

  bot.sendMessage(chatId, statistic, optionsWithStart)
})

bot.on('callback_query', callbackQuery => {
  const step = Object.keys(selections).filter(key => selections[key] === '').length

  if (step === 4 && startCounter !== 0 && createBtnClicked !== 0) {
    handleStep2(callbackQuery)
  } else if (step === 3) {
    handleStep3(callbackQuery)
  } else if (step === 2) {
    handleStep4(callbackQuery)
  }
})

bot.on('polling_error', error => console.error('Ошибка при получении обновлений:', error))