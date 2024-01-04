import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, TupleBuilder, TupleReader, toNano } from 'ton-core';
import { Task4 } from '../wrappers/Task4';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';
import * as bigintConversion from 'bigint-conversion';

describe('Task4', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task4');
    });

    let blockchain: Blockchain;
    let task4: SandboxContract<Task4>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task4 = blockchain.openContract(Task4.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task4.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task4.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task4Basic are ready to use
    });

    it('basic 3x3', async () => {
        // basic maze
        // S . .
        // . X .
        // . . E

        // solved maze
        // S ! .
        // . X !
        // . . E
        let row = new TupleBuilder;
        let maze = new TupleBuilder;
        row.writeNumber(bigintConversion.textToBigint('S'));
        row.writeNumber(bigintConversion.textToBigint('X'));
        row.writeNumber(bigintConversion.textToBigint('.'));
        let row1 = row.build();
        maze.writeTuple(row1);
        row = new TupleBuilder;
        row.writeNumber(bigintConversion.textToBigint('X'));
        row.writeNumber(bigintConversion.textToBigint('.'));
        row.writeNumber(bigintConversion.textToBigint('.'));
        row1 = row.build();
        maze.writeTuple(row1);
        row = new TupleBuilder;
        row.writeNumber(bigintConversion.textToBigint('.'));
        row.writeNumber(bigintConversion.textToBigint('.'));
        row.writeNumber(bigintConversion.textToBigint('E'));
        row1 = row.build();
        maze.writeTuple(row1);
        let init_maze = maze.build();

        let result = await task4.getSolve(3n, 3n, init_maze);
        console.log("GasUsed 3*3 ", result.gasUsed);
        let out_maze = result.stack;
        let walls = out_maze.readBigNumber();
        let probability = out_maze.readBigNumber();
        let lenght = out_maze.readBigNumber();
        expect([walls, probability, lenght]).toEqual([0n, 0n, 2n]);
    });
    it('example 8x5', async () => {
        let row = new TupleBuilder;
        let maze = new TupleBuilder;
        row.writeNumber(bigintConversion.textToBigint('S'));
        row.writeNumber(bigintConversion.textToBigint('X'));
        row.writeNumber(bigintConversion.textToBigint('.'));
        row.writeNumber(bigintConversion.textToBigint('?'));
        row.writeNumber(bigintConversion.textToBigint('X'));
        let row1 = row.build();
        maze.writeTuple(row1);
        row = new TupleBuilder;
        row.writeNumber(bigintConversion.textToBigint('.'));
        row.writeNumber(bigintConversion.textToBigint('X'));
        row.writeNumber(bigintConversion.textToBigint('X'));
        row.writeNumber(bigintConversion.textToBigint('.'));
        row.writeNumber(bigintConversion.textToBigint('X'));
        row1 = row.build();
        maze.writeTuple(row1);
        row = new TupleBuilder;
        row.writeNumber(bigintConversion.textToBigint('X'));
        row.writeNumber(bigintConversion.textToBigint('.'));
        row.writeNumber(bigintConversion.textToBigint('?'));
        row.writeNumber(bigintConversion.textToBigint('.'));
        row.writeNumber(bigintConversion.textToBigint('.'));
        row1 = row.build();
        maze.writeTuple(row1);
        row = new TupleBuilder;
        row.writeNumber(bigintConversion.textToBigint('.'));
        row.writeNumber(bigintConversion.textToBigint('?'));
        row.writeNumber(bigintConversion.textToBigint('?'));
        row.writeNumber(bigintConversion.textToBigint('.'));
        row.writeNumber(bigintConversion.textToBigint('.'));
        row1 = row.build();
        maze.writeTuple(row1);
        row = new TupleBuilder;
        row.writeNumber(bigintConversion.textToBigint('X'));
        row.writeNumber(bigintConversion.textToBigint('?'));
        row.writeNumber(bigintConversion.textToBigint('.'));
        row.writeNumber(bigintConversion.textToBigint('.'));
        row.writeNumber(bigintConversion.textToBigint('.'));
        row1 = row.build();
        maze.writeTuple(row1);
        row = new TupleBuilder;
        row.writeNumber(bigintConversion.textToBigint('.'));
        row.writeNumber(bigintConversion.textToBigint('.'));
        row.writeNumber(bigintConversion.textToBigint('X'));
        row.writeNumber(bigintConversion.textToBigint('.'));
        row.writeNumber(bigintConversion.textToBigint('X'));
        row1 = row.build();
        maze.writeTuple(row1);
        row = new TupleBuilder;
        row.writeNumber(bigintConversion.textToBigint('.'));
        row.writeNumber(bigintConversion.textToBigint('.'));
        row.writeNumber(bigintConversion.textToBigint('?'));
        row.writeNumber(bigintConversion.textToBigint('.'));
        row.writeNumber(bigintConversion.textToBigint('.'));
        row1 = row.build();
        maze.writeTuple(row1);
        row = new TupleBuilder;
        row.writeNumber(bigintConversion.textToBigint('X'));
        row.writeNumber(bigintConversion.textToBigint('.'));
        row.writeNumber(bigintConversion.textToBigint('.'));
        row.writeNumber(bigintConversion.textToBigint('.'));
        row.writeNumber(bigintConversion.textToBigint('E'));
        row1 = row.build();
        maze.writeTuple(row1);
        let init_maze = maze.build();

        let result = await task4.getSolve(8n, 5n, init_maze);
        console.log("GasUsed 8*5 ", result.gasUsed);
        let out_maze = result.stack;
        let walls = out_maze.readBigNumber();
        let probability = out_maze.readBigNumber();
        let lenght = out_maze.readBigNumber();
        expect([walls, probability, lenght]).toEqual([0n, 1n, 7n]);

    });

    it('empty 31x31', async () => {
        let row = new TupleBuilder;
        let maze = new TupleBuilder;
        row.writeNumber(bigintConversion.textToBigint('S'));
        for (var i = 0; i < 31; i++) {
            row.writeNumber(bigintConversion.textToBigint('.'));
        }
        let row1 = row.build();
        maze.writeTuple(row1);
        row = new TupleBuilder;
        for (var j = 0; j < 29; j++) {
            for (var i = 0; i < 31; i++) {
                row.writeNumber(bigintConversion.textToBigint('.'));
            }
            row1 = row.build();
            maze.writeTuple(row1);
            row = new TupleBuilder;
        }
        for (var i = 0; i < 30; i++) {
            row.writeNumber(bigintConversion.textToBigint('.'));
        }
        row.writeNumber(bigintConversion.textToBigint('E'));
        row1 = row.build();
        maze.writeTuple(row1);
        let init_maze = maze.build();

        let result = await task4.getSolve(31n, 31n, init_maze);
        console.log("GasUsed 31*31 ", result.gasUsed);
        let out_maze = result.stack;
        let walls = out_maze.readBigNumber();
        let probability = out_maze.readBigNumber();
        let lenght = out_maze.readBigNumber();
        expect([walls, probability, lenght]).toEqual([0n, 0n, 30n]);
    });
    it('snail 31x31', async () => {
        let maze = new TupleBuilder;

        // row 0 +
        let row = new TupleBuilder;
        for (var i = 0; i < 31; i++) {row.writeNumber(bigintConversion.textToBigint('.'));}
        let row1 = row.build();
        maze.writeTuple(row1);

        // row 1 +
        row = new TupleBuilder;
        row.writeNumber(bigintConversion.textToBigint('.'));
        for (var i = 0; i < 29; i++) {row.writeNumber(bigintConversion.textToBigint('?'));}
        row.writeNumber(bigintConversion.textToBigint('.'));
        row1 = row.build();
        maze.writeTuple(row1);

        // row 2 +
        row = new TupleBuilder;
        for (var i = 0; i < 2; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        for (var i = 0; i < 26; i++) {row.writeNumber(bigintConversion.textToBigint('.'));}
        for (var i = 0; i < 3; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        row1 = row.build();
        maze.writeTuple(row1);

        // row 3 +
        row = new TupleBuilder;
        for (var i = 0; i < 3; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        for (var i = 0; i < 25; i++) {row.writeNumber(bigintConversion.textToBigint('?'));}
        for (var i = 0; i < 3; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        row1 = row.build();
        maze.writeTuple(row1);

        // row 4 +
        row = new TupleBuilder;
        for (var i = 0; i < 4; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        for (var i = 0; i < 22; i++) {row.writeNumber(bigintConversion.textToBigint('.'));}
        for (var i = 0; i < 5; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        row1 = row.build();
        maze.writeTuple(row1);

        // row 5 +
        row = new TupleBuilder;
        for (var i = 0; i < 5; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        for (var i = 0; i < 21; i++) {row.writeNumber(bigintConversion.textToBigint('?'));}
        for (var i = 0; i < 5; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        row1 = row.build();
        maze.writeTuple(row1);

        // row 6 +
        row = new TupleBuilder;
        for (var i = 0; i < 6; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        for (var i = 0; i < 18; i++) {row.writeNumber(bigintConversion.textToBigint('.'));}
        for (var i = 0; i < 7; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        row1 = row.build();
        maze.writeTuple(row1);

        // row 7 +
        row = new TupleBuilder;
        for (var i = 0; i < 7; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        for (var i = 0; i < 17; i++) {row.writeNumber(bigintConversion.textToBigint('?'));}
        for (var i = 0; i < 7; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        row1 = row.build();
        maze.writeTuple(row1);

        // row 8 +
        row = new TupleBuilder;
        for (var i = 0; i < 8; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        for (var i = 0; i < 14; i++) {row.writeNumber(bigintConversion.textToBigint('.'));}
        for (var i = 0; i < 9; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        row1 = row.build();
        maze.writeTuple(row1);

        // row 9 +
        row = new TupleBuilder;
        for (var i = 0; i < 9; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        for (var i = 0; i < 13; i++) {row.writeNumber(bigintConversion.textToBigint('?'));}
        for (var i = 0; i < 9; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        row1 = row.build();
        maze.writeTuple(row1);

        // row 10 +
        row = new TupleBuilder;
        for (var i = 0; i < 10; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        for (var i = 0; i < 10; i++) {row.writeNumber(bigintConversion.textToBigint('.'));}
        for (var i = 0; i < 11; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        row1 = row.build();
        maze.writeTuple(row1);

        // row 11 +
        row = new TupleBuilder;
        for (var i = 0; i < 11; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        for (var i = 0; i < 9; i++) {row.writeNumber(bigintConversion.textToBigint('?'));}
        for (var i = 0; i < 11; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        row1 = row.build();
        maze.writeTuple(row1);

        // row 12 +
        row = new TupleBuilder;
        for (var i = 0; i < 12; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        for (var i = 0; i < 6; i++) {row.writeNumber(bigintConversion.textToBigint('.'));}
        for (var i = 0; i < 13; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        row1 = row.build();
        maze.writeTuple(row1);

        // row 13 +
        row = new TupleBuilder;
        for (var i = 0; i < 13; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        for (var i = 0; i < 5; i++) {row.writeNumber(bigintConversion.textToBigint('?'));}
        for (var i = 0; i < 13; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        row1 = row.build();
        maze.writeTuple(row1);

        // row 14 +
        row = new TupleBuilder;
        for (var i = 0; i < 14; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        row.writeNumber(bigintConversion.textToBigint('E'));
        row.writeNumber(bigintConversion.textToBigint('X'));
        for (var i = 0; i < 15; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        row1 = row.build();
        maze.writeTuple(row1);

        // row 15 +
        row = new TupleBuilder;
        for (var i = 0; i < 13; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        for (var i = 0; i < 3; i++) {row.writeNumber(bigintConversion.textToBigint('?'));}
        for (var i = 0; i < 15; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        row1 = row.build();
        maze.writeTuple(row1);

        // row 16 +
        row = new TupleBuilder;
        for (var i = 0; i < 12; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        for (var i = 0; i < 4; i++) {row.writeNumber(bigintConversion.textToBigint('.'));}
        for (var i = 0; i < 15; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        row1 = row.build();
        maze.writeTuple(row1);

        // row 17 +
        row = new TupleBuilder;
        for (var i = 0; i < 11; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        for (var i = 0; i < 7; i++) {row.writeNumber(bigintConversion.textToBigint('?'));}
        for (var i = 0; i < 13; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        row1 = row.build();
        maze.writeTuple(row1);

        // row 18 +
        row = new TupleBuilder;
        for (var i = 0; i < 10; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        for (var i = 0; i < 8; i++) {row.writeNumber(bigintConversion.textToBigint('.'));}
        for (var i = 0; i < 13; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        row1 = row.build();
        maze.writeTuple(row1);

        // row 19 +
        row = new TupleBuilder;
        for (var i = 0; i < 9; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        for (var i = 0; i < 11; i++) {row.writeNumber(bigintConversion.textToBigint('?'));}
        for (var i = 0; i < 11; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        row1 = row.build();
        maze.writeTuple(row1);

        // row 20 +
        row = new TupleBuilder;
        for (var i = 0; i < 8; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        for (var i = 0; i < 12; i++) {row.writeNumber(bigintConversion.textToBigint('.'));}
        for (var i = 0; i < 11; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        row1 = row.build();
        maze.writeTuple(row1);

        // row 21 +
        row = new TupleBuilder;
        for (var i = 0; i < 7; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        for (var i = 0; i < 15; i++) {row.writeNumber(bigintConversion.textToBigint('?'));}
        for (var i = 0; i < 9; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        row1 = row.build();
        maze.writeTuple(row1);

        // row 22 +
        row = new TupleBuilder;
        for (var i = 0; i < 6; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        for (var i = 0; i < 16; i++) {row.writeNumber(bigintConversion.textToBigint('.'));}
        for (var i = 0; i < 9; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        row1 = row.build();
        maze.writeTuple(row1);

        // row 23 +
        row = new TupleBuilder;
        for (var i = 0; i < 5; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        for (var i = 0; i < 19; i++) {row.writeNumber(bigintConversion.textToBigint('?'));}
        for (var i = 0; i < 7; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        row1 = row.build();
        maze.writeTuple(row1);

        // row 24 +
        row = new TupleBuilder;
        for (var i = 0; i < 4; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        for (var i = 0; i < 20; i++) {row.writeNumber(bigintConversion.textToBigint('.'));}
        for (var i = 0; i < 7; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        row1 = row.build();
        maze.writeTuple(row1);

        // row 25 +
        row = new TupleBuilder;
        for (var i = 0; i < 3; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        for (var i = 0; i < 23; i++) {row.writeNumber(bigintConversion.textToBigint('?'));}
        for (var i = 0; i < 5; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        row1 = row.build();
        maze.writeTuple(row1);

        // row 26 +
        row = new TupleBuilder;
        for (var i = 0; i < 2; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        for (var i = 0; i < 24; i++) {row.writeNumber(bigintConversion.textToBigint('.'));}
        for (var i = 0; i < 5; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        row1 = row.build();
        maze.writeTuple(row1);

        // row 27 +
        row = new TupleBuilder;
        for (var i = 0; i < 1; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        for (var i = 0; i < 27; i++) {row.writeNumber(bigintConversion.textToBigint('?'));}
        for (var i = 0; i < 3; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        row1 = row.build();
        maze.writeTuple(row1);

        // row 28 +
        row = new TupleBuilder;
        for (var i = 0; i < 28; i++) {row.writeNumber(bigintConversion.textToBigint('.'));}
        for (var i = 0; i < 3; i++) {i%2==0?row.writeNumber(bigintConversion.textToBigint('.')):row.writeNumber(bigintConversion.textToBigint('?'));}
        row1 = row.build();
        maze.writeTuple(row1);

        // row 29 +
        row = new TupleBuilder;
        for (var i = 0; i < 30; i++) {row.writeNumber(bigintConversion.textToBigint('?'));}
        row.writeNumber(bigintConversion.textToBigint('.'));
        row1 = row.build();
        maze.writeTuple(row1);
        
        // row 30 +
        row = new TupleBuilder;
        row.writeNumber(bigintConversion.textToBigint('S'));
        for (var i = 0; i < 30; i++) {row.writeNumber(bigintConversion.textToBigint('.'));}
        row1 = row.build();
        maze.writeTuple(row1);

        // init maze
        let init_maze = maze.build();
        
        // let foramtted_maze = new Array();
        // let foramtted_maze_row = new Array();

        // let main_reader = new TupleReader(init_maze);
        // for (var i = 0; i < 31; i ++) {
        //     let new_row = main_reader.readTuple();
        //     for (var j = 0; j < 31; j ++) {
        //         foramtted_maze_row.push(bigintConversion.bigintToText(new_row.readBigNumber()));
        //     }
        //     foramtted_maze.push(foramtted_maze_row);
        //     foramtted_maze_row = [];
        // }

        // console.log(foramtted_maze);

        // get output
        let result = await task4.getSolve(31n, 31n, init_maze);
        console.log("GasUsed 31*31 ", result.gasUsed);
        let out_maze = result.stack;
        let walls = out_maze.readBigNumber();
        let probability = out_maze.readBigNumber();
        let lenght = out_maze.readBigNumber();
        //console.log("Walls, prob, length ", [walls, probability, lenght]);
        expect([walls, probability, lenght]).toEqual([0n, 1n, 470n]);
    });
});
