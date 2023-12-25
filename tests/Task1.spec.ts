import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { Task1 } from '../wrappers/Task1';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';
import { exitCode } from 'process';

describe('Task1', () => {
    let code: Cell;
    let blockchain: Blockchain;


    beforeAll(async () => {
        code = await compile('Task1');
    });

    beforeEach(async () => {
        // blockchain = await Blockchain.create();
        // const deployer = await blockchain.treasury('deployer');

        // task1 = blockchain.openContract(Task1.createFromConfig({}, code));
        // const deployResult = await task1.sendDeploy(deployer.getSender(), toNano('5.0'));
    });

    it('should deploy', async () => {
        blockchain = await Blockchain.create();
        const deployer = await blockchain.treasury('deployer');

        let task1 = blockchain.openContract(
            Task1.createFromConfig({
                publicKey: 200n,
                executionTime: 1703422663n,
                receiver: deployer.address,
                seqno: 1n,
            }, code));

        const deployResult = await task1.sendDeploy(deployer.getSender(), toNano('5.0'));
        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task1.address,
            deploy: true,
            success: true,
        });
    });

    it('should throw 119', async () => {
        blockchain = await Blockchain.create();
        const deployer = await blockchain.treasury('deployer');

        let task1 = blockchain.openContract(
            Task1.createFromConfig({
                publicKey: 200n,
                executionTime: 1803425163n,
                receiver: deployer.address,
                seqno: 0n,
            }, code));
        
        const deployResult = await task1.sendDeploy(deployer.getSender(), toNano('0.05'));
        const sendExternalResult = await task1.sendUpdate(0x9df10277, 0, 10, 12, 54);
        expect(sendExternalResult.transactions).toHaveTransaction({
            success: false,
            exitCode: 119,
        })
    });

    it('should throw 120', async () => {
        blockchain = await Blockchain.create();
        const deployer = await blockchain.treasury('deployer');

        let task1 = blockchain.openContract(
            Task1.createFromConfig({
                publicKey: 200n,
                executionTime: 1803425163n,
                receiver: deployer.address,
                seqno: 0n,
            }, code));
        const deployResult = await task1.sendDeploy(deployer.getSender(), toNano('0.05'));

        const sendExternalResult = await task1.sendUpdate(0x9df10277, 0, 10, 1, 53);
        expect(sendExternalResult.transactions).toHaveTransaction({
            success: false,
            exitCode: 120,
        })
    });

    it('should throw 121', async () => {
        blockchain = await Blockchain.create();
        const deployer = await blockchain.treasury('deployer');

        let task1 = blockchain.openContract(
            Task1.createFromConfig({
                publicKey: 200n,
                executionTime: 1803425163n,
                receiver: deployer.address,
                seqno: 0n,
            }, code));
        const deployResult = await task1.sendDeploy(deployer.getSender(), toNano('0.05'));

        const sendExternalResult = await task1.sendUpdate(0x9df10277, 0, -10, 1, 54);
        expect(sendExternalResult.transactions).toHaveTransaction({
            success: false,
            exitCode: 121,
        });
    });

    it('should throw 122', async () => {
        blockchain = await Blockchain.create();
        const deployer = await blockchain.treasury('deployer');

        let task1 = blockchain.openContract(
            Task1.createFromConfig({
                publicKey: 200n,
                executionTime: 1603425163n,
                receiver: deployer.address,
                seqno: 0n,
            }, code));
        const deployResult = await task1.sendDeploy(deployer.getSender(), toNano('0.05'));

        const result = await task1.sendUpdate(0x9df10277, 0, 1, 1, 54);
        //console.log("Get execution time gas used:", result)
        expect(result.transactions).toHaveTransaction({
            success: false,
            exitCode: 122,
        });
    });

    it('should update seqno and execution_time', async () => {
        blockchain = await Blockchain.create();
        const deployer = await blockchain.treasury('deployer');

        let task1 = blockchain.openContract(
            Task1.createFromConfig({
                publicKey: 200n,
                executionTime: 1703491656n, 
                receiver: deployer.address,
                seqno: 100n,
            }, code));
        const deployResult = await task1.sendDeploy(deployer.getSender(), toNano('0.05'));

        let locked_for = 10000;

        const sendExternalResult = await task1.sendUpdate(0x9df10277, 0, locked_for, 101, 54);
        
        // console.log('Now is: ', await task1.getNow());
        // console.log('executionTime is: ', await task1.getExecutionTime());
        // console.log('seqno is: ', await task1.getSeqno());
        // console.log("Get execution time gas used:", sendExternalResult);
        
        let now = new Date;
        expect(await task1.getSeqno()).toEqual(101n);
        expect(Number(await task1.getExecutionTime())).toBeCloseTo(Math.round((now.getTime()) / 1000) + locked_for, 1);
    });

    it('should throw 124', async () => {
        blockchain = await Blockchain.create();
        const deployer = await blockchain.treasury('deployer');

        let task1 = blockchain.openContract(
            Task1.createFromConfig({
                publicKey: 200n,
                executionTime: 1803428615n, 
                receiver: deployer.address,
                seqno: 1n,
            }, code));
        const deployResult = await task1.sendDeploy(deployer.getSender(), toNano('0.05'));
        
        const sendExternalResult = await task1.sendClaim(0xbb4be234, 1);
        expect(sendExternalResult.transactions).toHaveTransaction({
            success: false,
            exitCode: 124,
        })
    });

    it('should send the whole balance', async () => {
        blockchain = await Blockchain.create();
        const deployer = await blockchain.treasury('deployer');

        let task1 = blockchain.openContract(
            Task1.createFromConfig({
                publicKey: 200n,
                executionTime: 1703428615n, 
                receiver: deployer.address,
                seqno: 1n,
            }, code));
        const deployResult = await task1.sendDeploy(deployer.getSender(), toNano('0.05'));

        const sendExternalResult = await task1.sendClaim(0xbb4be234, 1);
        console.log("Get execution time gas used:", sendExternalResult);
        expect(sendExternalResult.transactions).toHaveTransaction({
            success: true,
        })
    });

});
