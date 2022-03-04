import processImg from "./processImg.js";

const startBot = (bot) => {

	const sendMessage = async (...args) => bot.sendMessage(...args).catch(() => console.log('someone blocked bot'))

	const createFromAvatar = async ({ chat: { id } }) => {
		const { photo } = await bot.getChat(id);

		if (photo) {
			sendMessage(id, 'Got your avatar! Wait a few second...');
			const {big_file_id: fileId} = photo;
			const {file_path: filePath} = await bot.getFile(fileId);
			const buffer = await processImg(`https://api.telegram.org/file/bot${bot.token}/${filePath}`, 512, 512)

			await Promise.all([
				bot.sendPhoto(id, buffer, {}, {filename: 'ua-avatar'}).catch(() => console.log('someone blocked bot')),
				bot.sendDocument(id, buffer, {}, {filename: 'ua-avatar'}).catch(() => console.log('someone blocked bot')),
			])

			sendMessage(id, '🇺🇦 *Here you are! Set it to your social media.*\n\nAlso, you can support Ukraine in this hard times. What can you do?\n\n1. [Donate to Ukraine Army](https://uahelp.monobank.ua/)\n2. [Help to disable Russian services with DDoS](https://help-ukraine-win.com/)\n\n*Glory to Ukraine*', {parse_mode: 'Markdown', disable_web_page_preview: true})

		} else {
			sendMessage(id, 'Looks like you haven\'t any avatar.\n\nSo just send me any image, and I\'ll send you back avatar with beautiful ukrainian flag', {parse_mode: 'Markdown'})
		}
	}

		bot.onText(/\/start/, async (msg) => {
			const text = '🇺🇦 *Hello there!* \n\nThis bot will make an avatar with ukrainian flag border from your current avatar or any pic you will send here in private messages. \n\nShow that you stands with Ukraine. Make yourself an avatar with our beautiful flag and set it to all your social media\n\n*Glory to Ukraine!*';
			sendMessage(msg.chat.id, text, {parse_mode: 'Markdown'})

			await createFromAvatar(msg);
		})

		bot.onText(/\/avatar/, createFromAvatar);

		bot.onText(/\/help/, async (msg) => {
			const text = '🇺🇦 *Just send me any image, and I\'ll send you back avatar with beautiful ukrainian flag*\n\n\/avatar — make a new avatar with your current avatar.\n\nAlso, you can support Ukraine in this hard times. What can you do?\n\n1. [Donate to Ukraine Army](https://uahelp.monobank.ua/)\n2. [Help to disable Russian services with DDoS](https://help-ukraine-win.com/)\n\n*Glory to Ukraine!*';
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

			sendMessage(msg.chat.id, '🇺🇦 *Here you are! Set it to your social media.*\n\nAlso, you can support Ukraine in this hard times. What can you do?\n\n1. [Donate to Ukraine Army](https://uahelp.monobank.ua/)\n2. [Help to disable Russian services with DDoS](https://help-ukraine-win.com/)\n\n*Glory to Ukraine!*', {parse_mode: 'Markdown', disable_web_page_preview: true})
		})
}

export default startBot
