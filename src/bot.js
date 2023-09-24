const TelegramBot = require('node-telegram-bot-api');
const token = '6067868221:AAGdT7AdMod-qBEcNaqMk3KSfYSCQm8hnL8';

const {
  parseMarkdown,
  optionsWithStop,
  optionsWithStart,
  optionsWithCreate,
  optionsWithStatistic,
  optionsWithCreateAndStop
} = require('./lib/variables.js');

console.log('Запущено!')

const bot = new TelegramBot(token, { polling: true });

let selections = {
  currencyPair: '',
  outcome: '',
  attempt: '',
  end: '',
  messageId: null
};

let sele = {
  comment: '',
  description: ''
};

let screenshots = [];

bot.on('message', (callbackQuery) => {
  if (callbackQuery.photo) {
    const fileId = callbackQuery.photo[callbackQuery.photo.length - 1].file_id;
    const chatId = callbackQuery.chat.id;
    const descriptionOfEntry = callbackQuery.caption;

    if (sele.description === '' && descriptionOfEntry !== undefined) {
      sele.description = descriptionOfEntry;

      setTimeout(() => console.log(`Описание входа: ${ descriptionOfEntry }`), 500);
    } else if (sele.description === '' && descriptionOfEntry === '') {
      sele.description = '';
    };
    
    screenshots.push(fileId);
    console.log(`Скриншот сохранен: ${ fileId }`);

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
      };
  
      bot.sendMessage(
        chatId,
        `*${'Шаг 3: Выберите с какой попытки сделка была закончена'}*\n${'(Можно добавить комментарий)'}`,
        options,
        selections.messageId
      );
    } else {}
  } else {}
});

bot.on('message', (callbackQuery) => {
  const chatId = callbackQuery.chat.id;

  if (
    callbackQuery.text
    && selections.currencyPair !== ''
    && callbackQuery.text !== '/start'
    && callbackQuery.text !== '/stop'
    && callbackQuery.text !== '/create'
    && callbackQuery.text !== '/help'
    && callbackQuery.text !== '/test'
    && callbackQuery.text !== '/statistic'
    ) {
    const comment = callbackQuery.text;
    
    sele.comment = comment;
    console.log('Комментарий:', comment);

    bot.sendMessage(chatId, `*${'Комментарий обновлён'}*`, parseMarkdown);
  }

  const mistake1 = 'Я получил минус из-за спешки.'
  const mistake2 = 'Я получил минус из-за невнимательности.'
  const immistake1 = 'Я получил минус из-за рынка.'

  if (callbackQuery.text === mistake1) {
    const chatId = callbackQuery.chat.id;
    setTimeout(() =>
      bot.sendMessage(
        chatId,
        `Если ты получил минус из-за спешки, то успокойся. И закончи сессию.`,
        parseMarkdown
      ), 2000
    );
    
    setTimeout(() =>
      bot.sendMessage(
        chatId,
        `_${'Закончишь? 🤨'}_`,
        parseMarkdown
      ), 5000
    );
  } else if (callbackQuery.text === mistake2) {
    const chatId = callbackQuery.chat.id;

    setTimeout(() =>
      bot.sendMessage(
        chatId,
        `Если ты получил минус из-за невнимательности, то тебе нужно *${'закончить сессию ПРЯМО СЕЙЧАС.'}*\n\nНе переживай, завтра повысишь сумму! 😉`,
        parseMarkdown
      ), 4000
    );

    setTimeout(() =>
      bot.sendMessage(
        chatId,
        `_${'Закончишь? 🙂'}_`,
        parseMarkdown
      ), 7000
    );
  } else if (callbackQuery.text === immistake1) {
    const chatId = callbackQuery.chat.id;

    setTimeout(() =>
      bot.sendMessage(
        chatId,
        `Что же, сегодня рынок решил пойти против тебя, такое бывает и это нормально! Лучше тебе всё-таки пойти отдохнуть, а завтра поднимешь сумму!`,
        parseMarkdown
      ), 4000
    );
  } else if (callbackQuery.text === 'yes' || callbackQuery.text === 'да') {
    setTimeout(() =>
      bot.sendMessage(
        chatId,
        `Ты сделал ПРАВИЛЬНОЕ решение, молодец! Следование грамотной системе сильно поможет тебе.\n\nСессия закончена, отдохни!`,
        parseMarkdown
      ), 1000
    );
  } else if (callbackQuery.text === 'no' || callbackQuery.text === 'нет') {
    setTimeout(() =>
      bot.sendMessage(
        chatId,
        `Ты точно наделаешь ошибок, поэтому прошу тебя, ОСТАНОВИ СЕССИЮ. Сохрани свой баланс, нервы и ВРЕМЯ.\n\nНе забывавай, ты можешь поторговать завтра с повышенным объёмом!`,
        parseMarkdown
      ), 1000
    );

    setTimeout(() =>
      bot.sendMessage(
        chatId,
        `_${'Закончишь? 😕'}_`,
        parseMarkdown
      ), 5000
    );
  }
});

