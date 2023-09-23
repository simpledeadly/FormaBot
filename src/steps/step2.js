let { bot, selections, allFindingTimes } = require('../lib/variables.js');
const { formatToMinutes } = require('../helpers/helpers.js');

// var findingTimeElements = [];
var findingTimeIncrement = 0;

const handleStep2 = (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const currencyPair = callbackQuery.data;

  selections.currencyPair = currencyPair;
  console.log('Валютная пара:', currencyPair);

  if (selections.currencyPair !== '') {
    endFindingTime = new Date(); // and start fulfilling the trade.
    const timeDifferenceFinding = endFindingTime - startFindingTime;
    var formattedFindingTime = formatToMinutes(timeDifferenceFinding);

    allFindingTimes.push(formattedFindingTime);
  };

  options = { parse_mode: 'Markdown' };

  bot.sendMessage(chatId, `*${'Ушло времени на поиск: ' + formattedFindingTime }*`, options);
  setTimeout(() => {
    bot.sendMessage(chatId, `*${'Шаг 2: Прикрепите скриншоты'}* ${'(минимум: 2)'}`, options);
  }, 250)
};

module.exports = { handleStep2 };