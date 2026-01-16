import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { executeCode, runTestCases, getSupportedLanguages } from '../../lib/codeRunner';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.json({ languages: getSupportedLanguages() });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { code, language, testCases, stdin } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language required' });
    }

    if (testCases && Array.isArray(testCases) && testCases.length > 0) {
      const results = await runTestCases(code, language, testCases);
      return res.json(results);
    }

    const result = await executeCode(code, language, stdin);
    res.json(result);
  } catch (error) {
    console.error('Code execution error:', error);
    res.status(500).json({ error: error.message || 'Code execution failed' });
  }
}
