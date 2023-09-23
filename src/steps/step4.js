const { formatToMinutes } = require('../helpers/helpers.js');
let { bot, sele, screenshots, allFulfillingTimes } = require('../lib/variables.js');

let hasMinus = false;
let pluses = 0;

let fulfillingTimeIncrement = 0;
let fulfillingTimeElements = [];

const handleStep4 = (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const end = callbackQuery.data;

  endFulfilling = new Date();
  const formattedDifferenceFulfilling = endFulfilling - endFindingTime;
  const formattedFulfillingTime = formatToMinutes(formattedDifferenceFulfilling);

  allFulfillingTimes.push(formattedFulfillingTime);

  // fulfillingTimeIncrement++;
  // let key = 'fulfilling' + fulfillingTimeIncrement;

  // const fulfillingTimeElement = {
  //   [key]: formattedFulfillingTime
  // };

  // fulfillingTimeElements.push(fulfillingTimeElement);
  // console.log('Все элементы нового массива со временем отработки сделки:', fulfillingTimeElements);

  selections.end = end;
  console.log('Итог сделки:', end);
  
  const message = `Валютная пара: *${ selections.currencyPair }*\nПопытка: *${ selections.attempt }*\nИтог сделки: *${ selections.end }* ${ sele.description !== '' ? `\n\nОписание:\n${ sele.description }` : '' } ${ sele.comment !== '' ? `\n\nКомментарий:\n_${ sele.comment }_` : '' }`;
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
            options
          ), 1000
        );

        cancelles++
      };

      if (end === 'МИНУС 💢' && selections3.attempt === '2 ПЕРЕКРЫТИЕ') {
        setTimeout(() =>
          bot.sendMessage(
            chatId,
            `Ты получил минус из-за ошибки. Подумай пару минут, вспомни 3-е правило, подумай над причиной такого исхода и закончи предложение:\n_${'«Я получил минус из-за ...» (Напр.: спешки, невнимательности)'}_`,
            options
          ), 1000
        );
        hasMinus = true
      };
  
      if (end === 'МИНУС ❌' && selections3.attempt === '2 ПЕРЕКРЫТИЕ') {
        setTimeout(() =>
          bot.sendMessage(
            chatId,
            `Ты получил минус из-за рынка. Если ты действительно уверен, что ты не наделал ошибок, то закончи это предложение:\n_${'«Я получил минус из-за ...» (Напр.: спешки, невнимательности, рынка)'}_`,
            options
          ), 1000
        );
        hasMinus = true
      };

      if (selections3.attempt !== 'ОСНОВА') {
        setTimeout(() => {
          bot.sendMessage(chatId, `*${`Ушло времени на отработку: ${ formattedFulfillingTime }`}*`, options);
        }, 1000)
      };

      const cryptoChannelId = '-1001904496260'; // ID of crypto-trades
      // const channelId = '-1001875103729'; // ID of my BO trades channel
      // bot.sendMediaGroup(channelId, media, options).then(() => console.log('Итог опубликован.')); // Send created post to channel
      bot.sendMediaGroup(chatId, media, options).then(() => {
        // findingTimeIncrement++; // for working branch
        createCounterGlobal++;
        createCounter++;

        console.log('Итог создан.');
      });
    } else {
      bot.sendMessage(chatId, `*${'Прикрепите скриншоты.'}*`, options);
      console.log('Скриншоты не прикреплены.');
    };
  });
};

module.exports = { handleStep4 };