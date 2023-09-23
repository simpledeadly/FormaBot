let { bot, selections } = require('../lib/variables.js');
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

module.exports = { handleStep3 };