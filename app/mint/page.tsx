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
  const [mintedNFT, setMintedNFT] = useState<any>(null);

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

      const tx = await nft.mint(await signer.getAddress(), metadataUri, { value: parseEther("0.01") });

      setStatus("Waiting for confirmation...");

      const receipt = await tx.wait();

      const event = receipt.logs
        .map((log: any) => {
          try {
            return nft.interface.parseLog(log);
          } catch {
            return null;
          }
        })
        .find((e: any) => e?.name === "Transfer");

      const tokenId = event?.args?.tokenId.toString();

      setMintedNFT({
        tokenId,
        image: metadataUri.replace(
          "ipfs://",
          "https://gateway.pinata.cloud/ipfs/"
        ),
        name,
        description,
      });

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

      <div style={{ marginTop: 10 }}>
        <input
          type="text"
          placeholder="NFT name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2.5 w-full"
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <textarea
          placeholder="NFT description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2.5 w-full"
        />
      </div>

      <button
        onClick={handleMint}
        className="w-full bg-blue-500 p-4 mt-4 font-bold cursor-pointer"
      >
        Mint
      </button>

      {status && <p style={{ marginTop: 15 }}>{status}</p>}

      {mintedNFT && (
        <div style={{ marginTop: 20 }}>
          <h3>Minted NFT</h3>
          <img
            src={mintedNFT.image}
            style={{ width: "100%", border: "1px solid #ccc" }}
          />
          <p>
            <strong>Name:</strong> {mintedNFT.name}
          </p>
          <p>
            <strong>Description:</strong> {mintedNFT.description}
          </p>
          <p>
            <strong>Token ID:</strong> {mintedNFT.tokenId}
          </p>
        </div>
      )}
    </div>
  );
}
