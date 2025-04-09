"use client";

import { createContext, useContext, useState } from "react";
import format from "date-fns/format";

// Estado inicial de la reserva
const initialSearchData = {
    pickupLocation: {
        id: "AIBJ-T1-048",
        city: "CDMX",
        name: "Interior del AICM T1, local 048 Puerta 4 área Nacional, CDMX",
    },
    returnLocation: {
        id: "AIBJ-T1-048",
        city: "CDMX",
        name: "Interior del AICM T1, local 048 Puerta 4 área Nacional, CDMX",
    },
    sameOffice: true,
    pickupDate: new Date(),
    returnDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    pickupTime: "08:00 AM",
    returnTime: "08:00 AM",
};

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [searchData, setSearchData] = useState(initialSearchData);

    return (
        <SearchContext.Provider value={{ searchData, setSearchData }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => useContext(SearchContext);
