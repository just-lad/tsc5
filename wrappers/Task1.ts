import { randomAddress } from '@ton-community/test-utils';
import { generateKeyPair } from 'crypto';
import * as fs from "fs";
import { mnemonicNew, mnemonicToWalletKey, sign } from "ton-crypto";
import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type Task1Config = {
    publicKey: bigint,
    executionTime: bigint,
    receiver: Address,
    seqno: bigint,
};

export function task1ConfigToCell(config: Task1Config): Cell {
    return beginCell()
        .storeUint(config.publicKey, 256) // public_key:uint256
        .storeUint(config.executionTime,32) // execution_time:uint32
        .storeAddress(config.receiver) // receiver:MsgAddressInt
        .storeUint(config.seqno, 32) // seqno:uint32
        .endCell();
}

export class Task1 implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Task1(address);
    }

    static createFromConfig(config: Task1Config, code: Cell, workchain = 0) {
        const data = beginCell()
                        .storeUint(config.publicKey, 256) // public_key:uint256
                        .storeUint(config.executionTime,32) // execution_time:uint32
                        .storeAddress(config.receiver) // receiver:MsgAddressInt
                        .storeUint(config.seqno, 32) // seqno:uint32
                        .endCell();
        const init = { code, data };
        return new Task1(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
    
    async getNow(provider: ContractProvider) {
        const result = (await provider.get('get_now', [])).stack;
        return result.readBigNumber();
    }

    async getSeqno(provider: ContractProvider) {
        const result = (await provider.get('get_seqno', [])).stack;
        return result.readBigNumber();
    }

    async getExecutionTime(provider: ContractProvider) {
        const result = (await provider.get('get_execution_time', [])).stack;
        return result.readBigNumber();
    }

    // update#9df10277 query_id:uint64 signature:bits512 ^[ locked_for:uint32 new_seqno:uint32 ] = ExtInMsgBody
    async sendUpdate(provider: ContractProvider, opcode: number, query_id: number, 
        locked_for: bigint, new_seqno: number, signature: number) {
        let ref = beginCell()
                    .storeInt(locked_for, 32)
                    .storeUint(new_seqno, 32)
                    .endCell()
        await provider.external(beginCell()
                                    .storeUint(opcode, 32)
                                    .storeUint(query_id, 64)
                                    .storeUint(signature, 512)
                                    .storeRef(ref)
                                    .endCell());
    }

    // claim#bb4be234 query_id:uint64 = ExtInMsgBody
    async sendClaim(provider: ContractProvider, opcode: number, query_id: number) {
        await provider.external(beginCell()
                                    .storeUint(opcode, 32)
                                    .storeUint(query_id, 64)
                                    .endCell());
    }
}
