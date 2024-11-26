import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';  // Importing the useToast hook

const ContactUsForm = () => {
  const { toast } = useToast();  // Destructure toast from useToast hook
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Your message has been sent successfully.',
          variant: 'destructive',  // Choose your preferred toast variant color
        });
        
        // Reset the form data after successful submission
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });

      } else {
        toast({
          title: 'Error',
          description: 'There was an error sending your message. Please try again.',
          variant: 'destructive',  // Choose an error color
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error sending your message. Please try again.',
        variant: 'destructive',  // Choose an error color
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-4">Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-semibold text-gray-700">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            rows="4"
            required
          />
        </div>
        <div className="text-center mb-4">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactUsForm;