const handleStep1 = (msg) => {
  const chatId = msg.chat.id;

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
  };

  bot.sendMessage(
    chatId,
    `_${'Для того, чтобы добавить итог сделки выполните несколько действий'}_.\n\n*${'Шаг 1: Выберите валютную пару'}*`,
    options
  );
};

var findingTimeIncrement = 1;
var findingTimeElements = [];
var allFindingTimes = [];

const handleStep2 = (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const currencyPair = callbackQuery.data;

  selections.currencyPair = currencyPair;
  console.log('Валютная пара:', currencyPair);

  let key = 'finding' + findingTimeIncrement;

  if (selections.currencyPair !== '') {
    endFindingTime = new Date(); // and start fulfilling the trade.
    const timeDifferenceFinding = endFindingTime - startFindingTime;
    var formattedFindingTime = formatToMinutes(timeDifferenceFinding);

    allFindingTimes.push(formattedFindingTime);
  };

  const findingTimeElement = {
    [key]: formattedFindingTime
  };

  findingTimeElements.push(findingTimeElement);
  console.log('Все элементы нового массива со временем отработки сделки:', findingTimeElements);

  bot.sendMessage(chatId, `*${'Ушло времени на поиск: ' + formattedFindingTime }*`, parseMarkdown);
  setTimeout(() => {
    bot.sendMessage(chatId, `*${'Шаг 2: Прикрепите скриншоты'}* ${'(минимум: 2)'}`, parseMarkdown);
  }, 250)
};

const handleStep3 = (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const attempt = callbackQuery.data;

  selections.attempt = attempt;
  console.log('Попытка:', attempt);

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
          { text: '❤️‍🔥 Повезло', callback_data: 'ПЛЮС ❤️‍🔥' },
          { text: '✅ Плюс', callback_data: 'ПЛЮС ✅' },
          { text: '🚀 Уверенно', callback_data: 'ПЛЮС 🚀' }
        ]
      ]
    },
    parse_mode: 'Markdown'
  };

  bot.sendMessage(
    chatId,
    `*${'Шаг 4: Выберите итог сделки'}*`,
    options
  );
};

let hasMinus = false;
let pluses = 0;

let fulfillingTimeIncrement = 0;
let fulfillingTimeElements = [];

let allFulfillingTimes = [];

