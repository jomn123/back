<template>
    <div class="not-found">
      <div class="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
        <router-link to="/" class="btn">Go to Dashboard</router-link>
      </div>
    </div>
  </template>
  
  <style scoped>
  .not-found {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    text-align: center;
  }
  
  .not-found-content {
    max-width: 500px;
    padding: 30px;
  }
  
  h1 {
    font-size: 6rem;
    margin: 0;
    color: #343a40;
  }
  
  h2 {
    font-size: 2rem;
    margin-bottom: 20px;
    color: #343a40;
  }
  
  p {
    margin-bottom: 25px;
    color: #6c757d;
  }
  </style>