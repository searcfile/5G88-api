export default async function handler(req, res) {
  const AIRTABLE_API_KEY = 'patavNCoYY26YRbBs.27d84134497f6a0cd554825ebf52ed8cd115e4346c745328a74c6add93e7fbad';
  const BASE_ID = 'appTWM5ARfPDRVIKB';
  const TABLE_NAME = 'Logins';

  const { name, email } = req.method === 'POST' ? req.body : req.query;

  if (!name || !email) {
    return res.status(400).json({ error: 'Missing name or email' });
  }

  const filterFormula = `AND({Email}='${email}',{Name}='${name}')`;

  try {
    const checkRes = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?filterByFormula=${encodeURIComponent(filterFormula)}`, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await checkRes.json();

    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

    if (data.records.length > 0) {
      const recordId = data.records[0].id;

      const patchRes = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}/${recordId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            Timestamp: timestamp,
          },
        }),
      });

      const patchData = await patchRes.json();
      return res.status(200).json({ message: 'Updated', data: patchData });
    } else {
      const createRes = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            Name: name,
            Email: email,
            Timestamp: timestamp,
          },
        }),
      });

      const createData = await createRes.json();
      return res.status(200).json({ message: 'Created', data: createData });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
