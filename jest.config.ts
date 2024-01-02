import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/dist/', 'Task1.spec.ts', 'Task2.spec.ts', 'Task3.spec.ts', 'Task4.spec.ts'], //, 'Task4Basic.spec.ts'
};

export default config;
