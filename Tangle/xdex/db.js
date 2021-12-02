let sqlite3 = require("sqlite3");
let db = new sqlite3.Database("XDEX.db");

let hexZeroes = bytes => {
    return "0x" + "".padStart(bytes * 2, '0')
};
let tables = [
    {
        name: "ids",
        def:
            `name text unique,
            count integer default 0`,
        reset: true,
    },
    {
        name: "pairs",
        def:
            `pair text unique,
            reserve0 text default "${hexZeroes(32)}",
            reserve1 text default "${hexZeroes(32)}"`,
        reset: true
    },
    {
        name: "addLiquidityRequests",
        def:
            `id text unique,
             msgSender text,
             payAmount text,
             payChain text,
             gas0 text,
             gas1 text,
             gasPrice0 text,
             gasPrice1 text,
             chain0 text,
             chain1 text,
             token0 text,
             token1 text,
             amount0 text,
             amount1 text,
             timestamp text,
             paidAmount text,
             realAmount0 text,
             realAmount1 text,
             status0 text,
             status1 text`,
         reset: true
    },
    {
        name: "events",
        def:
            `name text unique,
            fromBlock text,
            toBlock text`,
        reset: true
    }
];
for (let table of tables) {
    db.serialize(() => {
        if (table.reset) db.run(`drop table if exists ${table.name}`);
        db.run(`create table if not exists ${table.name} (${table.def})`);
        if (table.reset && table.name == "events") {
            db.run(
                `insert into events
                (name, fromBlock, toBlock)
                values("PaymentReceived", "0", "0")`
            );
        }
    });
};

module.exports = db;
