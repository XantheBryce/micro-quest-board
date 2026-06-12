// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MicroQuestBoard {
    mapping(address => uint256) public userStarts;
    mapping(address => uint256) public userProgresses;
    mapping(address => uint256) public userDones;

    uint256 public totalStarts;
    uint256 public totalProgresses;
    uint256 public totalDones;

    event StartMarked(address indexed user, uint256 userStarts, uint256 totalStarts);
    event ProgressMarked(address indexed user, uint256 userProgresses, uint256 totalProgresses);
    event DoneMarked(address indexed user, uint256 userDones, uint256 totalDones);

    function markStart() external {
        unchecked {
            userStarts[msg.sender] += 1;
            totalStarts += 1;
        }
        emit StartMarked(msg.sender, userStarts[msg.sender], totalStarts);
    }

    function markProgress() external {
        unchecked {
            userProgresses[msg.sender] += 1;
            totalProgresses += 1;
        }
        emit ProgressMarked(msg.sender, userProgresses[msg.sender], totalProgresses);
    }

    function markDone() external {
        unchecked {
            userDones[msg.sender] += 1;
            totalDones += 1;
        }
        emit DoneMarked(msg.sender, userDones[msg.sender], totalDones);
    }
}
