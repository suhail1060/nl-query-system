
const { GoogleGenerativeAI } = require('@google/generative-ai');

const pool = require('./db');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Use correct model name: gemini-1.5-flash-latest
const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

async function processQuestion(question) {
  try {
    console.log('📝 User Question:', question);

    const sqlPrompt = `You are a SQL expert. Given this database schema:

Tables:
1. users (user_id, username, email, created_at)
2. orders (order_id, user_id, order_date, total_amount, status)

User question: "${question}"

Generate ONLY a valid PostgreSQL SELECT query to answer this question. 
Return ONLY the SQL query, nothing else. No explanations, no markdown, just the raw SQL query.`;

    console.log('🤖 Calling Gemini to generate SQL...');
    
    const sqlResult = await model.generateContent(sqlPrompt);
    let sql = sqlResult.response.text().trim();
    
    sql = sql.replace(/```sql\n?/g, '').replace(/```\n?/g, '').trim();
    const selectIndex = sql.toUpperCase().indexOf('SELECT');
    if (selectIndex > 0) {
      sql = sql.substring(selectIndex);
    }
    const semicolonIndex = sql.indexOf(';');
    if (semicolonIndex > 0) {
      sql = sql.substring(0, semicolonIndex + 1);
    }
    
    console.log('🔧 Generated SQL:', sql);

    const dbResult = await pool.query(sql);
    console.log('💾 Database Result:', dbResult.rows);

    const explainPrompt = `The user asked: "${question}"

We executed this SQL query:
${sql}

The results are:
${JSON.stringify(dbResult.rows, null, 2)}

Please provide a clear, natural language answer to the user's question based on these results. Be concise and friendly. 2-3 sentences maximum.`;

    console.log('🤖 Calling Gemini to generate answer...');

    const explainResult = await model.generateContent(explainPrompt);
    const answer = explainResult.response.text().trim();

    console.log('🎯 Natural Language Answer:', answer);

    return {
      success: true,
      question: question,
      sql: sql,
      data: dbResult.rows,
      answer: answer,
      rowCount: dbResult.rowCount,
      model: 'gemini-1.5-flash-latest'
    };

  } catch (error) {
    console.error('❌ Error in AI Agent:', error);
    
    if (error.message?.includes('API key')) {
      throw new Error('Invalid Gemini API key. Please check your GEMINI_API_KEY in .env file');
    }
    
    if (error.code) {
      return {
        success: false,
        question: question,
        error: error.message,
        answer: 'I encountered an error generating or executing the SQL query. Please try rephrasing your question.'
      };
    }
    
    throw error;
  }
}

module.exports = { processQuestion };
