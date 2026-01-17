const fs = require('fs');
const path = require('path');

async function convert() {
    try {
        const pngToIco = require('png-to-ico');
        const input = path.join(__dirname, 'assets/icon.png');
        const output = path.join(__dirname, 'assets/icon.ico');

        const buf = await pngToIco(input);
        fs.writeFileSync(output, buf);
        console.log('Icon converted successfully!');
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

convert();
