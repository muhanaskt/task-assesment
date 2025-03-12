
import 'bootstrap/dist/css/bootstrap.min.css';
 import SearchPage from './page/search-page/SearchPage'
import { BrowserRouter } from "react-router-dom";

function App() {
 

  return (
    <>
     <BrowserRouter>
     <SearchPage/>
     
     </BrowserRouter>
    </>
  )
}

export default App
