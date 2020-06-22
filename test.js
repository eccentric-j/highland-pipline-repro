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

function transformStream (streamFn, opts) {
    const input = _();
    const output = streamFn(input);
    let subscribed = false;

    const xfStream = new stream.Transform(Object.assign({
        objectMode: true,
        transform (chunk, encoding, callback) {
            // we only want to create this subscription once
            if (!subscribed) {
                output
                  .errors((err, push) => {
                      // end the highland stream
                      push(_.nil);
                      // destroy outer transform stream with error
                      this.destroy(err);
                  })
                  .each(x => this.push(x))
                subscribed = true;
            }
            input.write(chunk);
            callback();
        },

        flush (callback) {
            input.end();
        }
    }, opts))

    return xfStream;
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
