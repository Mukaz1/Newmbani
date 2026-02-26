import {randomInt} from 'crypto'

export function generateOTP(): string {
    const n = randomInt(0, 1000000);
    return n.toString().padStart(6, '0');
}