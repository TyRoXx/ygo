import { Card, Passcode } from '../Card/Card'

test('basic', () => {
    expect(0).toBe(0);
    new Card(new Passcode("11111111"), "", "", "");
});
