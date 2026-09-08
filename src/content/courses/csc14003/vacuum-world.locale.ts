import { LOCALE } from '@/lib/locale';
import * as VI from './vacuum-world.js';
import * as EN from './vacuum-world.en.js';

const M: typeof VI = LOCALE === 'en' ? EN : VI;
type Parity<A, B> = [A] extends [B] ? true : { enThua: Exclude<keyof A, keyof B> };
const _p: Parity<typeof EN, typeof VI> = true; void _p;

export const { STEPS, WORLDS, PRESETS, PROGRAMS, MEASURES, runVacuum, compareFinal } = M;
