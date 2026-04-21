import Sidebar from './Sidebar';
import Mirrors from './Mirrors';

function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <h1>mahdixak</h1>
        <p>Hover the sidebar to expand labels and the header title.</p>
        <Mirrors />
      </main>
    </div>
  );
}

export default App;
