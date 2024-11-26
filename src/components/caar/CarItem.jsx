import React from 'react';
import { Link } from 'react-router-dom';
import { Separator } from '../ui/separator';
const CarItem = ({ car }) => {
  return (
    <Link to={`/cars/${car?._id}`}>
        <div className='border rounded-xl w-[300px] md:w-full bg-white cursor-pointer hover:shadow-md relative'>
        <div className='absolute top-2 left-2 z-30'>
          {/* Badge for "New" or "Pre-Certified" */}
          {car?.available && (
            <h2 className='bg-primary px-3 py-1 rounded-full text-white text-sm'>
              Available
            </h2>
          )}
          {!car?.available && (
            <h2 className='bg-primary px-3 py-1 rounded-full text-white text-sm'>
              Not-Available
            </h2>
          )}
        </div>
        <div className='relative h-[200px] w-full overflow-hidden'>
          <img
            className='rounded-t-xl h-full w-full object-cover'
            src={car?.images[0] || "https://via.placeholder.com/150"}
            alt={car?.name}
          />
        </div>

          <Separator className="my-2" />
        <div className='w-full flex justify-between px-10 items-center'>
          <h2 className='font-bold text-black text-lg pl-3 my-2'>
            {car?.name}
          </h2>
          <h2 className='font-bold text-blue-700'>{car?.pricePerDay}/day</h2>
        </div>
      </div>
      
    </Link>
  );
};

export default CarItem;
