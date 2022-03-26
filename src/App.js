import { AppContextWrapper } from "./AppContext";
import Content from "./Content";

function App() {
  return (
    <AppContextWrapper>
      <div className="flex justify-center items-center h-screen">
        <Content />
      </div>
    </AppContextWrapper>
  );
}

export default App;
