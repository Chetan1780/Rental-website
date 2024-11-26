import React, { useEffect, useState } from 'react';
import CarItem from './CarItem';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '../../components/ui/carousel';

const DisplayCar = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/cars");
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                const data = await response.json();
                setCars(data.cars || []); // Assuming `data.cars` is an array
                setError(null);
            } catch (error) {
                setError(error.message || "Failed to fetch cars");
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-500 text-lg">Loading cars...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-red-500 text-lg">{error}</p>
            </div>
        );
    }

    if (cars.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-500 text-lg">No cars available at the moment.</p>
            </div>
        );
    }

    return (
        <div className="mx-2 md:mx-24 my-10">
            <h2 className="font-bold border-b-2 w-fit mx-auto text-3xl mt-10 text-center mb-8">Most Searched Cars</h2>
            <Carousel>
                <CarouselContent>
                    {cars.map((item, index) => (
                        <CarouselItem key={index} className="basis-1/1 sm:basis-1/2 md:basis-1/2 xl:basis-1/4">
                            <CarItem car={item} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
};

export default DisplayCar;
