import { useState, useRef, useEffect, use } from "react";
import "./navigation.css";

function Navigation() {

    return (
        <div>
            <nav className="bg-gray-800">
                <ul className="flex justify-left text-white text-[18px]">
                    <li className="list px-4 py-3 hover:bg-gray-700 cursor-pointer">Home</li>

                    <li className="list group relative">
                        <div className="px-4 py-3 hover:bg-gray-700 cursor-pointer">
                            Products
                        </div>

                        {/* Dropdown Menu - Hidden by default */}
                        <ul className="absolute left-0 top-full bg-gray-800 min-w-[200px] mt-1 shadow-lg hidden group-hover:block">
                            <li className="list px-4 py-3 hover:bg-gray-700 cursor-pointer">
                                All Products
                            </li>
                            <li className="list px-4 py-3 hover:bg-gray-700 cursor-pointer">
                                Electronics
                            </li>
                            <li className="list px-4 py-3 hover:bg-gray-700 cursor-pointer">
                                Clothing
                            </li>
                            <li className="list px-4 py-3 hover:bg-gray-700 cursor-pointer">
                                Accessories
                            </li>
                        </ul>
                    </li>

                    <li className="list px-4 py-3 hover:bg-gray-700 cursor-pointer">About Us</li>
                    <li className="list px-4 py-3 hover:bg-gray-700 cursor-pointer">Contact</li>
                </ul>
            </nav>
        </div>
    );
}

export default Navigation;