import processImg from "./processImg.js";

const startBot = (bot) => {

	const sendMessage = async (...args) => bot.sendMessage(...args).catch(() => console.log('someone blocked bot'))

		bot.onText(/\/start/, async (msg) => {
			const text = '🇺🇦 *Hello there!* \n\nThis bot will make an avatar with ukrainian flag border from any pic you will send here in private messages. \n\nShow that you stands with Ukraine. Make yourself an avatar with our beautiful flag and set it to all your social media\n*Glory to Ukraine*';
			sendMessage(msg.chat.id, text, {parse_mode: 'Markdown'})
		})

		bot.onText(/\/help/, async (msg) => {
			const text = '🇺🇦 *Just send me any image, and I\'ll send you back avatar with beautiful ukrainian flag*\n\nAlso, you can support Ukraine in this hard times. What can you do?\n\n1. [Donate to Ukraine Army](https://uahelp.monobank.ua/)\n2. [Help to disable Russian services with DDoS](https://help-ukraine-win.com/)\n\n*Glory to Ukraine*';
			sendMessage(msg.chat.id, text, {parse_mode: 'Markdown', disable_web_page_preview: true})
		})

		bot.on('photo', async (msg) => {
			sendMessage(msg.chat.id, 'Got your image! Wait a few second, we\'ll send your avatar');

			const {file_id: fileId, height, width} = msg.photo[msg.photo.length - 1]
			const {file_path: filePath} = await bot.getFile(fileId);
			const buffer = await processImg(`https://api.telegram.org/file/bot${bot.token}/${filePath}`, height, width)

			await Promise.all([
				bot.sendPhoto(msg.chat.id, buffer, {}, {filename: 'ua-avatar'}).catch(() => console.log('someone blocked bot')),
				bot.sendDocument(msg.chat.id, buffer, {}, {filename: 'ua-avatar'}).catch(() => console.log('someone blocked bot')),
			])

			sendMessage(msg.chat.id, '🇺🇦 *Here you are! Set it to your social media.*\n\nAlso, you can support Ukraine in this hard times. What can you do?\n\n1. [Donate to Ukraine Army](https://uahelp.monobank.ua/)\n2. [Help to disable Russian services with DDoS](https://help-ukraine-win.com/)\n\n*Glory to Ukraine*', {parse_mode: 'Markdown', disable_web_page_preview: true})
		})
}

export default startBot
