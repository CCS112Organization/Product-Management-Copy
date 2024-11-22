import React, { useState, useEffect } from "react";
import { Button, Form, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AddProduct.css";

function AddProduct() {
  const [defaultValue, setDefaultValue] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const generateRandomNumber = () => {
    const randomNumber = Math.floor(
      100000000000 + Math.random() * 900000000000
    );
    setDefaultValue(randomNumber.toString());
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); 
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);
  
    const productData = {
      barcode: defaultValue,
      name: productName,
      description,
      price,
      quantity,
      category,
    };
    
    const token = localStorage.getItem('token');

    try {
      const response = await fetch("http://127.0.0.1:8000/api/products", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const messages = Object.values(errorData.errors).flat().join(', ');
        setErrorMessage(messages || "An error occurred.");
        return;
      }
  
      const data = await response.json();
      setSuccessMessage("Product added successfully!");

      setDefaultValue("");
      setProductName("");
      setDescription("");
      setPrice("");
      setQuantity("");
      setCategory("");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1300);
      
    } catch (error) {
      setErrorMessage(error.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-add">
      <Card>
        <Card.Header>
          <h1>Add Product</h1>
        </Card.Header>
        <Card.Body>
          {successMessage && (
            <div className={`alert alert-success show`}> {successMessage} </div>
          )}
          {errorMessage && (
            <div className="alert alert-danger show">{errorMessage}</div>
          )}
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="barcode">
                  <Form.Label>Barcode (UPC)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter barcode"
                    value={defaultValue}
                    readOnly
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  onClick={generateRandomNumber}
                  className="generate-button"
                  required
                >
                  Generate Barcode
                </Button>
              </Col>
              <Col md={6}>
                <Form.Group controlId="name">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter product name"
                    value={productName}
                    onChange={(e) => {
                      setProductName(e.target.value);
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    required
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
                    placeholder="Enter product description"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
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
                    inputMode="decimal"
                    placeholder="Enter price"
                    min="1"
                    step="0.01"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value);
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="quantity">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    inputMode="decimal"
                    placeholder="Enter quantity"
                    min="1"
                    value={quantity}
                    onChange={(e) => {
                      setQuantity(e.target.value);
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
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
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    required
                  >
                    <option value="">Select a category</option>
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
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default AddProduct;
