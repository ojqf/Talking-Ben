import theBot from './bot.js';
import DbHandler from './DbHandler.js';

import { START_MESSAGE } from './config.js';

const dbHandler = new DbHandler('./db/index.json');

const commandsHandler = async (msg) => {
  const command = msg.text || msg.caption;
  const chatId = msg.chat.id;

  const start = async () => {
    dbHandler.addUser(chatId);
    return theBot.sendMessage(chatId, START_MESSAGE, {
      reply_markup: {
        keyboard: [[{ text: '☎️' }]],
        one_time_keyboard: true,
        resize_keyboard: true,
      },
    });
  };

  const call = async () => {
    dbHandler.startTalking(chatId);
    return theBot.sendVideo(chatId, './Ben_videos/pick_up.mp4');
  };

  const randomAnswer = async () => {
    if (dbHandler.getState(chatId) === DbHandler.STATES_TITLES.OUT_OF_TALKING) return;
    const r = Math.random();
    const pHangUp = 0.1;
    const p = (1 - pHangUp) / 4;
    if (r < p * 1) return theBot.sendVideo(chatId, './Ben_videos/yes.mp4');
    if (r < p * 2) return theBot.sendVideo(chatId, './Ben_videos/no.mp4');
    if (r < p * 3) return theBot.sendVideo(chatId, './Ben_videos/hohoho.mp4');
    if (r < p * 4) return theBot.sendVideo(chatId, './Ben_videos/oh.mp4');
    dbHandler.stopTalking(chatId);
    theBot.sendVideo(chatId, './Ben_videos/hang_up.mp4', startButton);
  };

  switch (command) {
    case '/start':
      return start();
    case '☎️':
      return call();
    default:
      return randomAnswer();
  }
};

theBot.on('message', async (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;
  const username = msg.chat.username;
  console.log({ text, chatId, username });
  await commandsHandler(msg);
});
