import Airtable from 'airtable';

export default async function handler(req, res) {
  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base('appTWM5ARfPDRVIKB');

  if (req.method === 'GET') {
    try {
      const records = await base('Logins').select().firstPage();
      res.status(200).json({ records });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
