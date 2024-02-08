import React, {FC} from 'react';
import "./App.css";
import { createBrowserRouter, createRoutesFromElements, Route, Outlet, RouterProvider } from 'react-router-dom';
import { Home } from './pages/home/Homepage';
import { Login } from './pages/Login';
import { NavigationBar } from './componets/Link';
import { PostArticle } from './pages/home/post/post-article';


const App: FC = () =>{

  const browserRouter = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Root/>}>
      <Route index element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/post' element={<PostArticle/>}/>
      </Route>
    )
  )



  return (
    <div className="App">
      <RouterProvider router={browserRouter}/>
    </div>
  );
}

export default App;

const Root = () =>{
  return (
  <>
    <NavigationBar/>
    <div>
      <Outlet/>
    </div>
  </>
  )
}