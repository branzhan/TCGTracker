import React from 'react';
import AppRouter from './routes/AppRouter';

function App() {
  return (
    <div className="App">
      {/* Your application layout or header/footer */}
      <header>
        {/* Header content */}
      </header>
      <main>
        {/* Render the AppRouter to handle routing */}
        <AppRouter />
      </main>
      <footer>
        {/* Footer content */}
      </footer>
    </div>
  );
}

export default App;
