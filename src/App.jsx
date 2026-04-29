import { useState } from 'react';
import Sidebar from './Sidebar';
import Mirrors from './Mirrors';
import Finance from './Finance';

function App() {
  const [activePage, setActivePage] = useState('home');

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNav={setActivePage} />
      <main className={`app-main${activePage === 'finance' ? ' app-main--finance' : ''}`}>
        {activePage === 'finance' ? (
          <Finance />
        ) : (
          <>
            <h1>mahdixak</h1>
            <p>Hover the sidebar to expand labels and the header title.</p>
            <Mirrors />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
