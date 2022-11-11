// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import './Base64.sol';


contract Web3Imgur is ERC721, Ownable {
    using SafeMath for uint256;
    // Event to emit when a Image/NFT is created.
    event NewImageEvent(
        string title,
        string description,
        string imageURL
    );

    // New Image struct.
    struct NewImage {
        string title;
        string description;
        string imageURL;
    }

    // Maps a token ID to a image.
    mapping (uint256 => NewImage) public NewImageForToken;
    uint256 internal currentTokenId;

    constructor() ERC721("Web3Imgur", "IMG") {}

    function mintImg(string memory title, string memory description, string memory imageURL) public payable {
        // Make sure value is more than 0.
        require(msg.value == 100000000000000000, "0.1 MATIC to mint");
     
        // Get current Token ID.
        currentTokenId++;

        _safeMint(msg.sender, currentTokenId);
          
        // Add the image to the tokenId mapping for the NFT.
        NewImageForToken[currentTokenId] = NewImage(
            title,
            description,
            imageURL
        );

        // Emit a log event when a new image is created. 
        emit NewImageEvent(
            title,
            description,
            imageURL
        );
    }
   
    /**
    * @dev Overrides the tokenURI function to return the submitted Imgur post for a tokenId.
    * @param tokenId the token ID being requested.
    */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        // get the image struct for _tokenId.
        NewImage memory currentNewImage = NewImageForToken[tokenId];
        require(_exists(tokenId));
        return
            string(
                abi.encodePacked(
                    'data:application/json;base64,',
                    Base64.encode(
                        bytes(
                            string(
                                abi.encodePacked(
                                    '{"name": "',
                                    currentNewImage.title,
                                    '", "description": "',
                                    currentNewImage.description,
                                    '", "image": "',
                                    currentNewImage.imageURL,
                                    '"}'
                                )
                            )
                        )
                    )
                )
            );
    }

    function withdraw() public payable onlyOwner {
        require(payable(msg.sender).send(address(this).balance));
    }
    
}
