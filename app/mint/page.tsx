"use client";
import { useState } from "react";
import { BrowserProvider, Contract, parseEther } from "ethers";
import { CONTRACT_ADDRESS } from "@/lib/contract";
import abi from "@/abi/MyNFT.json";

export default function MintPage() {
  const [image, setImage] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  //   const handleMint = async () => {
  //   if (!image || !name || !description) {
  //     return setStatus("All fields are required");
  //   }

  //   setStatus("Uploading image...");

  //   const form = new FormData();
  //   form.append("file", image);
  //   form.append("name", name);
  //   form.append("description", description);

  //   const res = await fetch("/api/upload", {
  //     method: "POST",
  //     body: form,
  //   });

  //   const json = await res.json();

  //   if (!json.metadataUri) {
  //     return setStatus("Upload failed");
  //   }

  //   setStatus("Metadata uploaded successfully!");
  //   console.log("Metadata URI:", json.metadataUri);
  // };

  const handleMint = async () => {
    if (!image || !name || !description) {
      return setStatus("All fields are required");
    }

    if (!(window as any).ethereum) {
      return setStatus("MetaMask not found");
    }

    try {
      // 1. Upload to IPFS
      setStatus("Uploading to IPFS...");

      const form = new FormData();
      form.append("file", image);
      form.append("name", name);
      form.append("description", description);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });

      const { metadataUri } = await uploadRes.json();

      // 2. Connect wallet
      setStatus("Connecting wallet...");

      const provider = new BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();

      // 3. Mint NFT
      setStatus("Minting NFT on-chain...");

      const nft = new Contract(CONTRACT_ADDRESS, abi.abi, signer);

      const tx = await nft.mint(await signer.getAddress(), metadataUri);

      setStatus("Waiting for confirmation...");

      const receipt = await tx.wait();

      setStatus(`NFT Minted! Tx hash: ${receipt.hash}`);
    } catch (err: any) {
      console.error(err);
      setStatus("Mint failed");
    }
  };

  return (
    <div
      style={{ maxWidth: 400, margin: "40px auto", fontFamily: "sans-serif" }}
    >
      <h2 className="text-xl font-bold mb-4">Mint NFT</h2>

      {/* Image Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
      />

      {image && (
        <div style={{ marginTop: 10 }}>
          <img
            src={URL.createObjectURL(image)}
            alt="preview"
            style={{ width: "100%", border: "1px solid #ccc" }}
          />
        </div>
      )}

      {/* Name */}
      <div style={{ marginTop: 10 }}>
        <input
          type="text"
          placeholder="NFT name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2.5 w-full"
        />
      </div>

      {/* Description */}
      <div style={{ marginTop: 10 }}>
        <textarea
          placeholder="NFT description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2.5 w-full"
        />
      </div>

      {/* Mint Button */}
      <button
        onClick={handleMint}
        className="w-full bg-blue-500 p-4 mt-4 font-bold cursor-pointer"
      >
        Mint
      </button>

      {/* Status */}
      {status && <p style={{ marginTop: 15 }}>{status}</p>}
    </div>
  );
}
