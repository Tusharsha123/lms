const PISTON_URL = process.env.PISTON_URL || 'https://emkc.org/api/v2/piston';

const LANGUAGE_MAP = {
  javascript: { language: 'javascript', version: '18.15.0' },
  python: { language: 'python', version: '3.10.0' },
  java: { language: 'java', version: '15.0.2' },
  cpp: { language: 'c++', version: '10.2.0' },
  c: { language: 'c', version: '10.2.0' },
  typescript: { language: 'typescript', version: '5.0.3' },
  go: { language: 'go', version: '1.16.2' },
  rust: { language: 'rust', version: '1.68.2' },
  ruby: { language: 'ruby', version: '3.0.1' },
  php: { language: 'php', version: '8.2.3' },
};

export async function executeCode(code, language, stdin = '') {
  const langConfig = LANGUAGE_MAP[language.toLowerCase()];
  
  if (!langConfig) {
    throw new Error(`Unsupported language: ${language}`);
  }
  
  const response = await fetch(`${PISTON_URL}/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language: langConfig.language,
      version: langConfig.version,
      files: [{ content: code }],
      stdin,
      compile_timeout: 10000,
      run_timeout: 5000,
      compile_memory_limit: 200 * 1024 * 1024, // 200MB
      run_memory_limit: 200 * 1024 * 1024, // 200MB
    }),
  });
  
  if (!response.ok) {
    throw new Error('Code execution failed');
  }
  
  const result = await response.json();
  
  return {
    success: result.run?.code === 0,
    output: result.run?.stdout || '',
    error: result.run?.stderr || result.compile?.stderr || '',
    executionTime: result.run?.time || 0,
    memoryUsage: result.run?.memory || 0,
  };
}

export async function runTestCases(code, language, testCases) {
  const results = [];
  
  for (const testCase of testCases) {
    try {
      const result = await executeCode(code, language, testCase.input);
      const expectedOutput = testCase.expectedOutput.trim();
      const actualOutput = result.output.trim();
      
      results.push({
        input: testCase.input,
        expectedOutput,
        actualOutput,
        passed: actualOutput === expectedOutput,
        error: result.error,
        executionTime: result.executionTime,
      });
    } catch (error) {
      results.push({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: '',
        passed: false,
        error: error.message,
      });
    }
  }
  
  return {
    results,
    allPassed: results.every(r => r.passed),
    passedCount: results.filter(r => r.passed).length,
    totalCount: results.length,
  };
}

export function getSupportedLanguages() {
  return Object.keys(LANGUAGE_MAP);
}
