import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useSWR from "swr";

const fetcher = async ([url, body]) => {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Client-id": "7645129791",
                "Secret-key": "Qfj1UUkFItWfVFwWpJ65g0VfhjdVGN",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch shop data");
        }

        return response.json();
    } catch (error) {
        console.error("Shop data fetch error:", error);
        throw error;
    }
};

const useShopData = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
    const [sortBy, setSortBy] = useState(searchParams.get("sort_by") || "1"); 


    const buildFilters = () => {
        const filters = {};
        searchParams.forEach((value, key) => {
            if (key === "query" || key === "page") return; 
            if (key === "price") {
                filters[key] = value.split(",").map(Number);  
            } else {
                filters[key] = value.split(",");
            }
        });
        return filters;
    };

    const query = searchParams.get("query") || "";
    const filters = buildFilters();

    const { data, error, isLoading } = useSWR(
        ["https://uat.search-assist.webc.in/api/search", { search: query, filter: filters, size: 28, sort_by: "1" }],
        fetcher
    );
     
    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.set("query", searchQuery);
        params.set("page", "1");  
        setSearchParams(params);
    };

    const updatePage = (page) => {
        setCurrentPage(page);
        const params = new URLSearchParams(searchParams);
        params.set("page", page);
        setSearchParams(params);
    };

   

    return { data, error, isLoading, handleSearch, searchQuery, setSearchQuery, currentPage, updatePage };
};

export default useShopData;
