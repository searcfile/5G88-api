const axios = require("axios");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Missing name or email" });
  }

  try {
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
    const AIRTABLE_TABLE_NAME = "Logins";

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      return res.status(500).json({ error: "Server not configured properly" });
    }

    const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;
    const filterFormula = `AND({Email}='${email}',{Name}='${name}')`;

    const getResponse = await axios.get(airtableUrl, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
      params: {
        filterByFormula: filterFormula,
      },
    });

    const records = getResponse.data.records;
    const now = new Date().toISOString();

    if (records.length > 0) {
      const recordId = records[0].id;
      const patchResponse = await axios.patch(
        `${airtableUrl}/${recordId}`,
        {
          fields: { Timestamp: now },
        },
        {
          headers: {
            Authorization: `Bearer ${AIRTABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      return res.status(200).json({
        message: "Login timestamp updated",
        data: patchResponse.data,
      });
    } else {
      const postResponse = await axios.post(
        airtableUrl,
        {
          fields: {
            Name: name,
            Email: email,
            Timestamp: now,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${AIRTABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      return res.status(201).json({
        message: "New login record created",
        data: postResponse.data,
      });
    }
  } catch (error) {
    console.error("Error in Airtable API:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
