const fs = require('fs');
let content = fs.readFileSync('src/lib/documentSeeder.ts', 'utf-8');

const regex = /title:\s*'DOCUMENTO\s*(\d+).*?',\s*category:\s*'([^']*)'/g;

content = content.replace(regex, (match, docNum, oldCategory) => {
    let newCategory = oldCategory;
    const num = parseInt(docNum, 10);
    
    // Investidores
    if ([3, 6, 8, 10, 11, 14, 32].includes(num)) {
        newCategory = 'Documentação dos Investidores';
    }
    // Asset Light / Licenciados
    else if ([1, 2, 4, 5, 12, 15, 16, 17, 29, 33, 34].includes(num)) {
        newCategory = 'Documentação para Membros Asset Light';
    }
    // Marketing
    else if ([13, 21, 22, 25, 26, 30, 31, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57].includes(num)) {
        newCategory = 'Documentações de Marketing';
    }
    // Utilização Interna
    else if ([0, 7, 9, 18, 19, 20, 23, 24, 27, 28].includes(num)) {
        newCategory = 'Documentos de Utilização Interna';
    }
    
    // Special handling for the second occurrence of 14 if any, but it will be covered by 14
    
    return match.replace(oldCategory, newCategory);
});

fs.writeFileSync('src/lib/documentSeeder.ts', content);
console.log('Categories updated!');
