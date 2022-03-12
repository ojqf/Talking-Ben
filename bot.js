import TelegramBot from 'node-telegram-bot-api';
import 'dotenv-flow/config.js';

const bot = new TelegramBot(process.env.TOKEN, { polling: true });

export default bot;
