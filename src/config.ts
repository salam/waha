import { WAHAEngine } from '@waha/structures/enums.dto';

export function getEngineName(): string {
  // NOWEB is the only supported engine
  return WAHAEngine.NOWEB;
}
