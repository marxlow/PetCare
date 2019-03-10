import React from 'react';

const AppHeader = (({ onLogout, onSearch }) => {
  return (
    <nav className="navbar navbar-light bg-brand-grad px-4">
      <div className="d-flex justify-content-between w-100">
        <a className="navbar-brand text-dark" href="/">
          <h2>PetCare</h2>
        </a>
        <section>
          <button className="btn btn-outline-danger btn-lg mr-4" onClick={onSearch}>Search</button>
          <button className="btn btn-outline-danger btn-lg ml-4" onClick={onLogout}>Logout</button>
        </section>
      </div>
    </nav>
  );
});

export default AppHeader;