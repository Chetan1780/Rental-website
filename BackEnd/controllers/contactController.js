const Contact = require("../models/contact")

const contactController = {
  createFeedback: async (req, res) => {
    const { name, email, phone, message } = req.body;
    try {
      const contact = new Contact({ name, email, phone, message });
      await contact.save();
      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to submit contact query.' });
    }
  },

  getFeedback: async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to fetch contact queries.' });
      }
  },
};

module.exports = contactController;
