import "./App.css";
import Gallery from "./components/Gallery";
import LoginGate from "./components/LoginGate";
import UploadForm from "./components/UploadForm";

function App() {
  return (
    <LoginGate>
      <div className="App">
        <main>
          <UploadForm />
          <Gallery />
        </main>
      </div>
    </LoginGate>
  );
}

export default App;
