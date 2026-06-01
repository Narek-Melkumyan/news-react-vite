import './App.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Main from "./pages/layouts/main.jsx";
import Home from "./pages/home.jsx";
import Catalog from "./pages/catalog.jsx";
import Details from "./pages/details.jsx";
import Videos from "./pages/videos.jsx";


function App() {

  const routers=createBrowserRouter([

    {
      path: "/",
      element: <Main />,
      children:[
        {
          index:true,
          element:<Home/>
        },
        {
          path:'/catalog/:id',
          element:<Catalog/>
        },{
          path:'/post/:slug',
          element:<Details/>
        },
        {
          path:'/video/:id',
          element:<Videos/>
        }
      ]
    }
  ])




  return <RouterProvider router={routers} />
}

export default App
