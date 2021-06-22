// SPDX-License-Identifier: MIT
pragma solidity 0.6.9;

import "./ERC721Mintable.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
interface VerifierInterface {
    function verifyTx(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input
    ) external view returns (bool r);
}

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is CustomERC721Token {
    VerifierInterface private verifierInstance;

    constructor(address _verifierAddress) public {
        verifierInstance = VerifierInterface(_verifierAddress);
    }

    // TODO define a solutions struct that can hold an index & an address
    struct solution {
        bytes32 _index;
        address _address;
        bool _exists;
    }

    // TODO define an array of the above struct
    solution[] solutions;

    function getSolution(uint256 index)
        external
        view
        returns (
            bytes32,
            address,
            bool
        )
    {
        solution memory sol = solutions[index];
        return (sol._index, sol._address, sol._exists);
    }

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => solution) uniqueSolutions;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(address addr);

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(
        address to,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input
    ) public {
        require(
            verifierInstance.verifyTx(a, b, c, input),
            "the solution not pass verified"
        );
        bytes32 solutionKey = keccak256(abi.encodePacked(to, a, b, c, input));
        require(
            uniqueSolutions[solutionKey]._exists == false,
            "solution should be unique"
        );
        solutions.push(solution(solutionKey, to, true));
        uniqueSolutions[solutionKey] = solution(solutionKey, to, true);
        emit SolutionAdded(msg.sender);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mintNewNFT(
        address to,
        uint256 tokenId,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input
    ) public {
        addSolution(to, a, b, c, input);
        mint(to, tokenId);
    }
}
