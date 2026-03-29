const axios = require('axios');

const judge0 = axios.create({
  baseURL: process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com',
  headers: {
    'X-RapidAPI-Key': process.env.JUDGE0_API_KEY || '',
    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json',
  },
});

const LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
  c: 50,
};

const submitCode = async (source_code, language, stdin = '') => {
  const language_id = LANGUAGE_IDS[language] || 63;
  const { data } = await judge0.post('/submissions?base64_encoded=false&wait=true', {
    source_code,
    language_id,
    stdin,
  });
  return data;
};

module.exports = { submitCode, LANGUAGE_IDS };
