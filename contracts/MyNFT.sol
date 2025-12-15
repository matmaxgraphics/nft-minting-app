// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenId;
    uint256 public mintPrice = 0.01 ether;

    mapping(bytes32 => bool) private mintedURIs;

    constructor(address owner)
        ERC721("MyNFT", "MNFT")
        Ownable(owner)
    {}

    function mint(address to, string memory uri)
        public
        payable
        returns (uint256)
    {
        require(msg.value >= mintPrice, "Insufficient ETH");

        bytes32 uriHash = keccak256(abi.encodePacked(uri));
        require(!mintedURIs[uriHash], "Metadata already minted");

        uint256 id = _tokenId++;
        mintedURIs[uriHash] = true;

        _safeMint(to, id);
        _setTokenURI(id, uri);

        return id;
    }

    // Optional: owner can update mint price
    function setMintPrice(uint256 newPrice) external onlyOwner {
        mintPrice = newPrice;
    }

    // Required overrides
    function tokenURI(uint256 id)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(id);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
