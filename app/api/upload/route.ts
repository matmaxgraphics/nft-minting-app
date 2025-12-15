import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();

  const file = formData.get("file") as File | null;
  const name = formData.get("name") as string | null;
  const description = formData.get("description") as string | null;

  if (!file) {
    return NextResponse.json(
      { error: "No image provided" },
      { status: 400 }
    );
  }

  // 1. Upload image to Pinata
  const imageForm = new FormData();
  imageForm.append("file", file);

  const imageRes = await fetch(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: imageForm,
    }
  );

  if (!imageRes.ok) {
    return NextResponse.json(
      { error: "Image upload failed" },
      { status: 500 }
    );
  }

  const imageJson = await imageRes.json();

  // 2. Create metadata
  const metadata = {
    name,
    description,
    image: `ipfs://${imageJson.IpfsHash}`,
  };

  // 3. Upload metadata
  const metaRes = await fetch(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(metadata),
    }
  );

  if (!metaRes.ok) {
    return NextResponse.json(
      { error: "Metadata upload failed" },
      { status: 500 }
    );
  }

  const metaJson = await metaRes.json();

  return NextResponse.json({
    metadataUri: `ipfs://${metaJson.IpfsHash}`,
  });
}
