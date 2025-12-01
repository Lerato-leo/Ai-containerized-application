const axios = require("axios");
require("dotenv").config();

// Simple financial calculator
exports.calculateFinancialMetrics = (income, expenses) => {
  // Ensure all items have proper format
  const parseItems = (items) => items.map(item => 
    typeof item === 'number' ? { name: 'Unnamed', category: 'Other', amount: item } : item
  );

  const incomeItems = parseItems(income);
  const expenseItems = parseItems(expenses);

  // Calculate totals
  const totalIncome = incomeItems.reduce((sum, x) => sum + x.amount, 0);
  const savingsItems = expenseItems.filter(item => item.category === 'Savings');
  const actualExpenses = expenseItems.filter(item => item.category !== 'Savings');
  
  const totalSavings = savingsItems.reduce((sum, x) => sum + x.amount, 0);
  const totalExpenses = actualExpenses.reduce((sum, x) => sum + x.amount, 0);
  
  // Calculate actual monthly savings (tracked savings + money left over)
  const leftoverMoney = totalIncome - totalExpenses - totalSavings;
  const actualMonthlySavings = totalSavings + leftoverMoney;
  const savingsRate = (actualMonthlySavings / totalIncome) * 100;

  // Group by categories
  const groupByCategory = (items) => items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});

  return {
    totalIncome,
    totalExpenses,
    totalSavings,
    actualMonthlySavings,
    savingsRate,
    overspending: (totalExpenses + totalSavings) > totalIncome,
    incomeByCategory: groupByCategory(incomeItems),
    expensesByCategory: groupByCategory(expenseItems),
    incomeItems,
    expenseItems,
    savingsItems,
  };
};

// Get AI financial advice
exports.aiFinancialInsights = async (metrics, goals) => {
  const savings = metrics.actualMonthlySavings;
  const expenseRatio = ((metrics.totalExpenses / metrics.totalIncome) * 100).toFixed(1);
  
  // Build simple prompt
  const prompt = `Financial Advisor for South Africa (Currency: Rands - R)

Profile:
- Income: R${metrics.totalIncome.toLocaleString()}/month
- Expenses: R${metrics.totalExpenses.toLocaleString()}/month (${expenseRatio}%)
- Savings: R${savings.toFixed(2)}/month (${metrics.savingsRate.toFixed(1)}%)
- Status: ${metrics.overspending ? 'Overspending' : 'Balanced'}
- Goals: ${goals || "None specified"}

Income Sources:
${Object.entries(metrics.incomeByCategory || {}).map(([cat, amt]) => `- ${cat}: R${amt.toLocaleString()}`).join('\n')}

Spending:
${Object.entries(metrics.expensesByCategory || {}).map(([cat, amt]) => `- ${cat}: R${amt.toLocaleString()}`).join('\n')}

Provide:
1. Financial health summary
2. Top 3 actionable recommendations
3. This month's action steps

Keep it professional and practical.`;

  // Use AI if configured, otherwise use rules
  if (!process.env.AI_API_KEY || process.env.AI_API_KEY === 'your_api_key_here') {
    return generateRuleBasedAdvice(metrics, goals);
  }

  try {
    const provider = process.env.AI_PROVIDER || 'gemini';
    if (provider === 'gemini') {
      return await getGeminiAdvice(prompt);
    } else {
      return await getHuggingFaceAdvice(prompt);
    }
  } catch (error) {
    console.error("AI Error:", error.message);
    return generateRuleBasedAdvice(metrics, goals);
  }
};

