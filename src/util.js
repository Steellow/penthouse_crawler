const getChatId = (ctx) => ctx.update.message.chat.id;

const filterNewLinks = (scrapedLinks, checkedLinks) => {
	const newLinks = scrapedLinks.filter(
		(link) => !checkedLinks.includes(link)
	);

	console.log(newLinks.length + " new apartments found! 🥳");
	return newLinks;
};

module.exports = { getChatId, filterNewLinks };
