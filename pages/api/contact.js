export default function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, message } = req.body;

    // In a real application, you would send an email or save this to a database.
    // For now, we'll just log it to the console.
    console.log('Contact form submission:');
    console.log(`  Name: ${name}`);
    console.log(`  Email: ${email}`);
    console.log(`  Message: ${message}`);

    res.status(200).json({ message: 'Message received' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
