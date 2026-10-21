import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Categories from "./pages/Categories";
import ManCollection from "./pages/ManCollection";
import WomanCollection from "./pages/WomanCollection";
import GirlCollection from "./pages/GirlCollection";
import BoyCollection from "./pages/BoyCollection";
import KidsCollection from "./pages/KidsCollection";
import OtakuCollection from "./pages/OtakuCollection";
import AllProduits from "./pages/AllProduits";
import ProductDetail from "./pages/ProductDetail";
import ProduitDetail from "./pages/ProduitDetail";
import SpecialOffers from "./pages/SpecialOffers";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddProduct from "./pages/admin/AddProduct";
import ViewOrders from "./pages/admin/ViewOrders";
import AdminRoute from "./components/AdminRoute";
import NotFound from "./pages/NotFound";
import CustomDesign from "./pages/CustomDesign";
import ItachiZone from "./pages/ItachiZone";
import ProductImages from "./pages/ProductImages";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/man" element={<ManCollection />} />
      <Route path="/woman" element={<WomanCollection />} />
      <Route path="/girl" element={<GirlCollection />} />
      <Route path="/boy" element={<BoyCollection />} />
      <Route path="/kids" element={<KidsCollection />} />
      <Route path="/otaku" element={<OtakuCollection />} />
      <Route path="/produits" element={<AllProduits />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/produit/:id" element={<ProduitDetail />} />
      <Route path="/offers" element={<SpecialOffers />} />
      <Route path="/custom-design" element={<CustomDesign />} />
      <Route path="/otaku-zone" element={<ItachiZone />} />
      <Route path="/product-images" element={<ProductImages />} />
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/add-product" element={<AdminRoute><AddProduct /></AdminRoute>} />
      <Route path="/admin/orders" element={<AdminRoute><ViewOrders /></AdminRoute>} />
      <Route path="/admin/view-orders" element={<AdminRoute><ViewOrders /></AdminRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </TooltipProvider>
);

export default App;
