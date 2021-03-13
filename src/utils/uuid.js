import { v4 as uuid } from 'uuid';

export function generateUUID() {
  return 't' + uuid();
}
