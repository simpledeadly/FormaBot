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

module.exports = { formatMilliseconds, formatToMinutes };