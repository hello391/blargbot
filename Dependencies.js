module.exports = {
    rethinkdbdash: require('rethinkdbdash'),
    moment: require('moment-timezone'),
    util: require('util'),
    path: require('path'),
    request: require('superagent'),
    fs: require('fs'),
    hbs: require('hbs'),
    childProcess: require('child_process'),
    exec: require('child_process').exec,
    Jimp: require('jimp'),
    express: require('express'),
    passport: require('passport'),
    session: require('express-session'),
    Strategy: require('passport-discord').Strategy,
    ws: require('ws'),
    cluster: require('cluster'),
    reload: require('require-reload')(require),
    os: require('os'),
    Eris: require('eris'),
    xml2js: require('xml2js'),
    https: require('https'),
    gm: require('gm'),
    http: require('http'),
    safe: require('safe-regex'),
    twemoji: require('twemoji'),
    svg2png: require('svg2png'),
    Table: require('cli-table'),
    youtubeStream: require('youtube-audio-stream'),
    google: require('googleapis'),
    SC: require('node-soundcloud'),
    emoji: require('node-emoji'),
    wordsearch: require('wordsearch'),
    cleverbot: require('cleverbot'),
    cleverbotIo: require('cleverbot.io'),
    bodyParser: require('body-parser'),
    mkdirp: require('mkdirp'),
    Winston: require('winston'),
    wconfig: require('winston/lib/winston/config'),
    Trello: require('node-trello'),
    babel: require('babel-core'),
    EventEmitter: require('eventemitter3'),
    irc: require('irc'),
    brainfuck: new (require('brainfuck-node'))(),
    chevrotain: require('chevrotain'),
    pg: require('pg-promise')(),
    sequelize: require('sequelize')
};