const BaseCommand = require('../structures/BaseCommand');

const Endpoints = require('eris/lib/rest/Endpoints');

class SlowmodeCommand extends BaseCommand {
    constructor() {
        super({
            name: 'slowmode',
            category: bu.CommandType.ADMIN,
            usage: 'slowmode [time]',
            info: 'Sets the channel\'s slowmode to 1 message every `time` seconds. Leave empty to disable slowmode.',
            flags: [{ flag: 'c', word: 'channel', desc: 'The channel to put under slowmode' }]
        });
    }

    async execute(msg, words, text) {
        let input = bu.parseInput(this.flags, words);


        let time = parseInt(input.undefined[0]);
        if (isNaN(time)) time = 0;

        let channel = msg.channel.id;
        if (input.c && /(\d+)/.test(input.c[0])) {
            let c = input.c[0].match(/(\d+)/)[1];
            let guild = bot.channelGuildMap[channel];
            if (guild == msg.guild.id) channel = c;
        }

        let endpoint = Endpoints.CHANNEL(channel);

        await bot.requestHandler.request('PATCH', endpoint, true, {
            rate_limit_per_user: time
        });

        let out = ':ok_hand: ';
        if (time === 0) out += 'Slowmode has been disabled.';
        else out += `Slowmode has been set to 1 message every **${time} seconds**.`;
        return await bu.send(msg, out);
    }
}

module.exports = SlowmodeCommand;
