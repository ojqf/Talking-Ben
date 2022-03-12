import theBot from './bot.js'
import {start_button} from "./button.js";
import DbHandler from "./DbHandler.js"

const dbHandler = new DbHandler("./db/index.json")
const startMessage = 'Hi, I am Ben! Well, if you want to talk to me, press the button below and ask anything :) '
export const commandsHandler = async (msg) => {
    const command = msg.text || msg.caption;
    const chatId = msg.chat.id;

    const start = async () => {
        await theBot.sendMessage(chatId, startMessage,start_button)
        dbHandler.addUser(chatId)
    }
   const call = async () => {
        await theBot.sendVideo(chatId, './Ben_videos/pick_up.mp4')
        dbHandler.startTalking(chatId)
    }
    const randomAnswer = async () => {
        if (dbHandler.getState(chatId) === DbHandler.STATES_TITLES.OUT_OF_TALKING) return
        const r = Math.random()
        const r_hang_up = 0.1
        const p = {
            first: (1-r_hang_up)/4,
            second: 2*(1-r_hang_up)/4,
            third: 3*(1-r_hang_up)/4,
            fourth: 4*(1-r_hang_up)/4
        }
        if (r < p.first) return theBot.sendVideo(chatId, './Ben_videos/yes.mp4')
        if (r < p.second) return theBot.sendVideo(chatId, './Ben_videos/no.mp4')
        if (r < p.third) return theBot.sendVideo(chatId, './Ben_videos/hohoho.mp4')
        if (r < p.fourth) return theBot.sendVideo(chatId, './Ben_videos/oh.mp4')
        await theBot.sendVideo(chatId, './Ben_videos/hang_up.mp4', start_button)
        dbHandler.stopTalking(chatId)
    }
    console.log(command === '☎️')
    switch (command) {
        case '/start':
            return start();
        case '☎️':
            return call()
        default:
            return randomAnswer()
    }
}

theBot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const username = msg.chat.username;
    console.log({text, chatId, username});
    await commandsHandler(msg)
})