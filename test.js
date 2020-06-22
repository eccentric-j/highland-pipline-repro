const _ = require('highland');
const fs = require('fs');
const Pump = require('util').promisify(require('stream').pipeline);

const double = x => x*2;

const consumer = _.curry(({ func, msg }, data) => _(data)
    .split()
    .map(func)
    .tap(x => console.log(msg, x))
    .toNodeStream()
);

const main = async () => {
    const fileStream = fs.createReadStream('test.info', { encoding:  'utf8' });
    const publisher = consumer({ func: double, msg: 'Doubled = ' });

    await Pump(fileStream, publisher);

    console.log('DONE');
};

main();
