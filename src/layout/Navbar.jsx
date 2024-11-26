import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Monitor scroll position to toggle the fixed navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Adjust threshold as needed
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav
      className={`${
        isScrolled ? 'fixed top-0 left-0 right-0 shadow-md' : 'relative'
      } bg-white border-b z-50 transition-shadow duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center">
                    <img
                      src="/api/placeholder/150/50"
                      alt="Zoomcar"
                      className="h-8"
                    />
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <Button variant="ghost" className="w-full justify-start">
                    <Link to="w/login" className="flex items-center space-x-2">
                      <span>Login/Register</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Link to="/api/cars" className="flex items-center space-x-2">
                      <span>Search a Car</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Link to="/about" className="flex items-center space-x-2">
                      <span>About Us</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Link to="/contact" className="flex items-center space-x-2">
                      <span>Contact</span>
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <div className="ml-4">
              {/* <img src="/api/placeholder/150/50" alt="Rentify" className="h-8" /> */}
              <h2 className="text-2xl sm:text-2xl lg:text-4xl font-extrabold text-yellow-500 shadow-2xl transform transition-all duration-300 hover:scale-110">
  Rentify
</h2>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link to="/about">
              <Button variant="ghost">About Us</Button>
            </Link>
            <Link to="/contact">
              <Button variant="ghost">Contact</Button>
            </Link>
          </div>
          <Link to="/login">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Login/Register
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
