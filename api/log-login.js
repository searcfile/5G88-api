const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Missing name or email' });
  }

  // contoh kirim ke Airtable (ganti dengan key dan baseId kamu)
  const airtableUrl = 'https://api.airtable.com/v0/YOUR_BASE_ID/Logins';
  const airtableKey = 'Bearer YOUR_API_KEY';

  try {
    const response = await axios.post(
      airtableUrl,
      {
        fields: { Name: name, Email: email, Timestamp: new Date().toISOString() },
      },
      {
        headers: {
          Authorization: airtableKey,
          'Content-Type': 'application/json',
        },
      }
    );
    return res.status(200).json({ message: 'Logged successfully', data: response.data });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to log to Airtable', details: err.message });
  }
};
