export default function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email } = req.body;
    return res.status(200).json({ success: true, name, email });
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
