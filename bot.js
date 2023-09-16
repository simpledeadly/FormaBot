const TelegramBot = require('node-telegram-bot-api');
const token = '6067868221:AAGdT7AdMod-qBEcNaqMk3KSfYSCQm8hnL8';

console.log('Запущено!')

const bot = new TelegramBot(token, { polling: true });

let selections = {
  currencyPair: '',
  outcome: '',
  attempt: '',
  end: '',
  messageId: null
  // comment: '',
};

let sele = {
  comment: ''
}

let screenshots = [];

bot.on('message', (callbackQuery) => {
  if (callbackQuery.photo) {
    const fileId = callbackQuery.photo[callbackQuery.photo.length - 1].file_id;
    const chatId = callbackQuery.chat.id;

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
        `*${'Шаг 3: Выберите с какой попытки сделка была закончена'}*\n_${'(Можно добавить комментарий)'}_`,
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
    ) {
    const comment = callbackQuery.text;
    
    sele.comment = comment;
    console.log('Комментарий:', comment);

    bot.sendMessage(chatId, `*${'Комментарий обновлён'}*`, options = { parse_mode: 'Markdown' });
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
        options = { parse_mode: 'Markdown' }
      ), 2000
    );
    
    setTimeout(() =>
      bot.sendMessage(
        chatId,
        `_${'Закончишь? 🤨'}_`,
        options = { parse_mode: 'Markdown' }
      ), 5000
    );
  } else if (callbackQuery.text === mistake2) {
    const chatId = callbackQuery.chat.id;

    setTimeout(() =>
      bot.sendMessage(
        chatId,
        `Если ты получил минус из-за невнимательности, то тебе нужно *${'закончить сессию ПРЯМО СЕЙЧАС.'}*\n\nНе переживай, завтра повысишь сумму! 😉`,
        options = { parse_mode: 'Markdown' }
      ), 4000
    );

    setTimeout(() =>
      bot.sendMessage(
        chatId,
        `_${'Закончишь? 🙂'}_`,
        options = { parse_mode: 'Markdown' }
      ), 7000
    );
  } else if (callbackQuery.text === immistake1) {
    const chatId = callbackQuery.chat.id;

    setTimeout(() =>
      bot.sendMessage(
        chatId,
        `Что же, сегодня рынок решил пойти против тебя, такое бывает и это нормально! Лучше тебе всё-таки пойти отдохнуть, а завтра поднимешь сумму!`,
        options = { parse_mode: 'Markdown' }
      ), 4000
    );
  } else if (callbackQuery.text === 'yes' || callbackQuery.text === 'да') {
    setTimeout(() =>
      bot.sendMessage(
        chatId,
        `Ты сделал ПРАВИЛЬНОЕ решение, молодец! Следование грамотной системе сильно поможет тебе.\n\nСессия закончена, отдохни!`,
        options = { parse_mode: 'Markdown' }
      ), 1000
    );
  } else if (callbackQuery.text === 'no' || callbackQuery.text === 'нет') {
    setTimeout(() =>
      bot.sendMessage(
        chatId,
        `Ты точно наделаешь ошибок, поэтому прошу тебя, ОСТАНОВИ СЕССИЮ. Сохрани свой баланс, нервы и ВРЕМЯ.\n\nНе забывавай, ты можешь поторговать завтра с повышенным объёмом!`,
        options = { parse_mode: 'Markdown' }
      ), 1000
    );

    setTimeout(() =>
      bot.sendMessage(
        chatId,
        `_${'Закончишь? 😕'}_`,
        options = { parse_mode: 'Markdown' }
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

const handleStep2 = (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const currencyPair = callbackQuery.data;

  selections.currencyPair = currencyPair;
  console.log('Валютная пара:', currencyPair);

  bot.sendMessage(
    chatId,
    `*${'Шаг 2: Прикрепите скриншоты'}* _${'(минимум: 2)'}_`,
    options = { parse_mode: 'Markdown' }
  );
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

let pluses = 0

let hasMinus = false

const handleStep4 = (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const end = callbackQuery.data;

  selections.end = end;
  console.log('Итог сделки:', end);
  
  const message = `Валютная пара: *${ selections.currencyPair }*\nПопытка: *${ selections.attempt }*\nИтог сделки: *${ selections.end }*\n\n_${ sele.comment }_`;
  const options = { parse_mode: 'Markdown' };

  bot.sendMessage(chatId, `_${'Отправлено в канал:'}_`, options).then(() => {
    if (screenshots.length > 0) {
      const media = screenshots.map((fileId, index) => {
        const mediaOptions = {
          type: 'photo',
          media: fileId,
          parse_mode: 'Markdown'
        };

        if (index === 0) {
          mediaOptions.caption = message;
        }

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
        }

      if (end === 'ОТМЕНЕНО 🛠') {
        setTimeout(() =>
          bot.sendMessage(
            chatId,
            `Тебе отменили сделку. Успокойся и продолжай! :)`,
            options
          ), 1000
        );

        cancelles++
      }

      if (end === 'МИНУС 💢' && selections.attempt === '2 ПЕРЕКРЫТИЕ') {
        setTimeout(() =>
          bot.sendMessage(
            chatId,
            `Ты получил минус из-за ошибки. Подумай пару минут, вспомни 3-е правило, подумай над причиной такого исхода и закончи предложение:\n_${'«Я получил минус из-за ...» (Напр.: спешки, невнимательности)'}_`,
            options
          ), 1000
        );
        hasMinus = true
      }
  
      if (end === 'МИНУС ❌' && selections.attempt === '2 ПЕРЕКРЫТИЕ') {
        setTimeout(() =>
          bot.sendMessage(
            chatId,
            `Ты получил минус из-за рынка. Если ты действительно уверен, что ты не наделал ошибок, то закончи это предложение:\n_${'«Я получил минус из-за ...» (Напр.: спешки, невнимательности, рынка)'}_`,
            options
          ), 1000
        );
        hasMinus = true
      }

      const cryptoChannelId = '-1001904496260'; // ID of crypto-trades
      const channelId = '-1001875103729'; // ID of my BO trades channel
      bot.sendMediaGroup(channelId, media, options) // Send created post to channel
      bot.sendMediaGroup(chatId, media, options).then(() => {
        selections = {
          currencyPair: '',
          outcome: '',
          attempt: '',
          end: '',
          messageId: null
        };
        screenshots = [];
        sele.comment = '';
        createCounterGlobal++
        createCounter++;

        console.log('Пост создан!');
      })
    } else {
      console.log('Ты не прикрепил скриншот, чорт!');
    }
  })
};

function formatMilliseconds(milliseconds) {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const formattedTime = `${ hours } ${'часов'} ${ minutes } ${'минут'}`;

  return formattedTime;
}

let startCounter = 0;

// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  startTime = new Date();
  
  const rules = `*${'ПРАВИЛА:'}*\n1. Перед сессией принять худший исход, продумать реализацию такого сценария, И СТОЯТЬ НА ЭТОМ ВЫБОРЕ (!),\n2. Проанализировать каждый фактор из 4-х, найти "идеальную" ситуацию, строго относиться к рынку: нашёл ситуацию с 4-мя факторами и без сомнений зашёл в ХОРОШЕМ месте,\n3. НИ НА ЧТО не отвлекаться во время торговли (F6 на всякий случай),\n4. НИ В КОЕМ СЛУЧАЕ, НЕЛЬЗЯ БЕСИТЬСЯ. Все бесячие моменты нужно принять и рассуждать как грамотно поступить дальше,\n5. При получении лося, задать вопрос: _${'«Почему/По какой причине я получил минус?»'}_, и сделать закономерный вывод.\n6. Проследить какие пары отсутствуют и пометить их красным флажком на TradingView.\n\n*${'«Негативные эмоции тормозят процесс размышлений»'}*\n\n*${'«Look first / Then leap»'}*`

  options = { parse_mode: 'Markdown' }
  startCounter++
  console.log('Сессия начата!', startTime)
  
  bot.sendMessage(chatId, `*${'Вы начали сессию.'}*`, options = { parse_mode: 'Markdown' });
  setTimeout(() => {
    bot.sendMessage(chatId, rules, options)
  }, 250);

  createCounter = 0;
  pluses = 0;
});

let createCounter = 0;

// Обработчик команды /create
bot.onText(/\/create/, (msg) => {
  const chatId = msg.chat.id

  if (startCounter !== 0 && hasMinus === false) {
    handleStep1(msg);

    selections = {
      currencyPair: '',
      outcome: '',
      attempt: '',
      end: '',
      messageId: null
    };
    screenshots = [];
    sele.comment = '';

    console.log(`Создание нового поста...`);
  } else if (hasMinus === true) {
    bot.sendMessage(chatId, `*${'Ты получил минус. Подумай о будущем, закончи сессию командой /stop.\n\nИ ответь на вопрос выше, пожалуйста.'}*`, options = { parse_mode: 'Markdown' });
  } else {
    bot.sendMessage(chatId, `*${'Чтобы создать пост, начните сессию командой /start.'}*`, options = { parse_mode: 'Markdown' });
  }
});

// Обработчик команды /stop
bot.onText(/\/stop/, (msg) => {
  const chatId = msg.chat.id;
  
  if (startCounter !== 0) {
    const endTime = new Date();
    const timeDifference = endTime - startTime;
    const formattedDifference = formatMilliseconds(timeDifference)

    options = { parse_mode: 'Markdown' }
    startCounter = 0;
    startTime = null;
    console.log('Сессия закончена!', new Date())

    if (createCounter === pluses && pluses >= 5) {
      setTimeout(() => {
        bot.sendMessage(chatId, `*${'ИТОГИ СЕССИИ:'}*\nПродолжительность: *${ formattedDifference }*,\nОпубликовано: *${ createCounter }*,\nОтработано: *${ pluses }*.\n\n_${'Хорошая получилась сессия!'}_`, options);
      }, 250);
    } else {
      setTimeout(() => {
        bot.sendMessage(chatId, `*${'ИТОГИ СЕССИИ:'}*\nПродолжительность: *${ formattedDifference }*,\nОпубликовано: *${ createCounter }*,\nОтработано: *${ pluses }*.`, options);
      }, 250);
    };
    bot.sendMessage(chatId, `*${'Вы закончили сессию.'}*`, options);

    // createCounter = 0;
    // pluses = 0;
  } else {
    bot.sendMessage(chatId, `*${'Чтобы закончить сессию, начните её командой /start.'}*`, options = { parse_mode: 'Markdown' });
  };
});

// Обработчик команды /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id
  const options = { parse_mode: 'Markdown' };
  const commands = `*${'КОМАНДЫ:'}*\n/start *${'— Начать сессию.'}*\n/create *${'— Создать пост.'}*\n/stop *${'— Остановить сессию.'}*\n/help *${'— Список команд.'}*\n/test *${'— Для тестов,'}*\n/statistic *${'— Вся статистика.'}*`
  
  bot.sendMessage(chatId, commands, options);
});

let createCounterGlobal = 0;
let plusesGlobal = 0;
let cancelles = 0;

// Обработчик команды /statistic
bot.onText(/\/statistic/, (msg) => {
  const chatId = msg.chat.id
  const options = { parse_mode: 'Markdown' };
  const statistic = `*${'СТАТИСТИКА:'}*\nОпубликовано: *${ createCounterGlobal }*,\nОтработано: *${ plusesGlobal }*,\nОтменено: *${ cancelles }*.`;

  bot.sendMessage(chatId, statistic, options);
});

bot.on('callback_query', (callbackQuery) => {
  const step = Object.keys(selections).filter((key) => selections[key] === '').length;

  if (step === 4) {
    handleStep2(callbackQuery);
  } else if (step === 3) {
    handleStep3(callbackQuery);
  } else if (step === 2) {
    handleStep4(callbackQuery);
  }
});

// Обработчик команды /test
// bot.onText(/\/test/, (msg) => {
//   const chatId = msg.chat.id

//   const options = {
//     reply_markup: {
//       keyboard: [
//         ['/start']
//       ],
//       one_time_keyboard: true
//     },
//     parse_mode: 'Markdown'
//   };

//   bot.on('message', (msg) => {
//     const chatId = msg.chat.id;
//     const text = msg.text;
  
//     switch (text) {
//       case '/start':
//         // bot.sendMessage(chatId, 'Создание поста');
//         break;
//       // case '/test':
//         // bot.sendMessage(chatId, 'Переход в режим разработки...');
//         // break;
//       // default:
//       //   bot.sendMessage(chatId, 'Неизвестная команда');
//       //   break;
//     }
//   });

//   bot.sendMessage(
//     chatId,
//     `*${'Здень пока ничего нет! 🚧'}*`,
//     options
//   );

//   console.log(`Команда находится в разработке...`);
// });


bot.on('polling_error', (error) => {
  console.error('Ошибка при получении обновлений:', error);
});