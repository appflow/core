import { APIResetIdCounter } from "../src/object-base";

beforeAll( () => {
    // @ts-ignore
    globalThis.$flowConfig = {
        baseURL: 'http://localhost:3000',
    }
 })

beforeEach(async () => {
    // Load $flow.
    await import('../src/index');

    APIResetIdCounter();
} );


afterEach(() => {
    jest.resetModules();

    // @ts-ignore
    delete globalThis.$flow;
} );
