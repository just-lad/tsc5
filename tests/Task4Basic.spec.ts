import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, TupleBuilder, toNano } from 'ton-core';
import { Task4Basic } from '../wrappers/Task4Basic';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';
import * as bigintConversion from 'bigint-conversion';

describe('Task4Basic', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task4Basic');
    });

    let blockchain: Blockchain;
    let task4Basic: SandboxContract<Task4Basic>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task4Basic = blockchain.openContract(Task4Basic.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task4Basic.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task4Basic.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task4Basic are ready to use
    });
    // . - no obstacles = 0x2e
    // X - obstacle = 0x58
    // ? - obstacle in superposition = 0x3f
    // S - start = 0x53
    // E - end = 0x45
    // ! - path = 0x21
    // it('should solve 2x2', async () => {
    //     // basic maze
    //     // X S
    //     // E .
    //     let row = new TupleBuilder;
    //     let maze = new TupleBuilder;
    //     row.writeNumber(0x2e);
    //     row.writeNumber(0x53);
    //     let row1 = row.build();
    //     maze.writeTuple(row1);
    //     row = new TupleBuilder;
    //     row.writeNumber(0x45);
    //     row.writeNumber(0x2e);
    //     row1 = row.build();
    //     maze.writeTuple(row1);
    //     let init_maze = maze.build();
    //     let result = await task4Basic.getSolve(2n, 2n, init_maze);
    //     let out_maze = result.stack.skip(0).skip(1).skip(2).readTuple();
    //     let out_row1 = out_maze.readTuple();
    //     let out_row2 = out_maze.readTuple();
        
    //     let readable_maze = [[bigintConversion.bigintToText(out_row1.readBigNumber()), bigintConversion.bigintToText(out_row1.readBigNumber())],
    //                         [bigintConversion.bigintToText(out_row2.readBigNumber()), bigintConversion.bigintToText(out_row2.readBigNumber())]]
        
    //     console.log("Input ", [['.', 'S'], ['E', '.']]);
    //     console.log("Expected ", [['.', 'S'], ['E', '.']]);
    //     console.log("Result ", readable_maze);

    //     expect(readable_maze).toEqual([['.', 'S'], ['E', '.']]);
    // });
    it('should solve 3x3', async () => {
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
        row.writeNumber(bigintConversion.textToBigint('.'));
        row.writeNumber(bigintConversion.textToBigint('.'));
        let row1 = row.build();
        maze.writeTuple(row1);
        row = new TupleBuilder;
        row.writeNumber(bigintConversion.textToBigint('X'));
        row.writeNumber(bigintConversion.textToBigint('.'));
        row.writeNumber(bigintConversion.textToBigint('X'));
        row1 = row.build();
        maze.writeTuple(row1);
        row = new TupleBuilder;
        row.writeNumber(bigintConversion.textToBigint('.'));
        row.writeNumber(bigintConversion.textToBigint('.'));
        row.writeNumber(bigintConversion.textToBigint('E'));
        row1 = row.build();
        maze.writeTuple(row1);
        let init_maze = maze.build();
        let result = await task4Basic.getSolve(3n, 3n, init_maze);
        let out_maze = result.stack.skip(0).skip(1).skip(2).readTuple();
        let out_row1 = out_maze.readTuple();
        let out_row2 = out_maze.readTuple();
        let out_row3 = out_maze.readTuple();
        
        let readable_maze = [[bigintConversion.bigintToText(out_row1.readBigNumber()), 
                                bigintConversion.bigintToText(out_row1.readBigNumber()),
                                    bigintConversion.bigintToText(out_row1.readBigNumber())],
                            [bigintConversion.bigintToText(out_row2.readBigNumber()), 
                                bigintConversion.bigintToText(out_row2.readBigNumber()),
                                    bigintConversion.bigintToText(out_row2.readBigNumber())],
                            [bigintConversion.bigintToText(out_row3.readBigNumber()), 
                                bigintConversion.bigintToText(out_row3.readBigNumber()),
                                    bigintConversion.bigintToText(out_row3.readBigNumber())]
                                            ]
        // let readable_maze = [[(out_row1.readBigNumber()), 
        //     (out_row1.readBigNumber()),
        //         (out_row1.readBigNumber())],
        // [(out_row2.readBigNumber()), 
        //     (out_row2.readBigNumber()),
        //         (out_row2.readBigNumber())],
        // [(out_row3.readBigNumber()), 
        //     (out_row3.readBigNumber()),
        //         (out_row3.readBigNumber())]
        //                 ]
        
        console.log("Input ", [['S', '.', '.'], ['.', 'X', 'X'], ['.', '.', 'E']]);
        console.log("Expected ", [['S', '.', '.'], ['!', 'X', 'X'], ['.', '!', 'E']]);
        console.log("Result ", readable_maze);

        // expect(readable_maze).toEqual([['S', '!', '.'], ['.', 'X', '!'], ['.', '.', 'E']]);
    });
    it('should solve 4x4', async () => {
        // basic maze
        // . S . .
        // . . . .
        // . X X ?
        // . . E .

        // solved maze
        // . S . .
        // ! . . .
        // ! X X ?
        // . ! E .
    });
    it('should solve 6x7', async () => {
        // basic maze
        // . . . . S .
        // . . . . . .
        // . X X . . .
        // . . X ? X X
        // . . . . . E
        // . . . . . .
        // . . . . . .

        // solved maze
        // . . . ! S .
        // . ! ! . . .
        // ! X X . . .
        // . ! X ? X X
        // . . ! ! ! E
        // . . . . . .
        // . . . . . .
    });
});
