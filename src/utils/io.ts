import * as readline from 'readline';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

export function perguntar(query: string): Promise<string> {
    return new Promise(resolve => rl.question(query, resolve));
}

export function fecharInterface(): void {
    rl.close();
}