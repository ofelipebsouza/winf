import fs from 'fs';

let code = fs.readFileSync('src/components/ModuleFinancial.tsx', 'utf8');

// Remove isMawActive up to just before newTx
code = code.replace(/const \[isMawActive, setIsMawActive\][\s\S]*?(?=const \[newTx, setNewTx\])/, '');

// Remove useSimulated and reserves
code = code.replace(/\/\/ Calculate allocated reserves[\s\S]*?(?=\/\/ Custom categories for expenses)/, '');

// Remove simulatedTotalRevenue up to displayTransactions
code = code.replace(/\/\/ Total simulado do mês[\s\S]*?const displayTransactions = useSimulated \? \[[\s\S]*?\] : transactions\.sort\(\(a,b\) => new Date\(b\.date\)\.getTime\(\) - new Date\(a\.date\)\.getTime\(\)\);/, `const displayTransactions = transactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());`);

// Update totalRevenue and totalCost to use realIncome and realExpense directly
code = code.replace(/const totalRevenue = useSimulated \? simulatedTotalRevenue : realIncome;/, 'const totalRevenue = realIncome;');
code = code.replace(/const totalCost = useSimulated \? simulatedTotalCost : realExpense;/, 'const totalCost = realExpense;');

// Remove Zeigarnik banner
code = code.replace(/\{\/\* Zeigarnik Progress Goal Banner \*\/\}[\s\S]*?(?=\{\/\* KPI Cards based on V5 Manual Projection \*\/\})/, '');

// Remove Reserves & Planning + Stock Potential Panels
code = code.replace(/\{\/\* Reserves & Planning Panel \*\/\}[\s\S]*?(?=\{\/\* Recent Transactions List \*\/\})/, '');

fs.writeFileSync('src/components/ModuleFinancial.tsx', code);
