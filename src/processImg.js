import jimp from "jimp";

const processImg = async (filePath, height, width) => {
	const image = await jimp.read(filePath)
	const background = await jimp.read('./src/assets/background.jpg');
	const edge = height > width ? height : width
	image.cover(edge * 0.9, edge * 0.9);
	background.cover(edge, edge);
	image.circle();
	background.composite(image, edge * 0.05, edge * 0.05);
	return await background.getBufferAsync("image/jpeg");
}

export default processImg
