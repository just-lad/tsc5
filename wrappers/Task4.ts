import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, TupleItem } from 'ton-core';

export type Task4Config = {};

export function task4ConfigToCell(config: Task4Config): Cell {
    return beginCell().endCell();
}

export class Task4 implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Task4(address);
    }

    static createFromConfig(config: Task4Config, code: Cell, workchain = 0) {
        const data = task4ConfigToCell(config);
        const init = { code, data };
        return new Task4(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async getSolve(provider: ContractProvider, n: bigint, m: bigint, maze: TupleItem[]) {
        const result = (await provider.get('solve', [
            {type: "int", value: n},
            {type: "int", value: m},
            {type: "tuple", items: maze},
        ]));
        return result;
    }
}
