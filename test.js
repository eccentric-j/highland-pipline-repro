const _ = require('highland');
const fs = require('fs');
const Pump = require('util').promisify(require('stream').pipeline);

const double = x => x*2;

const consumer = _.curry(({ func, msg }, data) => _(data)
    .map(func)
    .each(x => console.log(msg, x))
    .done(()=> console.log('done consuming...'))
);

const main = async () => {
    const fileStream = fs.createReadStream('test.info');
    const publisher = consumer({func: double, msg: 'Doubled = '});

    await Pump(fileStream, publisher);

    console.log('DONE');
};

main();
