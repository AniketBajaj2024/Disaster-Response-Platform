// backend/index.js
const express = require('express');
const supabase = require('./supabaseClient');

const app = express();
app.use(express.json());

app.get('/', async (req, res) => {
  const { data, error } = await supabase.from('disasters').select('*');
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




app.post('/disasters', async (req, res) => {
  const { title, location_name, description, tags } = req.body;

  console.log('Received data:', req.body);
  console.log("inside /disasters endpoint");

  const { data, error } = await supabase.from('disasters').insert([
    {
      title,
      location_name,
      description,
      tags,
    }
  ]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ message: 'Disaster added', data });
});



// Update disaster by id
app.put('/disasters/:id', async (req, res) => {
  const { id } = req.params;
  const { title, location_name, description, tags } = req.body;

  const { data, error } = await supabase.from('disasters')
    .update({ title, location_name, description, tags })
    .eq('id', id)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  if (data.length === 0) {
    return res.status(404).json({ error: 'Disaster not found' });
  }
  console.log("updated");
  res.json(data[0]);
});

// Delete disaster by id
app.delete('/disasters/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase.from('disasters')
    .delete()
    .eq('id', id)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  if (data.length === 0) {
    return res.status(404).json({ error: 'Disaster not found' });
  }
  res.json({ message: 'Disaster deleted', disaster: data[0] });
});


