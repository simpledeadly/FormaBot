const parseMarkdown = {
  parse_mode: 'Markdown'
}

const optionsWithCreate = {
  reply_markup: {
    keyboard: [
      ['/create']
    ],
    one_time_keyboard: true
  },
  parse_mode: 'Markdown'
}

const optionsWithStop = {
  reply_markup: {
    keyboard: [
      ['/stop']
    ],
    one_time_keyboard: true
  },
  parse_mode: 'Markdown'
}

const optionsWithStatistic = {
  reply_markup: {
    keyboard: [
      ['/statistic']
    ],
    one_time_keyboard: true
  },
  parse_mode: 'Markdown'
}

const optionsWithStart = {
  reply_markup: {
    keyboard: [
      ['/start']
    ],
    one_time_keyboard: true
  },
  parse_mode: 'Markdown'
}

const optionsWithCreateAndStop = {
  reply_markup: {
    keyboard: [
      ['/create', '/stop']
    ],
    one_time_keyboard: true
  },
  parse_mode: 'Markdown'
}

module.exports = {
  parseMarkdown,
  optionsWithStop,
  optionsWithStart,
  optionsWithCreate,
  optionsWithStatistic,
  optionsWithCreateAndStop
}