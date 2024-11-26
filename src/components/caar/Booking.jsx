import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import BookingPaymentForm from './BookingPaymentForm'; // Import the Stripe payment form

const Booking = ({ car }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [insuranceType, setInsuranceType] = useState('none');
  const [additionalDrivers, setAdditionalDrivers] = useState([]);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [bookingData, setBookingData] = useState(null); // Store the booking data for payment
  const { toast } = useToast();

  const calculateTotalPrice = () => {
    if (!startDate || !endDate) return 0;
    
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    let basePrice = days * car.pricePerDay;
    
    const insurancePrices = {
      'none': 0,
      'basic': 10 * days,
      'premium': 20 * days
    };
    
    return basePrice + insurancePrices[insuranceType];
  };

  const handleAddDriver = () => {
    setAdditionalDrivers([
      ...additionalDrivers, 
      { name: '', licenseNumber: '', licenseExpiry: null }
    ]);
  };

  const updateAdditionalDriver = (index, field, value) => {
    const updatedDrivers = [...additionalDrivers];
    updatedDrivers[index][field] = value;
    setAdditionalDrivers(updatedDrivers);
  };

  const handleBooking = async () => {
    if (!startDate || !endDate) {
      toast({
        title: "Validation Error",
        description: "Please select start and end dates",
        variant: "destructive"
      });
      return;
    }

    try {
      const bookingData = {
        carId: car._id,
        startDate,
        endDate,
        totalPrice: calculateTotalPrice(),
        pickupLocation,
        dropoffLocation,
        insurance: {
          type: insuranceType,
          price: insuranceType !== 'none' 
            ? (insuranceType === 'basic' ? 10 : 20) * 
              Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
            : 0
        },
        additionalDrivers
      };

      // Get the client secret for Stripe payment
      const paymentResponse = await fetch('http://localhost:3000/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ totalPrice: bookingData.totalPrice })
      });

      const paymentResult = await paymentResponse.json();

      if (paymentResponse.ok) {
        setBookingData({
          ...bookingData,
          clientSecret: paymentResult.clientSecret, // Pass the client secret to the payment form
        });
      } else {
        throw new Error(paymentResult.message || "Payment creation failed");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handlePaymentSuccess = (confirmedBooking) => {
    toast({
      title: "Booking Successful",
      description: "Your car booking has been confirmed!",
    });
    // Optionally reset the form or redirect
  };

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <div className="flex space-x-4">
        <div className="w-full">
          <Label>Start Date</Label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Select start date"
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="w-full">
          <Label>End Date</Label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            placeholderText="Select end date"
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      {/* Location Selection */}
      <div className="space-y-4">
        <div>
          <Label>Pickup Location</Label>
          <Input 
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            placeholder="Enter pickup location"
          />
        </div>
        <div>
          <Label>Dropoff Location</Label>
          <Input 
            value={dropoffLocation}
            onChange={(e) => setDropoffLocation(e.target.value)}
            placeholder="Enter dropoff location"
          />
        </div>
      </div>

      {/* Insurance Selection */}
      <div>
        <Label>Insurance Type</Label>
        <Select 
          value={insuranceType}
          onValueChange={setInsuranceType}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select insurance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Insurance</SelectItem>
            <SelectItem value="basic">Basic Insurance (+$10/day)</SelectItem>
            <SelectItem value="premium">Premium Insurance (+$20/day)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Additional Drivers */}
      <div>
        <Label>Additional Drivers</Label>
        {additionalDrivers.map((driver, index) => (
          <div key={index} className="space-y-2 mt-2">
            <Input 
              placeholder="Driver Name"
              value={driver.name}
              onChange={(e) => updateAdditionalDriver(index, 'name', e.target.value)}
            />
            <Input 
              placeholder="License Number"
              value={driver.licenseNumber}
              onChange={(e) => updateAdditionalDriver(index, 'licenseNumber', e.target.value)}
            />
          </div>
        ))}
        <Button 
          variant="outline" 
          onClick={handleAddDriver}
          className="mt-2"
        >
          Add Additional Driver
        </Button>
      </div>

      {/* Total Price */}
      <div className="text-2xl font-bold">
        Total Price: ${calculateTotalPrice()}
      </div>

      {/* Booking Button */}
      <Button 
        onClick={handleBooking}
        disabled={!startDate || !endDate}
        className="w-full"
      >
        Confirm Booking
      </Button>

      {/* If payment data exists, show the Stripe Payment Form */}
      {bookingData && (
        <BookingPaymentForm 
          booking={bookingData} 
          onPaymentSuccess={handlePaymentSuccess} 
        />
      )}
    </div>
  );
};

export default Booking;
