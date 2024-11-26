import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Car, Calendar, Check, Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import BookingForm from './Booking'; // We'll create this component next
import { Separator } from '../ui/separator';
import DisplayCar from './DisplayCar';
const CarDetail = () => {
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState(null);

  // Extract carId from URL (assumes you're using react-router)
  const carId = window.location.pathname.split('/').pop();

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/cars/${carId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch car details');
        }
        
        const data = await response.json();
        setCar(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [carId]);

  // Image slider navigation
  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      (prev + 1) % car.images.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? car.images.length - 1 : prev - 1
    );
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!car) return <div className="text-center py-20">No car found</div>;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Image Gallery Section */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-lg shadow-lg">
            <img 
              src={car.images[currentImageIndex]} 
              alt={`${car.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-[500px] object-cover"
            />
            
            {/* Image Navigation Buttons */}
            {car.images.length > 1 && (
              <>
                <button 
                  onClick={prevImage} 
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white"
                >
                  <ChevronLeft />
                </button>
                <button 
                  onClick={nextImage} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white"
                >
                  <ChevronRight />
                </button>
              </>
            )}
            
            {/* Thumbnail Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {car.images.map((_, index) => (
                <div 
                  key={index} 
                  className={`w-3 h-3 rounded-full ${
                    index === currentImageIndex ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Car Details Section */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{car.name}</h1>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Car className="mr-2 text-blue-600" />
                  <span>Model: {car.model}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2 text-blue-600" />
                  <span>Year: {car.year}</span>
                </div>
                <div className="flex items-center">
                  <Shield className="mr-2 text-blue-600" />
                  <span>Transmission: {car.transmission}</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-2 text-green-600" />
                  <span>Fuel Type: {car.fuelType}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-gray-700 mb-6">{car.description}</p>

          <div className="flex items-center mb-6">
            <h2 className="text-3xl font-bold text-blue-600 mr-4">
              ${car.pricePerDay}/day
            </h2>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Features</h3>
            <ul className="grid grid-cols-2 gap-2">
              {car.features.filter(Boolean).map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="mr-2 text-green-500 w-5 h-5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full py-3 text-lg">Book Now</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Book Your Car</DialogTitle>
              </DialogHeader>
              <BookingForm car={car} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Separator className="my-10"/>
      <DisplayCar/>
    </div>
  );
};

export default CarDetail;