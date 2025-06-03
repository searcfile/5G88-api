const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' }); 
  }

  const { name, email } = req.body;

  try {
    const airtableUrl = 'https://api.airtable.com/v0/appTWM5ARfPDRVIKB/Logins';
    const airtableKey = process.env.AIRTABLE_KEY;

    const response = await axios.post(
      airtableUrl,
      {
        fields: {
          Name: name,
          Email: email,
          Timestamp: new Date().toISOString(),
        },
      },
      {
        headers: {
          Authorization: `Bearer ${airtableKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(200).json({ message: 'Success', id: response.data.id });
  } catch (error) {
    console.error('❌ Gagal kirim ke Airtable:', error);
    res.status(500).json({ error: 'Failed to send to Airtable' });
  }
};
