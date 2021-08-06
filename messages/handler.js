/*
Hanya example untuk https://justaqul.xyz
Mau recode? ya terserah asal jangan ganti WaterMark
Mau jual? jangan deh
Dapetin apikey? Regist di https://justaqul.xyz
Sorry sc nya banyak kekurangan
*/
"use strict";
const {
    MessageType
} = require("@adiwajshing/baileys");
const {
    default: Axios
} = require("axios");
const fs = require("fs");
const yts = require("yt-search");
const fetch = require("node-fetch");
const googleIt = require("google-it");
const FormData = require("form-data");
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Jakarta").locale("id");
const {
    color
} = require("../lib/color");
const func = require("../lib/function");
const {
    toSticker,
    webpToPng,
    webpToMp4,
    toAudio
} = require("../lib/convert");
const api = require("../lib/api");
const { jadibot, stopjadibot, listjadibot } = require("../lib/jadibot.js")
const fakethumb = fs.readFileSync("../tmp/thumb.jpg")
const isUrl = (url) => {
    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
}
const ytIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:shorts\/)?(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/

module.exports = {
    async chatUpdate(conn, chat) {
        if (!chat.hasNewMessage) return
        let msg = chat.messages.all()[0]
        try {
            if (!msg.message) return // Mengskip message yang ga ada message
            await func.serialize(conn, msg) // biar ez
            switch (msg.type) { // Update media
                case MessageType.image:
                case MessageType.video:
                case MessageType.audio:
                case MessageType.sticker:
                    if (!msg.fromMe) await func.sleep(1000)
                    if (!msg.message[msg.type].url) await conn.updateMediaMessage(msg);
                    break
            }
            const {
                type,
                quotedMsg,
                isGroup,
                isQuotedMsg,
                mentioned,
                sender,
                from,
                fromMe,
                pushname,
                body,
                isBaileys,
                userData,
                groupMetadata
            } = msg
            const {
                text,
                extendedText,
                contact,
                location,
                liveLocation,
                image,
                video,
                sticker,
                document,
                audio,
                product
            } = MessageType

            if (isBaileys) return

            const args = body.split(' ')
            const command = body.toLowerCase().split(/ +/)[0] || ''
            const prefix = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/.test(command) ? command.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/gi) : '#'
            const isCmd = command.startsWith(prefix)
            const q = body.slice(command.length + 1, body.length)
            const isOwner = fromMe || userData.isOwner

            const print = function (teks) {
                if (typeof teks !== 'string') teks = require('util').inspect(teks)
                teks = require('util').format(teks)
                return conn.reply(from, teks, msg)
            }
            // Console.log
            if (isCmd && isGroup) console.log(color('[ COMMAND ]', 'yellow'), color(command), color('from', 'yellow'), color(pushname), color('in', 'yellow'), color(groupMetadata.subject))
            if (isCmd && !isGroup) console.log(color('[ COMMAND ]', 'yellow'), color(command), color('from', 'yellow'), color(pushname), color('in', 'yellow'), color('Private Chat'))

            switch (command) {
                case '=>': {
                    if (!isOwner) return
                    try {
                        let evaled = eval(`(async() => {` + q + `})()`)
                        if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
                        conn.reply(from, evaled, msg)
                    } catch (e) {
                        conn.reply(from, `${e}`, msg)
                    }
                }
                break
            case prefix + 'menu':
            case prefix + 'help': {
                let tmt = `*Example Bot*\n\n`
                tmt += `*Source Code :* https://github.com/zennn08/example-bot\n`
                tmt += `*API :* https://justaqul.xyz\n\n`
                tmt += `${prefix}sticker\n`
                tmt += `${prefix}toimg\n`
                tmt += `${prefix}ytmp4\n`
                tmt += `${prefix}ytmp3\n`
                tmt += `${prefix}tiktokwm\n`
                tmt += `${prefix}tiktoknowm\n`
                tmt += `${prefix}tiktokmusic\n`
                tmt += `${prefix}tomp3\n`
                tmt += `${prefix}toptt\n`
                tmt += `${prefix}pinterest\n`
                tmt += `${prefix}igstalk\n`
                tmt += `${prefix}igdl\n`
                tmt += `${prefix}flower\n`
                tmt += `${prefix}write-text\n`
                tmt += `${prefix}shadow-text\n`
                tmt += `${prefix}artimimpi\n`
                tmt += `${prefix}artinama\n`
                tmt += `${prefix}ramaljodoh\n`
                tmt += `${prefix}call`
                await conn.reply(from, tmt, msg, { detectLinks: false, thumbnail: fakethumb })
            }
            break
            /*case prefix + 's':
            case prefix + 'sticker':
            case prefix + 'stiker': {
                if (msg.isImage || msg.isQuotedImage || msg.isVideo && msg.message[msg.type].seconds < 11 || msg.isQuotedVideo && quotedMsg[quotedMsg.type].seconds < 11) {
                    const media = isQuotedMsg ? await quotedMsg.toBuffer() : await msg.toBuffer()
                    await toSticker(media, global.config.packName, global.config.authName)
                        .then((res) => conn.sendSticker(from, res, msg))
                        .catch((err) => {
                            console.log(err)
                            conn.reply(from, require('util').format(err), msg)
                        })
                } else {
                    let tmt = `Kirim/reply image/video dengan caption ${command}`
                    conn.reply(from, tmt, msg)
                }
            }
            break*/
            case prefix + 'searchmusic':
            case prefix + 'whatmusic': {
            	if (msg.isQuotedAudio || msg.isQuotedVideo || msg.isQuotedDocument) {
            	let files = await conn.downloadMediaMessage(JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo)
            let bodyForm = new FormData()
			bodyForm.append('audio', files, 'music.mp3')
			axios('https://api.zeks.xyz/api/searchmusic?apikey=Nyarlathotep', {
					method: 'POST',
					headers: {
						...bodyForm.getHeaders()
					},
					data: bodyForm.getBuffer()
				})
				.then(({
					data
				}) => {
					if (data.status) {
						conn.reply(from, `「 *WHAT MUSIC* 」\n\n*- Title:* ${data.data.title}\n*- Artists:* ${data.data.artists}\n*- Genre:* ${data.data.genre}\n*- Album:* ${data.data.album}\n*- Release date:* ${data.data.release_date}`, msg)
						} else conn.reply(from, data.message, msg)
					}).catch(() => conn.reply(from, 'Internal server error!, try again later', msg))
					} else conn.reply(from, 'Wrong format!', msg)
				}
			break
            case prefix + 'google': {
				if (!q) return conn.reply(from, `Penggunaan ${command} query`, msg)
				await conn.reply(from, global.db.mess.wait, msg)
				let _url = 'https://google.com/search?q=' + encodeURIComponent(q)
				let _search = await googleIt({ query: q })
				let _msg = ''
			for (let i of _search) {
				_msg += `*${i.title}*\n_${i.link}_\n_${i.snippet}_\n\n`
				}
			try{
				ss = global.config.api + '/screenshot?apikey=' + global.config.apikey + '&url=' + _url
				await conn.sendImage(from, ss, _url + '\n\n' + _msg, msg)
			} catch(e) {
				conn.reply(from, _msg, msg)
			}
			}
			break
            case prefix + 'listgrup':
            case prefix + 'listgroup': {
            	let txt = conn.chats.array.filter(v => v.jid.endsWith('g.us')).map(v =>`${v.name}\nID: ${v.jid}\nStatus: ${v.read_only ? 'Left' : 'Join'}\nUnread Message(s): ${v.count}\nLast Message: ${func.formatDate(v.t * 1000)}`).join`\n\n`
            await conn.reply(from, '*List Groups:*\n\n' + txt, msg)
            }
			break
            case prefix + 'ping': {
            	await conn.reply(from, func.processTime(chat.t, moment() + ' second', msg)
            }
            break
            case prefix + 'runtime': {
            	await conn.reply(from, func.clockString(process.uptime()), msg)
            }
            break
            case prefix + 'lirik':
            case prefix + 'lyrics':
            case prefix + 'lyric': {
            	try {
            	if (!q) return conn.reply(from, `Penggunaan ${command} judul lagu`, msg)
            await conn.reply(from, global.db.mess.wait, msg)
            let res = await axios.get(`https://some-random-api.ml/lyrics?title=${q}`)
            await conn.reply(from, res.data.lyrics, msg, { contextInfo: { externalAdReply: { title: res.data.title, body: res.data.author, thumbnailUrl: res.data.thumbnail, sourceUrl: res.data.links }}})
            } catch(e) {
            	conn.reply(from, require('util').format(e), msg)
            }
            }
            break
            case prefix + 'sr': {
            try {
            let res = await fetch('https://meme-api.herokuapp.com/gimme/' + encodeURI(q || 'meme'))
            await conn.reply(from, global.db.mess.wait, msg)
            let json = await res.json()
            if (!json.url) return conn.replyfrom, 'Media tidak ditemukan!', msg)
			await conn.sendImage(from, json.url, json.title, msg)
			} catch (e) {
				conn.reply(from, require('util').format(e), msg)
				}
			}
			break
            case prefix + 'term': {
            	conn.reply(from, 'Executing...', msg)
            let cp = require('child_process')
            let exec = require('util').promisify(cp.exec).bind(cp)
            let o
            	try {
            	o = await exec(q)
			} catch (e) {
				o = e
			} finally {
				let { stdout, stderr } = o
				if (stdout) conn.reply(from, stdout, msg)
				if (stderr) conn.reply(from, stderr, msg)
			}
			}
			break
            case prefix + 's':
            case prefix + 'sgif':
			case prefix + 'stiker':
			case prefix + 'sticker': {
				let pack = q.split`|`
				//if (!author) { isGroup ? groupMetadata.subject : author }
					if (msg.isImage || msg.isQuotedImage) {
						let img = isQuotedMsg ? await quotedMsg.toBuffer() : await msg.toBuffer()
						if (!img) return conn.reply(from, `Reply gambar dengan caption ${prefix + command}`, msg)
						conn.sendImageAsSticker(from, img.toString('base64'), msg, { pack: pack[0] ? pack[0] : msg.pushname, author: pack[1] ? pack[1] : isGroup ? groupMetadata.subject : "︎ ︎ ︎" })
					} else if (msg.isVideo || msg.isQuotedVideo) {
						if (msg.message[msg.type].seconds > 11 || quotedMsg[quotedMsg.type].seconds > 11) return conn.reply(from, 'Maksimal 10 detik!', msg)
						let img = isQuotedMsg ? await quotedMsg.toBuffer() : await msg.toBuffer()
						if (!img) return conn.reply(from, `Reply video/gif dengan caption ${prefix + command}`, msg)
						conn.sendMp4AsSticker(from, img.toString('base64'), msg, { pack: pack[0] ? pack[0] : msg.pushname, author: pack[1] ? pack[1] : isGroup ? groupMetadata.subject : "︎ ︎ ︎" })
					} else if (msg.isQuotedSticker) {
						let img = isQuotedMsg ? await quotedMsg.toBuffer() : await msg.toBuffer()
						if (!img) return conn.reply(from, `Reply sticker dengan caption ${prefix + command}`, msg)
						conn.sendImageAsSticker(from, img.toString('base64'), msg, { pack: pack[0] ? pack[0] : msg.pushname, author: pack[1] ? pack[1] : isGroup ? groupMetadata.subject : "︎ ︎ ︎" })
					} else {
						conn.reply(from, 'Conversion failed', msg)
						}
					}
					break
            case prefix + 'tovideo':
            case prefix + 'toimg': {
                if (msg.isQuotedSticker) {
                    let isAnimated = quotedMsg[quotedMsg.type].isAnimated
                    if (isAnimated) {
                        const media = await quotedMsg.toBuffer()
                        webpToMp4(media)
                            .then((res) => conn.sendVideo(from, res, 'Nih kak', msg))
                            .catch((err) => {
                                console.log(err)
                                conn.reply(from, require('util').format(err), msg)
                            })
                    } else {
                        const media = await quotedMsg.toBuffer()
                        webpToPng(media)
                            .then((res) => {
                                conn.sendImage(from, res, 'Nih kak', msg)
                            })
                            .catch((err) => {
                                console.log(err)
                                conn.reply(from, require('util').format(err), msg)
                            })
                    }
                } else {
                    let tmt = `Reply sticker dengan caption ${command}`
                    conn.reply(from, tmt, msg)
                }
            }
            break
            case prefix + 'ytmp4': {
                if (!q) return conn.reply(from, `Penggunaan ${command} link youtube`, msg)
                if (!ytIdRegex.test(args[1])) return conn.reply(from, 'Harap berikan link yang benar', msg)
                await conn.reply(from, global.db.mess.wait, msg)
                await api.ytmp4(args[1])
                    .then(res => {
                        conn.sendImage(from, res.image, res.caption, msg)
                        //if (res.isLimit) return conn.reply(from, 'Media terlalu besar silahkan download sendiri\n\n' + res.video, msg)
                        conn.sendVideo(from, res.video, '', msg)
                    })
                    .catch(err => {
                        console.log(err)
                        conn.reply(from, require('util').format(err), msg)
                    })
            }
            break
            case prefix + 'ytmp3': {
                if (!q) return conn.reply(from, `Penggunaan ${command} link youtube`, msg)
                if (!ytIdRegex.test(args[1])) return conn.reply(from, 'Harap berikan link yang benar', msg)
                await conn.reply(from, global.db.mess.wait, msg)
                await api.ytmp3(args[1])
                    .then(res => {
                        conn.sendImage(from, res.image, res.caption, msg)
                        //if (res.isLimit) return conn.reply(from, 'Media terlalu besar silahkan download sendiri\n\n' + res.video, msg)
                        conn.sendMessage(from, { url: res.audio }, 'audioMessage', { quoted: msg })
                    })
                    .catch(err => {
                        console.log(err)
                        conn.reply(from, require('util').format(err), msg)
                    })
            }
            break
            case prefix + 'play': {
            	if (!q) return conn.reply(from, `Penggunaan ${command} judul`, msg, {messageId: '#playsong'})
            	await conn.reply(from, global.db.mess.wait, msg)
            	await require('axios').get('https://api.zeks.xyz/api/ytplaymp3/2?apikey=Nyarlathotep&q=' + q)
            	.then(res => {
            	conn.reply(from, '*Data berhasil didapatkan!*\n\n_Silahkan tunggu, file media sedang dikirim mungkin butuh waktu beberapa menit_', msg, { contextInfo: { externalAdReply: { title: res.data.result.title, body: 'Duration ' + res.data.result.duration + ', Size ' + res.data.result.size, thumbnailUrl: res.data.result.thumb, sourceUrl: res.data.result.link }}})
            	conn.sendMessage(from, { url: res.data.result.link }, 'audioMessage', { quoted: msg, contextInfo: { externalAdReply: { title: res.data.result.title, mediaType: 2, thumbnailUrl: res.data.result.thumb, mediaUrl: res.data.result.source }}})
            conn.sendMessage(from, { url: res.data.result.link }, 'documentMessage', { quoted: msg, mimetype: 'audio/mp3', filename: res.data.result.title + '.mp3', contextInfo: { externalAdReply: { title: res.data.result.title, mediaType: 2, thumbnailUrl: res.data.result.thumb, mediaUrl: res.data.result.source }}})
            })
            	.catch(err => {
            	conn.reply(from, require('util').format(err), msg)
            })
            }
            break
            case prefix + 'yts':
            case prefix + 'ytsearch': {
            	if (!q) return conn.reply(from, `Penggunaan ${command} query`, msg)
            	await conn.reply(from, global.db.mess.wait, msg)
            	let res = await yts(q)
            	let kant = `「 YOUTUBE SEARCH 」\n\n`
            	for (let i of res.videos) {
            	kant += `\n*- Title:* ${i.title}\n`
            	kant += `*- Views:* ${i.views}\n`
            	kant += `*- Uploaded:* ${i.ago}\n`
            kant += `*- Duration:* ${i.timestamp}\n`
            kant += `*- By:* ${i.author.name}\n`
            kant += `*- Link:* ${i.url}\n\n`
            }
            conn.sendImage(from, res.all[0].image, kant.trim(), msg)
            }
            break
            case prefix + 'tiktok':
            case prefix + 'tiktoknowm': {
                if (!q) return conn.reply(from, `Penggunaan ${command} link tiktok`, msg)
                if (!isUrl(args[1]) && !args[1].includes('tiktok.com')) return conn.reply(from, 'Harap berikan link yang benar', msg)
                await conn.reply(from, global.db.mess.wait, msg)
                await api.tiktok(args[1])
                    .then(res => conn.sendVideo(from, res.nowm, res.caption, msg))
                    .catch(err => {
                        console.log(err)
                        conn.reply(from, require('util').format(err), msg)
                    })
            }
            break
            case prefix + 'tiktokwm': {
                if (!q) return conn.reply(from, `Penggunaan ${command} link tiktok`, msg)
                if (!isUrl(args[1]) && !args[1].includes('tiktok.com')) return conn.reply(from, 'Harap berikan link yang benar', msg)
                await conn.reply(from, global.db.mess.wait, msg)
                await api.tiktok(args[1])
                    .then(res => conn.sendVideo(from, res.wm, res.caption, msg))
                    .catch(err => {
                        console.log(err)
                        conn.reply(from, require('util').format(err), msg)
                    })
            }
            break
            case prefix + 'tiktokmusic': {
                if (!q) return conn.reply(from, `Penggunaan ${command} link tiktok`, msg)
                if (!isUrl(args[1]) && !args[1].includes('tiktok.com')) return conn.reply(from, 'Harap berikan link yang benar', msg)
                await conn.reply(from, global.db.mess.wait, msg)
                await api.tiktok(args[1])
                    .then(res => {
                        toAudio(res.nowm)
                            .then(res => conn.sendAudio(from, res, msg))
                            .catch(err => conn.reply(from, require('util').format(err), msg))
                    })
                    .catch(err => {
                        console.log(err)
                        conn.reply(from, require('util').format(err), msg)
                    })
            }
            break
            case prefix + 'tomp3': {
                if (!msg.isQuotedVideo && !msg.isQuotedAudio) return conn.reply(from, 'Reply video', msg)
                let media = await quotedMsg.toBuffer()
                await conn.reply(from, global.db.mess.wait, msg)
                await toAudio(media)
                    .then(res => conn.sendAudio(from, res, msg))
                    .catch(err => {
                        console.log(err)
                        conn.reply(from, require('util').format(err), msg)
                    })
            }
            break
            case prefix + 'toptt': {
                if (!msg.isQuotedVideo && !msg.isQuotedAudio) return conn.reply(from, 'Reply video / audio', msg)
                let media = await quotedMsg.toBuffer()
                await conn.reply(from, global.db.mess.wait, msg)
                if (msg.isQuotedAudio) return conn.sendAudio(from, media, msg, true)
                await toAudio(media)
                    .then(res => conn.sendAudio(from, res, msg))
                    .catch(err => {
                        console.log(err)
                        conn.reply(from, require('util').format(err), msg)
                    })
            }
            break
            case prefix + 'pinterest':
            case prefix + 'pin': {
                if (!q) return conn.reply(from, `Penggunaan ${command} query`, msg)
                await conn.reply(from, global.db.mess.wait, msg)
                await api.pinterest(q)
                    .then(res => conn.sendImage(from, res, '*Pencarian :* ' + q + '\n*URL :* ' + res, msg))
                    .catch(err => {
                        console.log(err)
                        conn.reply(from, require('util').format(err), msg)
                    })
            }
            break
            case prefix + 'ssweb':
            case prefix + 'ss': {
                if (!q) return conn.reply(from, `Penggunaan ${command} url`, msg)
                if (!isUrl(args[1])) return conn.reply(from, 'Harap berikan link yang benar', msg)
                await conn.reply(from, global.db.mess.wait, msg)
                await conn.sendImage(from, global.config.api + '/screenshot?apikey=' + global.config.apikey + '&url=' + args[1], '', msg)
                    .catch(err => {
                        console.log(err)
                        conn.reply(from, require('util').format(err), msg)
                    })
            }
            break
            /*case prefix + 'tourl': {
                if (!msg.isMedia && !msg.isQuotedMedia) return conn.reply(from, 'Kirim / reply media', msg)
                let media = msg.isQuotedMedia ? await quotedMsg.toBuffer() : await msg.toBuffer()
                await conn.reply(from, global.db.mess.wait, msg)
                await api.upload(media)
                    .then(res => conn.reply(from, res, msg))
                    .catch(err => {
                        console.log(err)
                        conn.reply(from, require('util').format(err), msg)
                    })
            }
            break*/
            case prefix + 'igstalk': {
                if (!q) return conn.reply(from, `Penggunaan ${command} username`, msg)
                await conn.reply(from, global.db.mess.wait, msg)
                await api.igstalk(q)
                    .then(res => conn.sendImage(from, res.image, res.caption, msg))
                    .catch(err => {
                        console.log(err)
                        conn.reply(from, require('util').format(err), msg)
                    })
            }
            break
            case prefix + 'instagram':
            case prefix + 'ig':
            case prefix + 'igdl': {
                if (!q) return conn.reply(from, `Penggunaan ${command} link ig`, msg)
                if (!isUrl(args[1]) && !args[1].includes('instagram.com')) return conn.reply(from, 'Harap berikan link yang benar', msg)
                await conn.reply(from, global.db.mess.wait, msg)
                await api.igdl(args[1])
                    .then(res => {
                        let post = res.post
                        for (let i = 0; i < post.length; i++) {
                            let cp = i == 0 ? res.caption : ''
                            if (post[i].type == 'image') conn.sendImage(from, post[i].url, cp, msg)
                            else conn.sendVideo(from, post[i].url, cp, msg)
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        conn.reply(from, require('util').format(err), msg)
                    })
            }
            break
            case prefix + 'flower':
            case prefix + 'shadow-text':
            case prefix + 'write-text': {
                if (!q) return conn.reply(from, `Penggunaan ${command} text`, msg)
                await conn.reply(from, global.db.mess.wait, msg)
                await api.photooxy(q, command.slice(1))
                    .then(res => conn.sendMessage(from, { url: res.result }, 'imageMessage', { quoted: msg }))
                    .catch(err => {
                        console.log(err)
                        conn.reply(from, require('util').format(err), msg)
                    })
            }
            break
            case prefix + 'artinama': {
                if (!q) return conn.reply(from, `Penggunaan ${command} nama`, msg)
                await conn.reply(from, global.db.mess.wait, msg)
                await api.artinama(q)
                    .then(res => conn.reply(from, res, msg))
                    .catch(err => {
                        console.log(err)
                        conn.reply(from, require('util').format(err), msg)
                    })
            }
            break
            case prefix + 'artimimpi': {
                if (!q) return conn.reply(from, `Penggunaan ${command} nama`, msg)
                await conn.reply(from, global.db.mess.wait, msg)
                await api.artimimpi(q)
                    .then(res => conn.reply(from, res, msg))
                    .catch(err => {
                        console.log(err)
                        conn.reply(from, require('util').format(err), msg)
                    })
            }
            break
            case prefix + 'ramaljodoh':
            case prefix + 'ramalanjodoh': {
                if (!q) return conn.reply(from, `Penggunaan ${command} nama kamu | nama jodohmu`, msg)
                if (!q.includes('|')) return conn.reply(from, `Penggunaan ${command} nama kamu | nama jodohmu`, msg)
                if (q.split('|').length < 2) return conn.reply(from, `Penggunaan ${command} nama kamu | nama jodohmu`, msg)
                await conn.reply(from, global.db.mess.wait, msg)
                await api.ramaljodoh(q.split('|')[0], q.split('|')[1])
                    .then(res => {
                        conn.sendImage(from, res.image, res.caption, msg)
                    })
                    .catch(err => {
                        console.log(err)
                        conn.reply(from, require('util').format(err), msg)
                    })
            }
            break
            case prefix + 'call': {
                if (!q) return conn.reply(from, `Penggunaan ${command} nomor(8xxxx)\n\nJangan menggunakan 62`, msg)
                if (isNaN(args[1])) return conn.reply(from, `Penggunaan ${command} nomor(8xxxx)\n\nJangan menggunakan 62`, msg)
                if (args[1].startsWith('62')) args[1].replace('62', '')
                await conn.reply(from, global.db.mess.wait, msg)
                await api.call(args[1])
                    .then(res => conn.reply(from, res, msg))
                    .catch(err => {
                        console.log(err)
                        conn.reply(from, require('util').format(err), msg)
                    })
            }
            break
            case prefix + 'jadibot': {
            	if (fromMe) return conn.reply(from, 'Tidak bisa jadibot di dalam bot', msg)
            	jadibot(conn, from)
            }
            break
            case prefix + 'stopjadibot': {
            	if (!fromMe) return conn.reply(from, 'Kamu tidak terdaftar dalam list bot', msg)
            	stopjadibot(conn, from, msg)
            }
            break
            case prefix + 'listjadibot': {
            	let tekss = '「 *LIST JADIBOT* 」\n'
            	for (let i of listjadibot) {
            	tekss += `Nomor : ${i.jid.split('@')[0]}\nNama : ${i.name}\nDevice : ${i.phone.device_manufacturer}\nModel : ${i.phone.device_model}\n\n`
            	}
            	conn.reply(from, tekss, msg)
            }
            break
            }
        } catch (err) {
            console.log(err)
            conn.reply(conn.user.jid, require('util').format(err), null)
            conn.reply('62813828362494@s.whatsapp.net', require('util').format(err), null)
        }
    }
}