import React from 'react';
import { Link } from 'react-router-dom';
import './not-found.css';

export default function NotFound() {
  return (
    <div className="notFound">
      <p className="centeredText">
        We're sorry, but this page couldn't be found.
      </p>
      <p className="centeredText">
        <Link to="/">Return Home</Link>
      </p>
    </div>
  );
}
