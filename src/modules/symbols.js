// TODO pull dynamically

const baseUri = '/images/mana-symbols/';
const symbols = [
    {
        key:        'R',
        stringName: 'Red',
    },
    {
        key:        'U',
        stringName: 'Blue',
    },
    {
        key:        'B',
        stringName: 'Black',
    },
    {
        key:        'G',
        stringName: 'Green',
    },
    {
        key:        'W',
        stringName: 'White',
    }
];

export const manaCostSymbols = symbols.map(s => {
    s.uri = baseUri + s.key + '.svg';  // /images/mana-symbols/G.svg
    return s;
});