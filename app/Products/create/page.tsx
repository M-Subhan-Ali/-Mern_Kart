"use client";

import { useEffect, useState } from "react";
import ProductForm from "../../../components/ProductForm";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
    createProduct,
    resetProductError,
    resetProductMessage
} from "../../../redux/features/productSlice";

const Create_Products = () => {
    const dispatch = useAppDispatch();

    const {
        loading,
        error,
        message
    } = useAppSelector((state) => state.product);

    useEffect(() => {
        if (error) {
            alert(`❌ Error: ${error}`);
            dispatch(resetProductError());
        }

        if (message) {
            alert(`✅ Success: ${message}`);

            dispatch(resetProductMessage());
        }
    }, [error, message, dispatch]);

    const handleCreateSubmit = async (data: any) => {
        try {
            await dispatch(createProduct(data)).unwrap();


        } catch (err) {
            throw err;
        }
    };

    return (
        <div className="pt-[100px] min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Create Product
                </h2>

                <ProductForm
                    onSubmit={handleCreateSubmit}
                    loading={loading}
                    submitButtonText="Create Product"
                />

            </div>
        </div>
    );
};

export default Create_Products;