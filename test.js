const _ = require('highland');
const fs = require('fs');
const stream = require("stream");
const Pump = require('util').promisify(stream.pipeline);

const double = x => x*2;

const consumer = _.curry(({ func, msg }, data) => _(data)
    .split()
    .map(func)
    .tap(x => console.log(msg, x))
);

function transformStream (xfn, opts) {
    const source = new stream.Transform(Object.assign({
        transform (chunk, encoding, callback) {
            this.push(chunk);
            callback();
        },

        flush (callback) {
            console.log("Flushing");
            callback();
        }
    }, opts))

    return transform;
}

const main = async () => {
    const fileStream = fs.createReadStream('test.info', { encoding:  'utf8' });
    const publisher = consumer({ func: double, msg: 'Doubled = ' });

    await Pump(fileStream, transformStream(publisher));

    console.log('DONE');
};


main()
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