const handleStep4 = (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const end = callbackQuery.data;

  endFulfilling = new Date();
  const formattedDifferenceFulfilling = endFulfilling - endFindingTime;
  const formattedFulfillingTime = formatToMinutes(formattedDifferenceFulfilling);

  allFulfillingTimes.push(formattedFulfillingTime);

  fulfillingTimeIncrement++;
  let key = 'fulfilling' + fulfillingTimeIncrement;

  const fulfillingTimeElement = {
    [key]: formattedFulfillingTime
  };

  fulfillingTimeElements.push(fulfillingTimeElement);
  console.log('Все элементы нового массива со временем отработки сделки:', fulfillingTimeElements);

  selections.end = end;
  console.log('Итог сделки:', end);
  
  const message = `Валютная пара: *${ selections.currencyPair }*\nПопытка: *${ selections.attempt }*\nИтог сделки: *${ selections.end }* ${ sele.description !== '' ? `\n\nОписание:\n${ sele.description }` : '' } ${ sele.comment !== '' ? `\n\nКомментарий:\n_${ sele.comment }_` : '' }`;

  bot.sendMessage(chatId, `_${'Отправлено в канал:'}_`, parseMarkdown).then(() => {
    if (screenshots.length > 0) {
      const media = screenshots.map((fileId, index) => {
        const mediaOptions = {
          type: 'photo',
          media: fileId,
          parse_mode: 'Markdown'
        };

        if (index === 0) {
          mediaOptions.caption = message;
        };

        return mediaOptions;
      });

      if (
          end === 'ПЛЮС 🚀' ||
          end === 'ПЛЮС ✅' ||
          end === 'ПЛЮС 💥' ||
          end === 'ПЛЮС ⚡️' ||
          end === 'ПЛЮС ❤️‍🔥'
        ) {
          plusesGlobal++
          pluses++
        };

      if (end === 'ОТМЕНЕНО 🛠') {
        setTimeout(() =>
          bot.sendMessage(
            chatId,
            `Тебе отменили сделку. Успокойся и продолжай! :)`,
            optionsWithCreateAndStop
          ), 500
        );

        cancelles++;
        // findingTimeIncrement++;
        // fulfillingTimeIncrement++;
      };

      if (end === 'МИНУС 💢' && selections.attempt === '2 ПЕРЕКРЫТИЕ') {
        setTimeout(() =>
          bot.sendMessage(
            chatId,
            `Ты получил минус из-за ошибки. Подумай пару минут, вспомни 3-е правило, подумай над причиной такого исхода и закончи предложение:\n_${'«Я получил минус из-за ...» (Напр.: спешки, невнимательности)'}_`,
            optionsWithStop
          ), 1000
        );
        hasMinus = true;

        setTimeout(() => {
          hasMinus = false;
        }, 43200000);
      };
  
      if (end === 'МИНУС ❌' && selections.attempt === '2 ПЕРЕКРЫТИЕ') {
        setTimeout(() =>
          bot.sendMessage(
            chatId,
            `Ты получил минус из-за рынка. Если ты действительно уверен, что ты не наделал ошибок, то закончи это предложение:\n_${'«Я получил минус из-за ...» (Напр.: спешки, невнимательности, рынка)'}_`,
            optionsWithStop
          ), 1000
        );
        hasMinus = true;

        setTimeout(() => {
          hasMinus = false;
        }, 43200000);
      };

      if (selections.attempt !== 'ОСНОВА') {
        setTimeout(() => {
          bot.sendMessage(chatId, `*${`Ушло времени на отработку: ${ formattedFulfillingTime }`}*`, optionsWithCreateAndStop);
        }, 500);
      } else {
        bot.sendMessage(chatId, `*${'Нажмите кнопки, под клавиатурой'}*`, optionsWithCreateAndStop);
      };

      // const channelId = '-1001875103729'; // ID of my BO trades channel
      // bot.sendMediaGroup(channelId, media, options).then(() => console.log('Итог опубликован.')); // Send created post to channel
      bot.sendMediaGroup(chatId, media, parseMarkdown).then(() => {
        findingTimeIncrement++; // for working branch
        createCounterGlobal++;
        createCounter++;

        console.log('Итог создан.');
      });
    } else {
      // allFindingTimes.pop();
      // allFulfillingTimes.pop();
      // findingTimeElements.pop();
      // fulfillingTimeElements.pop();

      bot.sendMessage(chatId, `*${'Итог не создан.'}*`, parseMarkdown);
      console.log('Скриншоты не прикреплены.');
    };
  });
};

function formatMilliseconds(ms) {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

  const formattedTime = `${ hours } ${'часов'} ${ minutes } ${'минут'}`; // добавить определение кол-ва минут, правильно записывать форму слова.

  return formattedTime;
}

function formatToMinutes(ms) {
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  let formattedTime = 0; // добавить определение кол-ва минут, правильно записывать форму слова.

  if (minutes === 1) {
    formattedTime = `${ minutes } ${'минута'}`;
  } else if (minutes === 2 || minutes === 3 || minutes === 4) {
    formattedTime = `${ minutes } ${'минуты'}`;
  } else {
    formattedTime = `${ minutes } ${'минут'}`;
  }

  return formattedTime;
}

let startCounter = 0;

// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  if (hasMinus === false) {
    startTime = new Date();
  
    const rules = `*${'ПРАВИЛА:'}*\n1. Никакой жадности, никаких надежд.\n2. Строгое отношение к рынку.\n_${'Как будто с полицейским разговариваю.'}_\n3. Нельзя беситься. _${'Цитата ниже.'}_\n4. Заполнить бота прежде, чем выражать эмоции.\n5. *${'Цель:'}* всеми силами сохранить как можно больший баланс. _${'Нужно стараться "избежать ДТП".'}_\n\nПо анализу:\n1. В районе десятка свечей от текущей, необходима четкая ОСО с экстремумами.\n2. Если ситуация теряет актуальность – есть право выйти из этой ситуации.\n\n*${'«Негативные эмоции тормозят процесс размышлений»'}*`;
  
    startCounter++;
    console.log('Сессия начата!', startTime);
    
    bot.sendMessage(chatId, `*${'Вы начали сессию.'}*`, parseMarkdown);
    setTimeout(() => {
      bot.sendMessage(chatId, rules, optionsWithCreate);
    }, 250);
  } else if (hasMinus === true) {
    bot.sendMessage(chatId, `*${'Ты получил лося, отдохни, расслабься. Ты сейчас ничего не вернёшь, наоборот, только хуже сделаешь. Но сессию ты остановил, молодец!'}*`, parseMarkdown);
  };
});

let createCounter = 0;

// Обработчик команды /create
bot.onText(/\/create/, (msg) => {
  const chatId = msg.chat.id;
  startFindingTime = new Date();
  // findingTimeIncrement++; // for dev branch

  if (startCounter !== 0) {
    handleStep1(msg);

    if (selections.currencyPair !== '' && selections.attempt === '') {
      allFindingTimes.pop();
      findingTimeElements.pop();
  
      console.log('Ну, должно быть на один меньше...', findingTimeElements);
    };

    selections = {
      currencyPair: '',
      outcome: '',
      attempt: '',
      end: '',
      messageId: null
    };
    sele = {
      comment: '',
      description: ''
    };
    screenshots = [];

    console.log(`Создание нового итога...`);
  } else if (hasMinus === true) {
    bot.sendMessage(chatId, `*${'Ты получил лося, отдохни, расслабься. Ты сейчас ничего не вернёшь, наоборот, только хуже сделаешь. Но сессию ты остановил, молодец!'}*`, parseMarkdown);
  } else {
    bot.sendMessage(chatId, `*${'Чтобы создать итог, начните сессию командой /start.'}*`, parseMarkdown);
  };
});

