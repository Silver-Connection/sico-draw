const fs = require("fs-extra");
const path = require("path");
const chalk = require('chalk');

const pRoot = path.join(__dirname, "../");
const items = [
    "dist",
    "types"
];

console.log(chalk.green("Clean up..."))
for (let i = 0; i < items.length; i++) {
    const fq = path.join(pRoot, items[i]);
    fs.stat(fq, function(err, stats){
        if (!err) {
            fs.removeSync(fq);
            console.log(fq);
        }
    });
}
