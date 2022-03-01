import TelegramBot from 'node-telegram-bot-api';
import {config} from "dotenv";
import startBot from "./src/bot.js";

config()

const TOKEN = process.env.BOT_TOKEN;

const bot = new TelegramBot(TOKEN, { polling: true });

startBot(bot);
