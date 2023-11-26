import React, { useState, useEffect } from "react";
import CartCard from "../components/CartCard";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { checkoutCart } from "../redux/slices/CartSlice";
import { InlineCheckout } from "tonder-sdk-test";

import toast from "react-hot-toast";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const tonderResponse = (data) => {
    console.log('data: ', data)
    toast.success("Order Placed Successfully");
    localStorage.removeItem("localCart");
    dispatch(checkoutCart());
    navigate("/");
  }

  useEffect(() => {
    setTotal(
      cart.reduce((acc, curr) => acc + curr.retail_price_cents * curr.qty, 0) / 100
    )
  }, [cart]);

  const checkoutStyle = {
    marginTop: "2rem",
    overflow: "hidden",
    transition: "max-height 0.3s",
  };

  useEffect(()=>{
    const items = cart.map(item => ({
      "description": item.description,
      "quantity": item.qty,
      "price_unit": item.retail_price_cents,
      "product_reference": item.id,
      "name": item.name,
      "amount_total": parseFloat((parseFloat(item.retail_price_cents) * parseFloat(item.qty)).toFixed(2))
    }))

    const apiKey = import.meta.env.VITE_TONDER_API_KEY;
    const totalElement = document.querySelector("#cart-total");
    const inlineCheckout = new InlineCheckout({
      apiKey: apiKey,
      totalElementId: totalElement,
      returnUrl: window.location.href,
      cb: tonderResponse,
      items,
    });
    inlineCheckout.injectCheckout();
    return () => inlineCheckout.removeCheckout()
  }, [])

  return (
    <div>
      <div>
        <div className="w-full min-h-screen flex my-[100px] mx-[30px] md:mx-[100px]">
          <div className="flex flex-col lg:flex-row gap-x-6">
            <div className="">
              {cart.map((cartItem) => (
                <CartCard key={cartItem.id} item={cartItem} />
              ))}
            </div>

            {cart.length === 0 ? (
              <div className="min-w-[320px] md:min-w-[1280px] md:max-h-[100px] flex justify-center">
                <div className="flex flex-col justify-around gap-y-4 md:gap-y-10">
                  <div className="">
                    <h1 className="text-4xl dark:text-white md:text-6xl font-semibold">
                      Cart is Empty !!
                    </h1>
                  </div>
                  <div className="flex justify-center">
                    <button className="bg-[#2a2a2a] w-[200px] text-white p-4 rounded-md cursor-pointer hover:bg-black">
                      <Link to="/explore">Shop Now</Link>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-[40px] w-[300px] md:w-[600px] p-4 flex flex-col">
                <div>
                  <h1 className="text-xl md:text-4xl font-bold text-slate-300 hover:text-slate-500">
                    TOTAL ITEMS : {cart.length}
                  </h1>
                  <h1 className="text-xl dark:text-white md:text-5xl font-bold text-slate-500">
                    TOTAL PRICE : <span id="cart-total">{total}</span>
                  </h1>
                </div>
                <div style={{ ...checkoutStyle }} id="tonder-checkout"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
