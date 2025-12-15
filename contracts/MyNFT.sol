// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenId;

    constructor(address owner)
        ERC721("MyNFT", "MNFT")
        Ownable(owner)
    {}

    function mint(address to, string memory uri)
        public
        payable
        returns (uint256)
    {
        uint256 id = _tokenId++;
        _safeMint(to, id);
        _setTokenURI(id, uri);
        return id;
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
