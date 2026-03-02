import "./App.css";
import Gallery from "./components/Gallery";
import LoginGate from "./components/LoginGate";
import UploadForm from "./components/UploadForm";

function App() {
  return (
    <LoginGate>
      <div className="appContainer">
        <header className="appHeader">
          <h1> What's New?</h1>
        </header>
        <div className="appDivider" />
        <div className="dailyFunFact" style={{ textAlign: "center" }}>
          Daily fun fact coming soon...{" "}
          <a href="https://www.notion.so/317744d2401f804a894ed84da6a4252a?v=317744d2401f8037b50b000c3376a66d&source=copy_link">
            See all upcoming features
          </a>
        </div>

        <main className="dashboard">
          <UploadForm />
          <div className="galleryContainer">
            <Gallery />
          </div>
        </main>
      </div>
    </LoginGate>
  );
}

export default App;
