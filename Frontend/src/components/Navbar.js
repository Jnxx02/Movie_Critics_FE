import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import './Navbar.css';
import { Link } from 'react-router-dom';

const MyNavbar = ({ email, handleLogout }) => {
  return (
    <Navbar className="navbar-custom" bg="dark" variant="dark" expand="lg">
      <Navbar.Brand className="navbar-brand-custom" href="/">Movie Critics</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link className="nav-link-custom" href="/listfilm">Film</Nav.Link>
          <Nav.Link className="nav-link-custom" href="/listkritikus">Kritikus</Nav.Link>
        </Nav>
        <Nav className="sign-menu">
          {email ? (
            <>
              <Nav.Link as={Link} to="/profile" className="nav-link-custom">
                {email}
              </Nav.Link>
              <Button variant="danger" onClick={handleLogout} className="btn-signout">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline-light" className="btn-signin">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button variant="danger" className="btn-signup">Sign Up</Button>
              </Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default MyNavbar;
