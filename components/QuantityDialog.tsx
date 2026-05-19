"use client";

import { useState } from "react";

type Props = {
  productName: string;
  price: number;
  imageUrl?: string;
  onConfirm: (quantity: number) => void;
  onClose: () => void;
};

export default function QuantityDialog({ productName, price, imageUrl, onConfirm, onClose }: Props) {
  const [qty, setQty] = useState(1);

  function decrease() {
    if (qty > 1) setQty(qty - 1);
  }

  function increase() {
    if (qty < 99) setQty(qty + 1);
  }

  function handleConfirm() {
    onConfirm(qty);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
      onClick={onClose}
    >
      <div
        className="flex flex-col gap-5 p-8 w-full max-w-sm mx-4"
        style={{
          backgroundColor: "var(--bg-main)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            style={{ color: "var(--text-secondary)" }}
            className="hover:opacity-60 transition-opacity text-lg"
          >
            ✕
          </button>
        </div>

        {/* Product image */}
        <div
          style={{ backgroundColor: "var(--surface)", borderRadius: "12px" }}
          className="w-full h-48 flex items-center justify-center overflow-hidden"
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={productName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-5xl">✦</span>
          )}
        </div>

        {/* Product name + price */}
        <div className="flex items-center justify-between">
          <p style={{ color: "var(--text-primary)" }} className="font-semibold text-base">
            {productName}
          </p>
          <p style={{ color: "var(--text-secondary)" }} className="text-sm">
            ${price.toFixed(2)} each
          </p>
        </div>

        {/* Quantity picker */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={decrease}
            style={{
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
            }}
            className="flex items-center justify-center text-lg hover:opacity-60 transition-opacity"
          >
            −
          </button>

          <span
            style={{ color: "var(--text-primary)", minWidth: "40px" }}
            className="text-2xl font-semibold text-center"
          >
            {qty}
          </span>

          <button
            onClick={increase}
            style={{
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
            }}
            className="flex items-center justify-center text-lg hover:opacity-60 transition-opacity"
          >
            +
          </button>
        </div>

        {/* Total price */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{
            backgroundColor: "var(--surface)",
            borderRadius: "12px",
            border: "1px solid var(--border)",
          }}
        >
          <span style={{ color: "var(--text-secondary)" }} className="text-sm">Total</span>
          <span style={{ color: "var(--text-primary)" }} className="font-semibold">
            ${(price * qty).toFixed(2)}
          </span>
        </div>

        {/* Confirm button */}
        <button
          onClick={handleConfirm}
          style={{ backgroundColor: "var(--text-primary)", color: "var(--bg-main)" }}
          className="w-full py-3 rounded-full text-sm font-semibold hover:opacity-80 transition-opacity"
        >
          Add {qty} to Cart
        </button>
      </div>
    </div>
  );
}
