const TelegramBot = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options');
const token = '7255669444:AAG2usvlF1BgJk5a2ztlNP_H7s_0jkUNH08';

const bot = new TelegramBot(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(
        chatId,
        'Сейчас мы с тобой поиграем. Отгадай число от 0 до 9'
    );

    const randomNumber = Math.floor(Math.random() * 10);

    chats[chatId] = randomNumber;

    await bot.sendMessage(chatId, 'Ну че, отгадывай', gameOptions);
};

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Начальное приветствие' },
        { command: '/info', description: 'Получить информацию о пользователе' },
        { command: '/game', description: 'Угадай число от 0 до 9' },
    ]);

    bot.on('message', async (msg) => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(
                chatId,
                'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/2.webp'
            );
            return bot.sendMessage(chatId, 'Ну здарова');
        }

        if (text === '/info') {
            return bot.sendMessage(
                chatId,
                `Что хотел, ${msg.from.first_name}?`
            );
        }

        if (text === '/game') {
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, 'Я тебя не понимаю, че ты хочешь?');
    });

    bot.on('callback_query', (msg) => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again') {
            return startGame(chatId);
        }

        if (data === chats[chatId]) {
            return bot.sendMessage(
                chatId,
                `Поздравляю, ты угадал цифру ${chats[chatId]}`,
                againOptions
            );
        } else {
            return bot.sendMessage(
                chatId,
                `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`,
                againOptions
            );
        }
    });
};

start();
