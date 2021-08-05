
let { WAConnection: _WAConnection, MessageType, Mimetype} = require('@adiwajshing/baileys')
let qrcode = require('qrcode')
const fs = require('fs')
let WAConnection = require('./func').WAConnection(_WAConnection);
listjadibot = [];

const jadibot = async(conn, from) => {
	client = new WAConnection()
    client.logger.level = 'warn'
    client.version = [2, 2123, 8]
    client.browserDescription = ['JadiBot', 'EDGE', '6.9']
    client.on('qr', async qr => {
    	let bot = await qrcode.toDataURL(qr, { scale: 8 })
    	let buffer = new Buffer.from(bot.replace('data:image/png;base64,', ''), 'base64')
       	bot = await conn.sendMessage(from, buffer, 'imageMessage', {caption: 'Scan QR Untuk menjadi bot sementara\n\nQR akan diganti setiap 30 detik'})
    	setTimeout(() => {
       	conn.deleteMessage(from, bot.key)
       },30000)
    })
    client.on('connecting', () => {
    })
    client.on('open', () => {
    	conn.reply(from, `Sukses terhubung\n\nDevice:\n\n ${JSON.stringify(client.user, null, 2)}`, null)
    })
    await client.connect({timeoutMs: 30 * 1000})
    listjadibot.push(client.user)
    client.on('chat-update', async (message) => {
        require('./handler.js')(client, message)
    })
}

const stopjadibot = (conn, from, msg) => {
	client = new WAConnection();
	client.close()
	conn.reply(from, 'Sukses stop jadibot', msg)
}

module.exports = {
	jadibot,
	stopjadibot,
	listjadibot
}