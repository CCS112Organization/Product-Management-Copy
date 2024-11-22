import React, { useState, useEffect } from "react";
import { Table, Form, Button, Card, Modal, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import GridLoader from "react-spinners/GridLoader";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";

// API Base URL
const API_URL = "http://127.0.0.1:8000/api/products";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editedProduct, setEditedProduct] = useState({
    barcode: null,
    name: "",
    description: "",
    quantity: 0,
    price: 0,
    category: "Electronics",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); 
    } else {
      fetchProducts(); 
    }
  }, [navigate]);

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 3000); 

      return () => clearTimeout(timer); 
    }
  }, [successMessage, errorMessage]);

  const fetchProducts = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to fetch products.");
        return;
      }

      const data = await response.json();
      setOriginalData(data);
      setFilteredData(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setErrorMessage("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseEdit = () => setShowEditModal(false);
  const handleCloseDelete = () => setShowDeleteModal(false);

  const handleShowEdit = (product) => {
    setSelectedProduct(product);
    setEditedProduct(product);
    setShowEditModal(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProduct = async () => {
    setModalLoading(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_URL}/${editedProduct.barcode}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editedProduct),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const messages = Object.values(errorData.errors).flat().join(', ');
        setErrorMessage(messages || "An error occurred.");
        return;
      }

      setSuccessMessage("Product updated successfully!");
      fetchProducts();
      handleCloseEdit();
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleShowDelete = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleDeleteProduct = async () => {
    setModalLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/${selectedProduct.barcode}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setErrorMessage("Failed to delete product.");
        return;
      }
  
      setSuccessMessage("Product deleted successfully!");
      fetchProducts();
      handleCloseDelete();
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleSearch = () => {
    searchName(searchTerm, categoryFilter);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCategoryFilter("All");
    setFilteredData(originalData);
  };

  const searchName = (name, category) => {
    let data = [...originalData];

    if (name) {
      data = data.filter((product) =>
        product.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    if (category !== "All") {
      data = data.filter((product) => product.category === category);
    }

    setFilteredData(data);
  };

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setCategoryFilter(category);
    searchName(searchTerm, category);
  };

  const isUpdateDisabled = !editedProduct.price || editedProduct.price <= 0 || !editedProduct.quantity || editedProduct.quantity <= 0;

  return (
    <>
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <GridLoader
            color="#308fff"
            cssOverride={{ margin: "auto" }}
            size={35}
          />
        </div>
      ) : (
        <div className="container-dashboard">
          <Card>
            <Card.Header>
              <h1>Product Table</h1>
            </Card.Header>
            <Card.Body>
              {successMessage && (
                <div className={`message success`}>
                  {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className={`message error`}>
                  {errorMessage}
                </div>
              )}
              {filteredData.length === 0 && (
                <div className="text-center">
                  <p>No products found.</p>
                </div>
              )}
              <Form>
                <Row>
                  <Col>
                    <Form.Group className="mb-3" controlId="search">
                      <Form.Label className="mb-">Search product:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter product name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSearch();
                          }
                        }}
                      />
                    </Form.Group>
                    <Button
                      variant="primary"
                      size="sm"
                      className="me-2"
                      onClick={handleSearch}
                    >
                      Search
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="me-2"
                      onClick={handleClearSearch}
                    >
                      Clear Search
                    </Button>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="category">
                      <Form.Label>Filter by category:</Form.Label>
                      <Form.Select
                        value={categoryFilter}
                        onChange={handleCategoryChange}
                      >
                        <option value="All">All</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Biography">Biography</option>
                        <option value="Comedy">Comedy</option>
                        <option value="Comics">Comics</option>
                        <option value="Children">Children</option>
                        <option value="Documentary">Documentary</option>
                        <option value="Drama">Drama</option>
                        <option value="Fantasy">Fantasy</option>
                        <option value="Fiction">Fiction</option>
                        <option value="History">History</option>
                        <option value="Horror">Horror</option>
                        <option value="Mystery">Mystery</option>
                        <option value="Non-Fiction">Non-Fiction</option>
                        <option value="Romance">Romance</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
              <div style={{ maxHeight: "335px", overflowY: "auto" }}>
                <Table striped bordered hover responsive="sm">
                  <thead>
                    <tr>
                      <th>Product ID</th>
                      <th>Product Name</th>
                      <th>Product Description</th>
                      <th>Stock</th>
                      <th>Price</th>
                      <th>Category</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((product) => (
                      <tr key={product.barcode}>
                        <td>{product.barcode}</td>
                        <td>{product.name}</td>
                        <td>{product.description}</td>
                        <td>{product.quantity}</td>
                        <td>{product.price}</td>
                        <td>{product.category}</td>
                        <td >
                          <Button 
                            variant="warning"
                            size="sm"
                            className="edit-btn"
                            onClick={() => handleShowEdit(product)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            className = "delete-btn"
                            onClick={() => handleShowDelete(product)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}
      <Modal
        show={showEditModal}
        onHide={handleCloseEdit}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="barcode">
                  <Form.Label>Barcode (UPC)</Form.Label>
                  <Form.Control
                    type="text"
                    name="barcode"
                    value={editedProduct.barcode}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="name">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={editedProduct.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={editedProduct.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="price">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={editedProduct.price}
                    onChange={handleInputChange}
                    placeholder="Enter price"
                    step="0.01"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="quantity">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    value={editedProduct.quantity}
                    onChange={handleInputChange}
                    placeholder="Enter quantity"
                    min="1"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="category">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={editedProduct.category}
                    onChange={handleInputChange}
                  >
                    <option value="Adventure">Adventure</option>
                    <option value="Biography">Biography</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Comics">Comics</option>
                    <option value="Children">Children</option>
                    <option value="Documentary">Documentary</option>
                    <option value="Drama">Drama</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Fiction">Fiction</option>
                    <option value="History">History</option>
                    <option value="Horror">Horror</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Romance">Romance</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleUpdateProduct} disabled={isUpdateDisabled || modalLoading}>
            {modalLoading ? "Updating..." : "Update"}
          </Button>
          <Button variant="secondary" onClick={handleCloseEdit}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDeleteModal}
        onHide={handleCloseDelete}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this product?</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDeleteProduct} disabled={modalLoading}>
            {modalLoading ? "Deleting..." : "Delete"}
          </Button>
          <Button variant="secondary" onClick={handleCloseDelete}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Home;
