const BaseCommand = require('../structures/BaseCommand');
const moment = require('moment-timezone');

const logLogChannel = '254034744134598676';

async function deleteLogs() {
    const date = bu.makeSnowflake(Date.now() - (7 * 24 * 60 * 60 * 1000));
    return await r.table('chatlogs')
        .between(r.minval, date, {
            index: 'id'
        }).delete().run();
}


class PurgelogsCommand extends BaseCommand {
    constructor() {
        super({
            name: 'purgelogs',
            category: bu.CommandType.CAT
        });
    }

    async execute(msg, words, text) {
        if (msg.author.id === bu.CAT_ID) {
            await bu.send(msg, 'Ok, I\'ll purge all chat log records that are over a week old. This is going to take a while, so I\'ll ping you once I\'m done.');
            let start = moment();
            let returnObj = await deleteLogs();
            let end = moment();
            let diff = moment.duration(end - start);
            bu.send(msg, `Ok, ${msg.author.mention}! I'm finished!
${returnObj.deleted} records were deleted.
The operation took:
    ${diff.days()} days
    ${diff.hours()} hours
    ${diff.minutes()} minutes
    ${diff.seconds()} seconds
    ${diff.milliseconds()} milliseconds`);
        }
    }

    async event(args) {
        let tomorrow = moment(moment().format('YYYY-MM-DD')).add(1, 'd');
        await bu.events.insert({
            type: 'purgelogs',
            endtime: r.epochTime(tomorrow.unix())
        });

        await bu.send(logLogChannel, 'Doing a daily purge of logs that are over a week old.');
        let start = moment();
        let returnObj = await deleteLogs();
        let end = moment();
        let diff = moment.duration(end - start);
        bu.send(logLogChannel, `I'm finished!
    ${returnObj.deleted} records were deleted.
    The operation took:
        ${diff.days()} days
        ${diff.hours()} hours
        ${diff.minutes()} minutes
        ${diff.seconds()} seconds
        ${diff.milliseconds()} milliseconds
    
    The next operation will be ${moment.duration(tomorrow - moment()).humanize(true)}`);
    };
}

module.exports = PurgelogsCommand;
