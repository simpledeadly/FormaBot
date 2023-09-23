const { handleStep1 } = require('./steps/step1.js');
const { handleStep2 } = require('./steps/step2.js');
const { handleStep3 } = require('./steps/step3.js');
const { handleStep4 } = require('./steps/step4.js');

const { formatMilliseconds } = require('./helpers/helpers.js');
let { bot, selections, sele, screenshots, allFindingTimes, allFulfillingTimes } = require('./lib/variables.js');
console.log('Запущено!');

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
    } else {
      console.log('not working because:', selections.currencyPair, 'NOTHING HERE!');
    }
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
        `Ты точно наделаешь ошибок, поэтому прошу тебя, ОСТАНОВИСЬ. Сохрани свой баланс, нервы и ВРЕМЯ.\n\nНе забывавай, ты можешь поторговать завтра с повышенным объёмом!`,
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
  };
});

let startCounter = 0;

// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  startTime = new Date();
  
  const rules = `*${'ПРАВИЛА:'}*\n1. Никакой жадности, никаких надежд.\n2. Строгое отношение к рынку.\n    _${'Как будто с полицейским разговариваю.'}_\n3. Нельзя беситься. _${'Цитата ниже.'}_\n4. Заполнить бота прежде, чем выражать эмоции.\n5. *${'Цель:'}* всеми силами сохранить как можно больший баланс. _${'Нужно стараться "избежать ДТП".'}_\n\n*${'«Негативные эмоции тормозят процесс размышлений»'}*`

  options = { parse_mode: 'Markdown' }
  startCounter++
  console.log('Сессия начата!', startTime)
  
  bot.sendMessage(chatId, `*${'Вы начали сессию.'}*`, options = { parse_mode: 'Markdown' });
  setTimeout(() => {
    bot.sendMessage(chatId, rules, options)
  }, 250);

  // createCounter = 0;
  // pluses = 0;
});

let createCounter = 0;

let hasMinus = false;
let pluses = 0;

// Обработчик команды /create
bot.onText(/\/create/, (msg) => {
  const chatId = msg.chat.id;
  startFindingTime = new Date();
  // findingTimeIncrement++; // for dev branch

  if (startCounter !== 0 && hasMinus === false) {
    handleStep1(msg)

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
    bot.sendMessage(chatId, `*${'Ты получил минус. Подумай о будущем, закончи сессию командой /stop.\n\nИ ответь на вопрос выше, пожалуйста.'}*`, options = { parse_mode: 'Markdown' });
  } else {
    bot.sendMessage(chatId, `*${'Чтобы создать итог, начните сессию командой /start.'}*`, options = { parse_mode: 'Markdown' });
  }
});

// Обработчик команды /stop
bot.onText(/\/stop/, (msg) => {
  const chatId = msg.chat.id;

  // for (let g = 0; g < allFindingTimes.length; g++) {
  //   console.log(g, 'situation:', allFindingTimes[g]);
  // };
  
  if (startCounter !== 0) {
    const endTime = new Date();
    const timeDifference = endTime - startTime;
    const formattedDifference = formatMilliseconds(timeDifference);

    options = { parse_mode: 'Markdown' };
    console.log('Сессия закончена!', new Date());

    // let neww = allFindingTimes.concat(allFulfillingTimes);
    // console.log(neww)

    // С помощью этой функции можно дополнять информацию по итогу сделки в итоговой статистике (стата после "/stop").
    const extraInfoAboutFinishedTrade = () => {
      // if () {};

      return `\n`;
    };

    if (createCounter === pluses && pluses >= 5) {
      setTimeout(() => {
        bot.sendMessage(chatId, `*${'ИТОГИ СЕССИИ:'}*\nПродолжительность: *${ formattedDifference }*\nОпубликовано: *${ createCounter }*,\nОтработано: *${ pluses }*\n\nВремя поиска входа:\n*${ allFindingTimes.join(extraInfoAboutFinishedTrade()) }*\n\nВремя отработки входа:\n*${ allFulfillingTimes.join(extraInfoAboutFinishedTrade()) }*\n\nХорошая получилась сессия!`, options);
      }, 250);
    } else {
      setTimeout(() => {
        // bot.sendMessage(chatId, `*${'ИТОГИ СЕССИИ:'}*\nПродолжительность: *${ formattedDifference }*\nОпубликовано: *${ createCounter }*,\nОтработано: *${ pluses }*\n\nВремя поиска входа:\n*${ fulfillingTimeElements }*`, options);
        bot.sendMessage(chatId, `*${'ИТОГИ СЕССИИ:'}*\nПродолжительность: *${ formattedDifference }*\nОпубликовано: *${ createCounter }*,\nОтработано: *${ pluses }*\n\nВремя поиска входа:\n*${ allFindingTimes.join(extraInfoAboutFinishedTrade()) }*\n\nВремя отработки входа:\n*${ allFulfillingTimes.join(extraInfoAboutFinishedTrade()) }*`, options);
      }, 250);
    };

    bot.sendMessage(chatId, `*${'Вы закончили сессию.'}*`, options);

    pluses = 0;
    startTime = null;
    startCounter = 0;
    createCounter = 0;
    findingTimeIncrement = 0;
    fulfillingTimeIncrement = 0;
    setTimeout(() => {
      allFulfillingTimes = [];
      allFindingTimes = [];
    }, 300)
  } else {
    bot.sendMessage(chatId, `*${'Чтобы закончить сессию, начните её командой /start.'}*`, options = { parse_mode: 'Markdown' });
  };
});

// Обработчик команды /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const options = { parse_mode: 'Markdown' };
  const commands = `*${'КОМАНДЫ:'}*\n/start *${'— Начать сессию'}*\n/create *${'— Создать пост'}*\n/stop *${'— Остановить сессию'}*\n/help *${'— Список команд'}*\n/test *${'— Для тестов'}*\n/statistic *${'— Вся статистика'}*`;
  
  bot.sendMessage(chatId, commands, options);
});

let createCounterGlobal = 0;
let plusesGlobal = 0;
let cancelles = 0;

// Обработчик команды /statistic
bot.onText(/\/statistic/, (msg) => {
  const chatId = msg.chat.id;
  const options = { parse_mode: 'Markdown' };
  const statistic = `*${'СТАТИСТИКА:'}*\nОпубликовано: *${ createCounterGlobal }*\nОтработано: *${ plusesGlobal }*\nОтменено: *${ cancelles }*`;

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
bot.onText(/\/test/, (msg) => {
  const chatId = msg.chat.id

  const options = {
    reply_markup: {
      keyboard: [
        ['/start']
      ],
      one_time_keyboard: true
    },
    parse_mode: 'Markdown'
  };

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
    options
  );

  console.log(`Команда находится в разработке...`);
});


bot.on('polling_error', (error) => {
  console.error('Ошибка при получении обновлений:', error);
});