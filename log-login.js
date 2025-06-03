import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Missing name or email" });
  }

  const AIRTABLE_URL = "https://api.airtable.com/v0/appTWM5ARfPDRVIKB/Logins";
  const AIRTABLE_TOKEN = "Bearer patavNCoYY26YRbBs.27d84134497f6a0cd554825ebf52ed8cd115e4346c745328a74c6add93e7fbad";

  const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);
  const filterFormula = `AND({Email}='${email}',{Name}='${name}')`;

  try {
    const checkRes = await fetch(`${AIRTABLE_URL}?filterByFormula=${encodeURIComponent(filterFormula)}`, {
      headers: {
        Authorization: AIRTABLE_TOKEN,
        "Content-Type": "application/json"
      }
    });

    const checkData = await checkRes.json();

    if (checkData.records && checkData.records.length > 0) {
      const recordId = checkData.records[0].id;

      await fetch(`${AIRTABLE_URL}/${recordId}`, {
        method: "PATCH",
        headers: {
          Authorization: AIRTABLE_TOKEN,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fields: {
            Timestamp: timestamp
          }
        })
      });
    } else {
      await fetch(AIRTABLE_URL, {
        method: "POST",
        headers: {
          Authorization: AIRTABLE_TOKEN,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fields: {
            Name: name,
            Email: email,
            Timestamp: timestamp
          }
        })
      });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Server error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