// Gemini AI call
async function getGeminiAdvice(prompt) {
  const model = process.env.AI_MODEL || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.AI_API_KEY}`;

  const response = await axios.post(url, {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
    ]
  }, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000
  });

  const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('No response from Gemini');
  
  return text.trim();
}

// HuggingFace AI call (fallback)
async function getHuggingFaceAdvice(prompt) {
  const url = process.env.AI_API_URL || 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';
  
  const response = await axios.post(url, {
    inputs: prompt,
    parameters: { max_new_tokens: 600, temperature: 0.7, top_p: 0.95 }
  }, {
    headers: { Authorization: `Bearer ${process.env.AI_API_KEY}` },
    timeout: 30000
  });

  const text = response.data[0]?.generated_text || response.data.generated_text || response.data;
  return typeof text === 'string' ? text.replace(prompt, '').trim() : text;
}

// Smart rule-based advice
function generateRuleBasedAdvice(metrics, goals) {
  const { totalIncome, totalExpenses, savingsRate, overspending, expensesByCategory = {}, incomeByCategory = {} } = metrics;
  const savings = metrics.actualMonthlySavings || (totalIncome - totalExpenses);
  const expenseRatio = ((totalExpenses / totalIncome) * 100).toFixed(1);

  // Determine status
  let status, rating;
  if (overspending) {
    status = 'CRITICAL';
    rating = 'Spending exceeds income - immediate action needed';
  } else if (savingsRate < 10) {
    status = 'NEEDS IMPROVEMENT';
    rating = `${savingsRate.toFixed(1)}% savings rate - aim for 10-20%`;
  } else if (savingsRate < 20) {
    status = 'HEALTHY';
    rating = `${savingsRate.toFixed(1)}% savings rate - on track`;
  } else if (savingsRate < 30) {
    status = 'EXCELLENT';
    rating = `${savingsRate.toFixed(1)}% savings rate - strong performance`;
  } else {
    status = 'OUTSTANDING';
    rating = `${savingsRate.toFixed(1)}% savings rate - exceptional!`;
  }

  let analysis = `FINANCIAL HEALTH ANALYSIS\n`;
  analysis += `${'='.repeat(50)}\n\n`;
  analysis += `STATUS: ${status}\n${rating}\n\n`;
  analysis += `Monthly Overview:\n`;
  analysis += `- Income: R${totalIncome.toLocaleString()}\n`;
  analysis += `- Expenses: R${totalExpenses.toLocaleString()} (${expenseRatio}%)\n`;
  analysis += `- Savings: R${savings.toFixed(2)} (${savingsRate.toFixed(1)}%)\n\n`;

  // Key insights
  analysis += `Key Insights:\n`;
  
  const topExpense = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1])[0];
  if (topExpense) {
    const [category, amount] = topExpense;
    const pct = ((amount / totalExpenses) * 100).toFixed(1);
    analysis += `- Largest expense: ${category} (R${amount.toLocaleString()}, ${pct}%)\n`;
  }
  
  const sources = Object.keys(incomeByCategory).length;
  analysis += `- Income sources: ${sources} ${sources > 1 ? '(good diversification)' : '(consider adding more)'}\n`;
  
  if (savings > 0) {
    const months = (totalExpenses * 6 / savings).toFixed(1);
    analysis += `- Emergency fund timeline: ${months} months at current rate\n`;
  }
  
  if (goals) {
    analysis += `- Your goals: ${goals}\n`;
  }
  
  analysis += `\n${'='.repeat(50)}\n`;
  analysis += `TOP 3 RECOMMENDATIONS\n${'='.repeat(50)}\n\n`;

  if (overspending) {
    const deficit = Math.abs(savings);
    analysis += `1. Fix Budget Immediately\n`;
    analysis += `   - Deficit: R${deficit.toFixed(2)}/month\n`;
    analysis += `   - Track every expense for 7 days\n`;
    analysis += `   - Cut top 3 unnecessary expenses\n`;
    analysis += `   - Target: Reduce expenses to 80% of income\n\n`;
    
    analysis += `2. Increase Income\n`;
    analysis += `   - Negotiate salary increase\n`;
    analysis += `   - Start side hustle or freelancing\n`;
    analysis += `   - Even R${deficit.toFixed(2)} extra would balance budget\n\n`;
    
    analysis += `3. Manage Debt\n`;
    analysis += `   - List all debts with interest rates\n`;
    analysis += `   - Pay high-interest debt first\n`;
    analysis += `   - Avoid new debt - use cash/debit only\n`;
    analysis += `   - Consider debt counseling if needed\n`;
  } else if (savingsRate < 10) {
    const target = (totalIncome * 0.1);
    const needMore = target - savings;
    analysis += `1. Boost Savings to 10%\n`;
    analysis += `   - Current: R${savings.toFixed(2)} (${savingsRate.toFixed(1)}%)\n`;
    analysis += `   - Target: R${target.toFixed(2)} (10%)\n`;
    analysis += `   - Increase by: R${needMore.toFixed(2)}/month\n`;
    analysis += `   - Automate savings on payday\n\n`;
    
    analysis += `2. Reduce Expenses\n`;
    analysis += `   - Cancel unused subscriptions (save R300-500)\n`;
    analysis += `   - Meal prep vs eating out (save R1500-2500)\n`;
    analysis += `   - Compare insurance quotes (save 10-15%)\n`;
    analysis += `   - Use prepaid services for control\n\n`;
    
    analysis += `3. Build Emergency Fund\n`;
    analysis += `   - Target: R${(totalExpenses * 6).toLocaleString()} (6 months)\n`;
    analysis += `   - Keep in accessible savings account\n`;
    analysis += `   - Priority before other investments\n`;
  } else if (savingsRate < 20) {
    const target = (totalIncome * 0.2);
    const needMore = target - savings;
    analysis += `1. Push to 20% Savings Rate\n`;
    analysis += `   - Current: ${savingsRate.toFixed(1)}% - You're doing well!\n`;
    analysis += `   - Target: R${target.toFixed(2)}/month\n`;
    analysis += `   - Increase by: R${needMore.toFixed(2)}\n`;
    analysis += `   - Reduce second-largest expense by 15%\n\n`;
    
    analysis += `2. Start Investing\n`;
    analysis += `   - Open Tax-Free Savings Account (TFSA)\n`;
    analysis += `   - Consider low-cost index ETFs\n`;
    analysis += `   - Start retirement annuity (RA) for tax benefits\n`;
    analysis += `   - Diversify: 70% growth, 30% bonds/cash\n\n`;
    
    analysis += `3. Complete Safety Net\n`;
    analysis += `   - Build 6-month emergency fund: R${(totalExpenses * 6).toLocaleString()}\n`;
    analysis += `   - Review insurance (life, income, medical)\n`;
    analysis += `   - Create will and name beneficiaries\n`;
  } else {
    analysis += `1. Maximize Wealth Building\n`;
    analysis += `   - Exceptional ${savingsRate.toFixed(1)}% savings rate!\n`;
    analysis += `   - Max out TFSA (R36k/year) + RA (27.5% income)\n`;
    analysis += `   - Invest ${((savings * 0.6).toFixed(2))} in growth ETFs\n`;
    analysis += `   - Allocate ${((savings * 0.3).toFixed(2))} to property/REITs\n`;
    analysis += `   - Financial independence possible in 15-20 years\n\n`;
    
    analysis += `2. Execute Strategic Goals\n`;
    if (goals) {
      analysis += `   - Your goals: ${goals}\n`;
    }
    analysis += `   - Annual savings power: R${(savings * 12).toLocaleString()}\n`;
    analysis += `   - Build passive income streams\n`;
    analysis += `   - Consider property investment\n`;
    analysis += `   - Plan for early retirement options\n\n`;
    
    analysis += `3. Tax & Legacy Planning\n`;
    analysis += `   - Consult certified financial planner\n`;
    analysis += `   - Maximize RA (save up to R${(totalIncome * 0.275).toFixed(2)} in tax)\n`;
    analysis += `   - Explore offshore investment (R1M/year)\n`;
    analysis += `   - Set up trust for estate planning\n`;
    analysis += `   - Review life insurance coverage\n`;
  }

  
  analysis += `\n${'='.repeat(50)}\n`;
  analysis += `THIS MONTH'S ACTION STEPS\n${'='.repeat(50)}\n\n`;
  
  if (overspending) {
    analysis += `1. Install budgeting app (22seven, Budgets)\n`;
    analysis += `2. List and categorize last month's expenses\n`;
    analysis += `3. Cut top 3 unnecessary expenses\n`;
    analysis += `4. Set up bank spending alerts\n`;
  } else if (savingsRate < 15) {
    analysis += `1. Automate savings increase\n`;
    analysis += `2. Open dedicated savings account\n`;
    analysis += `3. Cancel 2 unused subscriptions\n`;
    analysis += `4. Meal prep to cut food costs 20%\n`;
  } else {
    analysis += `1. Meet with financial advisor\n`;
    analysis += `2. Open TFSA or investment account\n`;
    analysis += `3. Update financial goals\n`;
    analysis += `4. Track net worth monthly\n`;
  }
  
  analysis += `\n${'='.repeat(50)}\n`;
  if (overspending) {
    analysis += `Financial recovery starts with one decision. You can do this!\n`;
  } else if (savingsRate < 15) {
    analysis += `You're ahead of most people. Keep building momentum!\n`;
  } else {
    analysis += `Exceptional discipline! You're on track for financial freedom.\n`;
  }
  analysis += `${'='.repeat(50)}\n`;

  return analysis;
}
