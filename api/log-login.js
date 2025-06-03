const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Missing name or email' });
  }

  const airtableUrl = 'https://api.airtable.com/v0/appTWM5ARfPDRVIKB/Logins';
  const airtableKey = 'Bearer YOUR_AIRTABLE_API_KEY'; // Ganti dengan API key kamu

  try {
    const response = await axios.post(
      airtableUrl,
      {
        fields: {
          Name: name,
          Email: email,
          Timestamp: new Date().toISOString()
        }
      },
      {
        headers: {
          Authorization: airtableKey,
          'Content-Type': 'application/json',
        },
      }
    );

    return res.status(200).json({ message: 'Logged successfully', data: response.data });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to log to Airtable', details: error.message });
  }
};
