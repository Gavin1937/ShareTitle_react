import React, { useState } from 'react';
import SearchBar from '../components/SearchBar'

function Main() {
  return (
    <div className="Main">
      <p>Hello World</p>
      <SearchBar
      width={"90%"}
      height={"10%"}
      />
    </div>
  );
}

export default Main;
