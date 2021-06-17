import React, { useState, useEffect } from "react";
import "./App.css";
import RouterSetup from "./RouterSetup";
import axios from "axios";

axios.defaults.baseURL = "/api";

const App = () => {
  return (
    <div class="App__container">
      <RouterSetup />
    </div>
  );
};

export default App;
