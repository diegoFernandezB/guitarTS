import { useState, useEffect, useMemo } from "react"
import {db} from '../data/db'
import type { Guitar, CartItem } from '../types'

export const useCart = ()  => {
    const initialCart = () : CartItem[] => {
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
    
    function addToCard(item : Guitar){
        const itemExists = cart.findIndex(guitar=>guitar.id === item.id)
        if(itemExists >= 0){
          if(cart[itemExists].quantity >= MAX_ITEMS)return
          const updateCart = [...cart]
          updateCart[itemExists].quantity++
          setCart(updateCart)
        }else{
          const newItem : CartItem = {...item, quantity : 1} 
          setCart([...cart, newItem])
        }
    }
    
    function removeFromCart(id: Guitar['id']){
        setCart(prevCart=> prevCart.filter(guitar => guitar.id !== id))
    }
    
    function increaseQuantity(id: Guitar['id']){
        console.log("incrementando", id)
        const updateCart = cart.map(item =>{
        if (item.id === id && item.quantity < MAX_ITEMS){
            return {...item, quantity: item.quantity + 1}//toma los otros componentes de carrito y quantity lo actualiza
        }
        return item //toma los otros componentes de carrito
        })
        setCart(updateCart) 
    }
    
    function decreaseQuantity(id: Guitar['id']){
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