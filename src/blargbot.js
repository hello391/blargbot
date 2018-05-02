/*
 * @Author: stupid cat
 * @Date: 2017-05-07 19:26:13
 * @Last Modified by: stupid cat
 * @Last Modified time: 2018-05-01 22:57:31
 *
 * This project uses the AGPLv3 license. Please read the license file before using/adapting any of the code.
 */

global.config = require('../config.json');
const Logger = require('./core/logger');
new Logger('MS', config.general.isbeta ? 'debug' : 'info').setGlobal();
process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
});
global.dep = require('./core/dep.js');

const reload = dep.reload(require);
const EventEmitter = require('eventemitter3');
global.Promise = require('bluebird');
const botEmitter = new EventEmitter();
const Spawner = require('./structures/Spawner');

var irc = require('./core/irc.js');

/** CONFIG STUFF **/

global.bu = require('./core/util.js');
bu.init();

/** LOGGING STUFF **/


var VERSION = config.version;

global.bot = new dep.Eris(config.discord.token, { restMode: true, defaultImageFormat: 'png' });
var spawner = new Spawner({
    discord: bot,
    irc
});
global.spawner = spawner;

/**
 * Time to init the bots
 */
async function init() {
    console.init('Initializing discord.');
    await spawner.spawnAll();
    irc.init(VERSION, botEmitter);
    console.verbose('IRC finished?');
    const website = require('./backend/main');
    await website.init();
}

botEmitter.on('ircInit', () => {
    console.init('Discord ready. Time to initialize IRC.');
    irc.init(VERSION, botEmitter);
});

botEmitter.on('reloadBu', () => {
    global.bu = reload('./util.js');
});

const cassandra = require('cassandra-driver');
const cclient = new cassandra.Client({
    contactPoints: config.cassandra.contactPoints, keyspace: config.cassandra.keyspace,
    authProvider: new cassandra.auth.PlainTextAuthProvider(config.cassandra.username, config.cassandra.password)
});
cclient.execute(`
    CREATE TABLE IF NOT EXISTS chatlogs (
        id BIGINT PRIMARY KEY,
        channelid BIGINT,
        guildid BIGINT,
        msgid BIGINT,
        userid BIGINT,
        content TEXT,
        msgtime TIMESTAMP,
        embeds TEXT,
        type INT,
        attachment TEXT
    );
`)
    .then(res => {
        return cclient.execute(`
            CREATE INDEX IF NOT EXISTS i_msgid ON chatlogs (msgid); 
        `);
    })
    .then(res => {
        return cclient.execute(`
            CREATE INDEX IF NOT EXISTS i_userid ON chatlogs (userid); 
        `);
    })
    .then(res => {
        return cclient.execute(`
            CREATE INDEX IF NOT EXISTS i_channelid ON chatlogs (channelid); 
        `);
    }).then(res => {
        return cclient.execute(`
            CREATE INDEX IF NOT EXISTS i_type ON chatlogs (type); 
        `);
    }).catch(err => {
        console.error(err);
    });

init();