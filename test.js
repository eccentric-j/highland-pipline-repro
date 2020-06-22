const _ = require('highland');
const fs = require('fs');
const Pump = require('util').promisify(require('stream').pipeline);

const double = x => x*2;

async function main () {
    await fs.createReadStream('test.info', { encoding: 'utf8' })
        .pipe(_())
        .split()
        .map(double)
        .tap(x => console.log('Doubled = ', x))
        .collect()
        .toPromise(Promise)

    console.log('DONE');
}

main()
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
