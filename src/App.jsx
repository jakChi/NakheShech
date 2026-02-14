import "./App.css";
import LoginGate from "./components/LoginGate";
import UploadForm from "./components/UploadForm";

function App() {
  return (
    <LoginGate>
      <div className="App">
        <header>
          <h1>Welcome to the Inspiration Hub!</h1>
        </header>
        <main>
          <UploadForm />
          {/* gallery will be here soon! */}
        </main>
      </div>
    </LoginGate>
  );
}

export default App;
