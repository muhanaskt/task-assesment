import React, { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";

const Filter = ({ filters, selectedFilters, setSelectedFilters }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [expandedFilters, setExpandedFilters] = useState({});

  const handleFilterChange = (attribute, value) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };

      if (attribute === "price") {
        updatedFilters[attribute] = value;
      } else {
        updatedFilters[attribute] = updatedFilters[attribute] || [];
        if (updatedFilters[attribute].includes(value)) {
          updatedFilters[attribute] = updatedFilters[attribute].filter(
            (v) => v !== value
          );
        } else {
          updatedFilters[attribute] = [...updatedFilters[attribute], value];
        }
      }
      const params = new URLSearchParams();
      if (searchParams.has("query")) {
        params.set("query", searchParams.get("query"));
      }
      Object.entries(updatedFilters).forEach(([key, val]) => {
        if (key === "price") {
          params.set(key, val);
        } else if (Array.isArray(val) && val.length > 0) {
          val.forEach((item) => params.append(key, item));
        }
      });
      console.log("Updated URL Params:", params.toString());
      setSearchParams(params);
      return updatedFilters;
    });
  };

  const handleClearFilters = () => {
    const params = new URLSearchParams();
    if (searchParams.has("query")) {
      params.set("query", searchParams.get("query"));
    }
    setSearchParams(params);
    setSelectedFilters({});
  };

  const toggleExpand = (attribute) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [attribute]: !prev[attribute],
    }));
  };

  const hasFilters = Array.from(searchParams.keys()).some(
    (key) => key !== "query"
  );

  return (
    <Card className="p-3 shadow-sm">
      <Card.Body>
        <Card.Title>Filters</Card.Title>

        {hasFilters && (
          <Button
            variant="warning"
            className="mb-3 w-100"
            onClick={handleClearFilters}
          >
            Clear All
          </Button>
        )}

        <Form>
          {filters.map((filter) => {
            const isPriceFilter = filter.attribute === "price";
            const optionsArray = Array.isArray(filter.options)
              ? filter.options
              : [];
            const isExpanded = expandedFilters[filter.attribute];
            const visibleOptions = isExpanded
              ? optionsArray
              : optionsArray.slice(0, 10);

            return (
              <div key={filter.attribute} className="mb-3">
                <h6>{filter.label}</h6>
                {isPriceFilter ? (
                  <Form.Range
                    min={filter.options.min_price}
                    max={filter.options.max_price}
                    step={10}
                    onChange={(e) =>
                      handleFilterChange(filter.attribute, e.target.value)
                    }
                  />
                ) : (
                  <>
                    {visibleOptions.map((option) => (
                      <Form.Check
                        key={option.name}
                        type="checkbox"
                        label={`${option.label} (${option.count})`}
                        checked={
                          selectedFilters[filter.attribute]?.includes(
                            option.name
                          ) || false
                        }
                        onChange={() =>
                          handleFilterChange(filter.attribute, option.name)
                        }
                      />
                    ))}
                    {optionsArray.length > 10 && (
                      <Button
                        variant="link"
                        className="p-0 mt-1"
                        onClick={() => toggleExpand(filter.attribute)}
                      >
                        {isExpanded ? "Show Less" : "Show More"}
                      </Button>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Filter;
