// lib/slices/createProductSlice.ts

import { StateCreator } from "zustand";

export interface Product {
    category: {
        id: number;
        image: string;
        name: string;
    };
    description: string;
    id: number;
    images: string[];
    price: number;
    title: string;
    quantity?: number;
}

export interface ProductSlice {
    products: Product[];
    fetchProducts: () => void;
}

export const createProductSlice: StateCreator<ProductSlice> = (set) => ({
    products: [],
    fetchProducts: async () => {
        const res = await fetch('https://api.escuelajs.co/api/v1/products?offset=0&limit=20')
        set({ products: await res.json() })
    },
})