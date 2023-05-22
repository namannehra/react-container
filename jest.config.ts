import { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
    preset: 'ts-jest/presets/default-esm',
    transform: {
        '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tests/tsconfig.json' }],
    },
    testEnvironment: 'node',
};

export default config;
