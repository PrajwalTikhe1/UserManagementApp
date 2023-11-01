import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Form, ListGroup, Pagination } from 'react-bootstrap';

const App = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortBy, setSortBy] = useState('name');
  const [genderFilter, setGenderFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');

  useEffect(() => {
    const fetchRandomUsers = async () => {
      try {
        const response = await fetch('https://randomuser.me/api/?results=100');
        const data = await response.json();
        setUsers(data.results);
      } catch (error) {
        console.error('Error fetching random users:', error);
      }
    };

    fetchRandomUsers();
  }, []);

  // Selects User
  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  // Search
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  // Sort Order
  const handleSort = (column) => {
    if (column === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Gender Filter
  const handleGenderFilter = (gender) => {
    setGenderFilter(gender);
    setCurrentPage(1);
  };

  // Location Filter
  const handleLocationFilter = (location) => {
    setLocationFilter(location);
    setCurrentPage(1);
  };

  // Search & Filter Results
  const filteredUsers = users.filter((user) => {
    const nameMatchesSearch = Object.values(user)
      .join('')
      .toLowerCase()
      .includes(search.toLowerCase());
    const genderMatchesFilter =
      genderFilter === 'All' ||
      user.gender.toLowerCase() === genderFilter.toLowerCase();
    const locationMatchesFilter =
      locationFilter === 'All' ||
      user.location.country.toLowerCase() === locationFilter.toLowerCase();

    return nameMatchesSearch && genderMatchesFilter && locationMatchesFilter;
  });

  // User Countries
  const availableCountries = [
    ...new Set(users.map((user) => user.location.country)),
  ];

  // Pagination - Indexing
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  // Sorting User
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc'
        ? a.name.first.localeCompare(b.name.first)
        : b.name.first.localeCompare(a.name.first);
    } else if (sortBy === 'email') {
      return sortOrder === 'asc'
        ? a.email.localeCompare(b.email)
        : b.email.localeCompare(a.email);
    } else if (sortBy === 'age') {
      return sortOrder === 'asc'
        ? a.dob.age - b.dob.age
        : b.dob.age - a.dob.age;
    }
  });

  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  return (
    <Container>
      <Row>
        <h2 className="head">User Management Application</h2>
        <Col md={8}>
          <h4 className="head2">User List</h4>
          {/* Search Bar */}
          <Form.Group controlId="searchForm">
            <Form.Control
              type="text"
              placeholder="Search by name, email, age, phone, country"
              onChange={handleSearchChange}
              value={search}
            />
          </Form.Group>
          {/* Filters */}
          <Form.Group
            controlId="filtersForm"
            className="d-flex justify-content-between align-items-center mb-3"
          >
            <div className="d-flex justify-content-between align-items-center ms-1">
              <span className="me-2">Gender:</span>
              <Form.Check
                type="radio"
                label="All"
                name="genderFilter"
                value="All"
                checked={genderFilter === 'All'}
                onChange={() => handleGenderFilter('All')}
                inline
              />
              <Form.Check
                type="radio"
                label="Male"
                name="genderFilter"
                value="Male"
                checked={genderFilter === 'Male'}
                onChange={() => handleGenderFilter('Male')}
                inline
              />
              <Form.Check
                type="radio"
                label="Female"
                name="genderFilter"
                value="Female"
                checked={genderFilter === 'Female'}
                onChange={() => handleGenderFilter('Female')}
                inline
              />
            </div>
            <div className="d-flex align-items-center justify-content-start">
              <Form.Label className="me-2">Country:</Form.Label>
              <Form.Control
                as="select"
                value={locationFilter}
                style={{ width: '150px' }}
                onChange={(e) => handleLocationFilter(e.target.value)}
              >
                <option value="All">All Countries</option>
                {availableCountries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </Form.Control>
            </div>
          </Form.Group>
          {/* Sorting */}
          <ListGroup>
            <ListGroup.Item>
              <div className="d-flex justify-content-between">
                <span onClick={() => handleSort('name')}>
                  Name{' '}
                  {sortBy === 'name' && (
                    <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>
                  )}
                </span>
                <span onClick={() => handleSort('email')}>
                  Email{' '}
                  {sortBy === 'email' && (
                    <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>
                  )}
                </span>
                <span onClick={() => handleSort('age')}>
                  Age{' '}
                  {sortBy === 'age' && (
                    <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>
                  )}
                </span>
              </div>
            </ListGroup.Item>
            {/* Current User */}
            {currentUsers.map((user, index) => (
              <ListGroup.Item
                key={index}
                action
                onClick={() => handleUserClick(user)}
              >
                <div className="d-flex justify-content-between">
                  <span>
                    {user.name.first} {user.name.last}
                  </span>
                  <span>{user.email}</span>
                  <span>{user.dob.age} years</span>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
          {/* Pagination */}
          <Pagination className="justify-content-center mt-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <Pagination.Item
                key={index}
                active={index + 1 === currentPage}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </Col>
        <Col md={4} className="text-center">
          <h4 className="head2">User Details</h4>
          {/* Details of Selected User */}
          {selectedUser && (
            <div>
              <img
                className="img-fluid"
                src={selectedUser.picture.large}
                alt={`${selectedUser.name.first} ${selectedUser.name.last}`}
              />
              <p className="mt-2">
                Name: {`${selectedUser.name.first} ${selectedUser.name.last}`}
              </p>
              <p>Email: {selectedUser.email}</p>
              <p>Phone: {selectedUser.phone}</p>
              <p>Age: {selectedUser.dob.age}</p>
              <p>Country: {selectedUser.location.country}</p>
              <p>Gender: {selectedUser.gender}</p>
            </div>
          )}
        </Col>
        <small className="text-center mt-2">Developed by: Prajwal Tikhe</small>
      </Row>
    </Container>
  );
};

export default App;
