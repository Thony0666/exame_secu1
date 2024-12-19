import { RouterProvider } from "react-router-dom"
import router from "./router"
import CaptchaModal from "./components/Index"

function App() {
  return (
    <>
      <RouterProvider router={router}/>
      <CaptchaModal />
    </>
  )
}
export default App