// Обработчик команды /stop
bot.onText(/\/stop/, (msg) => {
  const chatId = msg.chat.id;
  
  if (startCounter !== 0) {
    const endTime = new Date();
    const timeDifference = endTime - startTime;
    const formattedDifference = formatMilliseconds(timeDifference)

    if (selections.currencyPair !== '' && selections.attempt === '') {
      allFindingTimes.pop();
      findingTimeElements.pop();
  
      console.log('Ну, должно быть на один меньше...', findingTimeElements);
    };

    console.log('Сессия закончена!', new Date());

    // С помощью этой функции можно дополнять информацию по итогу сделки в итоговой статистике (стата после "/stop").
    const formattedArrayWithExtraInfo = (arr) => {
      // if () {};
      
      const modifiedViewOfArray = JSON.stringify(arr).replace(/[\[\]{}[\]"[\]finding[\]fulfilling]/gm, '').replace(/:/gm, ': ').replace(/,/gm, '\n');
      
      return modifiedViewOfArray;
    };

    const checking = () => {

    };
    
    if (createCounter === pluses && pluses >= 5) {
      setTimeout(() => {
        bot.sendMessage(chatId, `*${'ИТОГИ СЕССИИ:'}*\nПродолжительность: *${ formattedDifference }*\nОпубликовано: *${ createCounter }*\nОтработано: *${ pluses }*\n\nВремя поиска входа:\n*${ formattedArrayWithExtraInfo(findingTimeElements) }*\n\nВремя отработки входа:\n*${ formattedArrayWithExtraInfo(fulfillingTimeElements) }*\n\nХорошая получилась сессия!`, optionsWithStatistic);
      }, 250);
    } else if (hasMinus === true) {
      setTimeout(() => {
        bot.sendMessage(chatId, `*${'ИТОГИ СЕССИИ:'}*\nПродолжительность: *${ formattedDifference }*\nОпубликовано: *${ createCounter }*\nОтработано: *${ pluses }*\n\nВремя поиска входа:\n*${ formattedArrayWithExtraInfo(findingTimeElements) }*\n\nВремя отработки входа:\n*${ formattedArrayWithExtraInfo(fulfillingTimeElements) }*\n\n_${'Успокойся, не переживай. Ты молодец, ты смог остановиться. Ты на верном пути к избавлению от жадности! Всё обязательно наладиться, только соблюдай систему и будь внимателен!'}_`, parseMarkdown);
      }, 250);
    } else {
      setTimeout(() => {
        console.log(findingTimeElements, fulfillingTimeElements);
        bot.sendMessage(chatId, `*${'ИТОГИ СЕССИИ:'}*\nПродолжительность: *${ formattedDifference }*\nОпубликовано: *${ createCounter }*\nОтработано: *${ pluses }* ${ findingTimeElements !== [] ? `\n\nВремя поиска входа:\n*${ formattedArrayWithExtraInfo(findingTimeElements) }*` : '\n\nНет ни одного законченного итога.' } ${ fulfillingTimeElements !== [] ? `\n\nВремя отработки входа:\n*${ formattedArrayWithExtraInfo(fulfillingTimeElements) }*` : '\n\nНет ни одного законченного итога.' }`, optionsWithStatistic);
      }, 250);
    };

    bot.sendMessage(chatId, `*${'Вы закончили сессию.'}*`, parseMarkdown);

    setTimeout(() => {
      pluses = 0;
      startTime = null;
      startCounter = 0;
      createCounter = 0;
      findingTimeIncrement = 1;
      fulfillingTimeIncrement = 0;
      allFindingTimes = [];
      allFulfillingTimes = [];
      findingTimeElements = [];
      fulfillingTimeElements = [];
    }, 1000);
  } else if (hasMinus === true) {
    bot.sendMessage(chatId, `*${'Сессия уже закончена, подумай почему ты получил минус и отдохни!'}*`, parseMarkdown);
  } else {
    bot.sendMessage(chatId, `*${'Чтобы закончить сессию, начните её командой /start.'}*`, parseMarkdown);
  };
});

// Обработчик команды /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const commands = `*${'КОМАНДЫ:'}*\n/start *${'— Начать сессию'}*\n/create *${'— Создать пост'}*\n/stop *${'— Остановить сессию'}*\n/help *${'— Список команд'}*\n/test *${'— Для тестов'}*\n/statistic *${'— Вся статистика'}*`;
  
  bot.sendMessage(chatId, commands, parseMarkdown);
});

let createCounterGlobal = 0;
let plusesGlobal = 0;
let cancelles = 0;

// Обработчик команды /statistic
bot.onText(/\/statistic/, (msg) => {
  const chatId = msg.chat.id;
  const statistic = `*${'СТАТИСТИКА:'}*\nОпубликовано: *${ createCounterGlobal }*\nОтработано: *${ plusesGlobal }*\nОтменено: *${ cancelles }*`;

  bot.sendMessage(chatId, statistic, optionsWithStart);
});

bot.on('callback_query', (callbackQuery) => {
  const step = Object.keys(selections).filter((key) => selections[key] === '').length;

  // если сессия не начата, нужно сказать начать. Нельзя выбрать какой-то пункт, если сессия не начата.
  if (step === 4) {
    handleStep2(callbackQuery);
  } else if (step === 3) {
    handleStep3(callbackQuery);
  } else if (step === 2) {
    handleStep4(callbackQuery);
  }
});

// Обработчик команды /test
bot.onText(/\/test/, (msg) => {
  const chatId = msg.chat.id

  bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
  
    switch (text) {
      case '/start':
        // bot.sendMessage(chatId, 'Создание поста');
        break;
      // case '/test':
        // bot.sendMessage(chatId, 'Переход в режим разработки...');
        // break;
      // default:
      //   bot.sendMessage(chatId, 'Неизвестная команда');
      //   break;
    }
  });

  bot.sendMessage(
    chatId,
    `*${'Здень пока ничего нет! 🚧'}*`,
    optionsWithStart
  );

  console.log(`Команда находится в разработке...`);
});


bot.on('polling_error', (error) => {
  console.error('Ошибка при получении обновлений:', error);
});