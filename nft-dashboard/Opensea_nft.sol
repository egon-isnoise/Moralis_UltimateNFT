// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// importing ERC115 token contract from OpenZeppelin
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/ERC1155.sol";
// importing Ownable contract from OpenZeppelin
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

// the contracts also need to be "injected" here
contract NFTContract is ERC1155, Ownable {

    uint256 public constant ARTWORK = 0;
    uint256 public constant PHOTO = 1;

    // this contructor just creates the 2 NFTs defined up here
    constructor() ERC1155("https://gsi6a60yqsn0.usemoralis.com/{id}.json") {
        _mint(msg.sender, ARTWORK, 1, "");
        _mint(msg.sender, PHOTO, 2, "");
    }
    
    // this function takes from both the imported contracts, from one takes the _mint function and
    // from the second it takes the OnlyOwner modifier
    function mint(address account, uint256 id, uint256 amount) public onlyOwner {
        _mint(account, id, amount, "");
    }

    function burn(address account, uint256 id, uint256 amount) public {
        // this is to make sure that the owner of the token is the one that wants to burn
        require(msg.sender == account);
        _burn(account, id, amount);
    } 
}



// 0x6331265613358390adc2883a8c66dbc4c6fc188d  contract address on rinkeby.etherscan.io