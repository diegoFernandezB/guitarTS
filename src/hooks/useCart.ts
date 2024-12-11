import { useState, useEffect, useMemo } from "react"
import {db} from '../data/db'

export const useCart = () => {
    const initialCart = () => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart? JSON.parse(localStorageCart) : []
    }
    
    const [data] = useState(db)
    const [cart, setCart] = useState(initialCart)
    
    const MAX_ITEMS = 4
    const MIN_ITEMS = 1
    
    useEffect(()=>{
        localStorage.setItem('cart', JSON.stringify(cart))
    },[cart] )
    
    function addToCard(item){
        const itemExists = cart.findIndex(guitar=>guitar.id === item.id)
        if(itemExists >= 0){
          if(cart[itemExists].quantity >= MAX_ITEMS)return
          const updateCart = [...cart]
          updateCart[itemExists].quantity++
          setCart(updateCart)
        }else{
          item.quantity = 1 
          setCart([...cart, item])
        }
    }
    
    function removeFromCart(id){
        setCart(prevCart=> prevCart.filter(guitar => guitar.id !== id))
    }
    
    function increaseQuantity(id){
        console.log("incrementando", id)
        const updateCart = cart.map(item =>{
        if (item.id === id && item.quantity < MAX_ITEMS){
            return {...item, quantity: item.quantity + 1}//toma los otros componentes de carrito y quantity lo actualiza
        }
        return item //toma los otros componentes de carrito
        })
        setCart(updateCart) 
    }
    
    function decreaseQuantity(id){
        const updateCart = cart.map(item =>{
          if(item.id === id && item.quantity > MIN_ITEMS){
            return{
              ...item,
              quantity: item.quantity - 1}    
            }
        return item
        })
        setCart(updateCart)
    }
    
    function clearCart(){
        setCart([])
    }

    const isEmpty = useMemo(() => cart.length === 0,[cart])
    const cartTotaL = useMemo(() => cart.reduce((total, item) => total + (item.quantity*item.price),0),[cart])


    return{
        data,
        cart,
        addToCard,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        isEmpty,
        cartTotaL
    }

}