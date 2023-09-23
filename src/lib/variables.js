const TelegramBot = require('node-telegram-bot-api');
const token = '6067868221:AAGdT7AdMod-qBEcNaqMk3KSfYSCQm8hnL8';

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
let allFindingTimes = [];
let allFulfillingTimes = [];

module.exports = {
  bot: new TelegramBot(token, { polling: true }),
  screenshots,
  selections,
  sele,
  allFindingTimes,
  allFulfillingTimes
};