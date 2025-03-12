import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
  Pagination,
  Spinner,
} from "react-bootstrap";
import useShopData from "../../components/useShopData";
import useFilter from "../../components/useFilter";
import Filter from "../../components/Filter";

const SORT_OPTIONS = [
  { value: "1", label: "Relevance" },
  { value: "2", label: "Price: High to Low" },
  { value: "3", label: "Price: Low to High" },
  { value: "4", label: "Newest" },
];

const SearchPage = () => {
  const {
    handleSearch,
    data,
    error,
    searchQuery,
    setSearchQuery,
    currentPage,
    updatePage,
    isLoading,
  } = useShopData();
  const { selectedFilters, setSelectedFilters, filteredItems } =
    useFilter(data);

  const itemsPerPage = 8;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  return (
    <Container className="py-4">
      <Row className="justify-content-center mb-4">
        <Col md={6}>
          <Form
            onSubmit={handleSearch}
            className="d-flex border rounded overflow-hidden"
          >
            <Form.Control
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="flex-grow-1 border-0"
            />
            <Button type="submit" variant="primary">
              Search
            </Button>
          </Form>
        </Col>

       
      </Row>

      <Row>
        <Col md={3}>
          <Filter
            filters={data?.filter_list || []}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
          />
        </Col>

        <Col md={9}>
          {isLoading && (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "50vh" }}
            >
              <Spinner animation="border" variant="primary" />
            </div>
          )}

         

          {!isLoading && (
            <>
              <Row xs={1} md={2} lg={4} className="g-4">
                {currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    <Col key={item.id}>
                      <Card className="h-100 shadow-sm">
                        <Card.Img
                          variant="top"
                          src={item.image_link}
                          alt={item.title}
                          style={{ height: "150px", objectFit: "cover" }}
                        />
                        <Card.Body>
                          <Card.Title className="fs-6">{item.title}</Card.Title>
                          <Card.Text className="text-muted small">
                            {item.brand}
                          </Card.Text>
                          <Card.Text className="text-danger fw-bold">
                            KWD {item.sale_price}
                          </Card.Text>
                          {item.discount_percentage > 0 && (
                            <Card.Text className="text-success small">
                              {item.discount_percentage}% Off
                            </Card.Text>
                          )}
                          <Button
                            variant="primary"
                            size="sm"
                            className="w-100 mt-2"
                          >
                            Add to Compare
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <p>No products found</p>
                )}
              </Row>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.First
                      onClick={() => updatePage(1)}
                      disabled={currentPage === 1}
                    />
                    <Pagination.Prev
                      onClick={() => updatePage(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                    {[...Array(totalPages)].map((_, index) => (
                      <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => updatePage(index + 1)}
                      >
                        {index + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() => updatePage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                    <Pagination.Last
                      onClick={() => updatePage(totalPages)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SearchPage;
