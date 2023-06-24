import React, { useEffect, useState } from 'react';
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import {ethers} from "ethers";
//import contractAbi from './utils/contractABI.json';
import polygonLogo from './assets/polygonlogo.png';
import ethLogo from './assets/ethlogo.png';
import veinlogo from './assets/Veinfi-header.png'
import { networks } from './utils/networks';

// Constants
const TWITTER_HANDLE = 'blackluv10';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const tld = '.learnweb3dao';
const CONTRACT_ADDRESS = '0x9DE5c13B4dF99471001D859386d03d0fead889E4';//change to stake address
const CONTRACT_ADDRESS1 = '0xC4A70668DeC1Da9862d9d20bf67d1eF4eE182450';//change to token address
const contractAbi1 = [{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"contract ILBFactory","name":"lbFactory","type":"address"},{"internalType":"uint24","name":"activeId","type":"uint24"},{"internalType":"uint16","name":"binStep","type":"uint16"},{"internalType":"uint256","name":"tokenPerBin","type":"uint256"},{"internalType":"address","name":"_treasury","type":"address"},{"internalType":"address","name":"_controller","type":"address"},{"internalType":"address","name":"_sVault","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"AlreadyBorrowed","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"currentAllowance","type":"uint256"},{"internalType":"uint256","name":"requestedDecrease","type":"uint256"}],"name":"ERC20FailedDecreaseAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"inputs":[],"name":"HardResetNotEnabled","type":"error"},{"inputs":[],"name":"MathOverflowedMulDiv","type":"error"},{"inputs":[],"name":"NoActiveBorrows","type":"error"},{"inputs":[],"name":"NotEnoughEthToBorrow","type":"error"},{"inputs":[],"name":"PackedUint128Math__SubUnderflow","type":"error"},{"inputs":[{"internalType":"uint256","name":"x","type":"uint256"},{"internalType":"int256","name":"y","type":"int256"}],"name":"Uint128x128Math__PowUnderflow","type":"error"},{"inputs":[],"name":"Uint256x256Math__MulDivOverflow","type":"error"},{"inputs":[],"name":"Uint256x256Math__MulShiftOverflow","type":"error"},{"inputs":[],"name":"Unauthorized","type":"error"},{"inputs":[],"name":"VaultAlreadySet","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"ethAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"sVeinAmount","type":"uint256"}],"name":"Borrow","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"excludedStatus","type":"uint256"}],"name":"ExcludedFromTaxSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newFloorId","type":"uint256"}],"name":"FloorRaised","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[],"name":"RebalancePaused","type":"event"},{"anonymous":false,"inputs":[],"name":"RebalanceUnpaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newRoofId","type":"uint256"}],"name":"RoofRaised","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"secondTaxRecipient","type":"address"}],"name":"SecondTaxRecipientSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"shareForSecondTaxRecipient","type":"uint256"}],"name":"ShareForSecondTaxRecipientSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"shareForThirdTaxRecipient","type":"uint256"}],"name":"ShareForThirdTaxRecipientSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"taxRate","type":"uint256"}],"name":"TaxRateSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"taxRecipient","type":"address"}],"name":"TaxRecipientSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"thirdTaxRecipient","type":"address"}],"name":"ThirdTaxRecipientSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"BUY_BURN_FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"BUY_STAKER_FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"INITIAL_TOTAL_SUPPLY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_NUM_BINS","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"SELL_BURN_FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"SELL_STAKER_FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TREASURY_FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountEth_","type":"uint256"}],"name":"_deployFloorLiquidity","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"binStep","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"ethAmountOut_","type":"uint256"}],"name":"borrow","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"borrowedEth","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"borrowedEthlimit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"calculateNewFloorId","outputs":[{"internalType":"uint24","name":"","type":"uint24"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_strategy","type":"address"}],"name":"changestrategy","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"controller","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"requestedDecrease","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"deploytoGMX","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"excludedFromTax","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"floorPerBin","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"floorPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"gmxethamount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"sVeinAmount_","type":"uint256"}],"name":"maxBorrowable","outputs":[{"internalType":"uint256","name":"untaxed","type":"uint256"},{"internalType":"uint256","name":"taxed","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pair","outputs":[{"internalType":"contract ILBPair","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pauseRebalance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint24","name":"nbBins","type":"uint24"}],"name":"raiseRoof","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"range","outputs":[{"internalType":"uint24","name":"","type":"uint24"},{"internalType":"uint24","name":"","type":"uint24"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rebalanceFloor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"rebalancePaused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"repayAndWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"repayfromstrategy","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"restrategize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"router","outputs":[{"internalType":"contract LBRouter","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"sVein","outputs":[{"internalType":"contract IStakedVEIN","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"sVeinDeposited","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"secondTaxRecipient","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"excludedStatus","type":"uint256"}],"name":"setExcludedFromTax","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newSecondTaxRecipient","type":"address"}],"name":"setSecondTaxRecipient","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newShareForSecondRecipient","type":"uint256"}],"name":"setShareForSecondTaxRecipient","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newShareForThirdRecipient","type":"uint256"}],"name":"setShareForThirdTaxRecipient","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newTaxRate","type":"uint256"}],"name":"setTaxRate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newTaxRecipient","type":"address"}],"name":"setTaxRecipient","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newThirdTaxRecipient","type":"address"}],"name":"setThirdTaxRecipient","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"vault_","type":"address"}],"name":"setVault","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"vault_","type":"address"}],"name":"setWETHVault","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_cap","type":"uint256"}],"name":"setstrategycap","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"shareForSecondTaxRecipient","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"shareForThirdTaxRecipient","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"strat","outputs":[{"internalType":"contract IStrategy","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"strategy","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"strategyborrow","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"strategyborrowcap","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"taxRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"taxRecipient","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"thirdTaxRecipient","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenY","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokensInPair","outputs":[{"internalType":"uint256","name":"amountFloor","type":"uint256"},{"internalType":"uint256","name":"amountY","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalBorrowedEth","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"treasury","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"unpauseRebalance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"vault","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"weth","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"wethvault","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]
const contractAbi = [{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"address","name":"_stakingToken","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"oldOwner","type":"address"},{"indexed":false,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnerChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnerNominated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"isPaused","type":"bool"}],"name":"PauseChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Recovered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"reward","type":"uint256"}],"name":"RewardAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"rewardsToken","type":"address"},{"indexed":false,"internalType":"uint256","name":"reward","type":"uint256"}],"name":"RewardPaid","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"newDuration","type":"uint256"}],"name":"RewardsDurationUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Staked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdrawn","type":"event"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_rewardsToken","type":"address"},{"internalType":"address","name":"_rewardsDistributor","type":"address"},{"internalType":"uint256","name":"_rewardsDuration","type":"uint256"}],"name":"addReward","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_rewardsToken","type":"address"},{"internalType":"address","name":"_rewardsDistributor","type":"address"},{"internalType":"uint256","name":"_rewardsDuration","type":"uint256"}],"name":"addReward_","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"controller","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"address","name":"_rewardsToken","type":"address"}],"name":"earned","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"exit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"getReward","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"_rewardsToken","type":"address"}],"name":"getRewardForDuration","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastPauseTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"_rewardsToken","type":"address"}],"name":"lastTimeRewardApplicable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"nominateNewOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"nominatedOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_rewardsToken","type":"address"},{"internalType":"uint256","name":"reward","type":"uint256"}],"name":"notifyRewardAmount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"rewardData","outputs":[{"internalType":"address","name":"rewardsDistributor","type":"address"},{"internalType":"uint256","name":"rewardsDuration","type":"uint256"},{"internalType":"uint256","name":"periodFinish","type":"uint256"},{"internalType":"uint256","name":"rewardRate","type":"uint256"},{"internalType":"uint256","name":"lastUpdateTime","type":"uint256"},{"internalType":"uint256","name":"rewardPerTokenStored","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"_rewardsToken","type":"address"}],"name":"rewardPerToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"rewardTokens","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"rewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"bool","name":"_paused","type":"bool"}],"name":"setPaused","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_rewardsToken","type":"address"},{"internalType":"address","name":"_rewardsDistributor","type":"address"}],"name":"setRewardsDistributor","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_rewardsToken","type":"address"},{"internalType":"uint256","name":"_rewardsDuration","type":"uint256"}],"name":"setRewardsDuration","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"stake","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"stakingToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"userRewardPerTokenPaid","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]

const OpenSeaLink = (props) => {
	return (
		<a classNameName="link" href={`https://testnets.opensea.io/assets/mumbai/${props.contract}/${props.mintId}`} target="_blank" rel="noopener noreferrer">
			<p classNameName="underlined">{' '}{props.linkName}{' '}</p>
		</a>
	);
}

const App = () => {

	const [currentAccount, setCurrentAccount] = useState('');
	// Add some state data propertie
	const [domain, setDomain] = useState('');
	const [record, setRecord] = useState('');
	const [network, setNetwork] = useState('');
	const [editing, setEditing] = useState(false);
	const [mints, setMints] = useState([]);
	const [loading, setLoading] = useState(false);
	const [Price, setPrice] = useState('');
	const [Burned, setBurned] = useState('');
	const[Earned, setEarned] = useState('');
	const [value, setValue] = useState('');
	console.log(value);
	const default1 = '1000000';

	const connectWallet = async () => {
		try {
			const { ethereum } = window;

			if (!ethereum) {
				alert("Get MetaMask -> https://metamask.io/");
				return;
			}

			// Fancy method to request access to account.
			const accounts = await ethereum.request({ method: "eth_requestAccounts" });
		
			// Boom! This should print out public address once we authorize Metamask.
			console.log("Connected", accounts[0]);
			setCurrentAccount(accounts[0]);
		} catch (error) {
			console.log(error)
		}
	};

	const switchNetwork = async () => {
		if (window.ethereum) {
			try {
				// Try to switch to the Mumbai testnet
				await window.ethereum.request({
					method: 'wallet_switchEthereumChain',
					params: [{ chainId: '0x13881' }], // Check networks.js for hexadecimal network ids
				});
			} catch (error) {
				// This error code means that the chain we want has not been added to MetaMask
				// In this case we ask the user to add it to their MetaMask
				if (error.code === 4902) {
					try {
						await window.ethereum.request({
							method: 'wallet_addEthereumChain',
							params: [
								{	
									chainId: '0x13881',
									chainName: 'Polygon Mumbai Testnet',
									rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
									nativeCurrency: {
											name: "Mumbai Matic",
											symbol: "MATIC",
											decimals: 18
									},
									blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
								},
							],
						});
					} catch (error) {
						console.log(error);
					}
				}
				console.log(error);
			}
		} else {
			// If window.ethereum is not found then MetaMask is not installed
			alert('MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html');
		} 
	};

	const checkIfWalletIsConnected = async () => {
		// First make sure we have access to window.ethereum
		const { ethereum } = window;
	
		if (!ethereum) {
			console.log("Make sure you have MetaMask!");
			return;
		} else {
			console.log("We have the ethereum object", ethereum);
		}

		// Check if we're authorized to access the user's wallet
		const accounts = await ethereum.request({ method: 'eth_accounts' });

		// Users can have multiple authorized accounts, we grab the first one if its there!
		if (accounts.length !== 0) {
			const account = accounts[0];
			console.log('Found an authorized account:', account);
			setCurrentAccount(account);
		} else {
			console.log('No authorized account found');
		}

		// This is the new part, we check the user's network chain ID
		const chainId = await ethereum.request({ method: 'eth_chainId' });
		setNetwork(networks[chainId]);
		
		ethereum.on('chainChanged', handleChainChanged);
				
		// Reload the page when they change networks
		function handleChainChanged(_chainId) {
		window.location.reload();
		}
	};

	const mintDomain = async () => {
		// Don't run if the domain is empty
		if (!domain) { return }
		// Alert the user if the domain is too short
		if (domain.length < 3) {
			alert('Domain must be at least 3 characters long');
			return;
		}
		// Calculate price based on length of domain (change this to match your contract)	
		// 3 chars = 0.5 MATIC, 4 chars = 0.3 MATIC, 5 or more = 0.1 MATIC
		const price = domain.length === 3 ? '0.3' : domain.length === 5 ? '0.5' : '0.2';
		console.log("Minting domain", domain, "with price", price);
	  try {
		const { ethereum } = window;
		if (ethereum) {
		  const provider = new ethers.providers.Web3Provider(ethereum);
		  const signer = provider.getSigner();
		  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
	
				console.log("Going to pop wallet now to pay gas...")
		  let tx = await contract.create(domain, {value: ethers.utils.parseEther(price)});
		  // Wait for the transaction to be mined
				const receipt = await tx.wait();
	
				// Check if the transaction was successfully completed
				if (receipt.status === 1) {
					console.log("Domain minted! https://mumbai.polygonscan.com/tx/"+tx.hash);
					
					// Set the record for the domain
					tx = await contract.setDetails (domain, record);
					await tx.wait();
	
					console.log("Record set! https://mumbai.polygonscan.com/tx/"+tx.hash);
					// Call fetchMints after 2 seconds
				    setTimeout(() => {
					    fetchMints();
				    }, 5000);
					
					setRecord('');
					setDomain('');
				}
				else {
					alert("Transaction failed! Please try again");
				}
		}
	  }
	  catch(error){
		console.log(error);
	  }
	};

	const Stake = async () => {
		// Don't run if the domain is empty
		/*if (!domain) { return }
		// Alert the user if the domain is too short
		if (domain.length < 3) {
			alert('Domain must be at least 3 characters long');
			return;
		}
		// Calculate price based on length of domain (change this to match your contract)	
		// 3 chars = 0.5 MATIC, 4 chars = 0.3 MATIC, 5 or more = 0.1 MATIC
		const price = domain.length === 3 ? '0.3' : domain.length === 5 ? '0.5' : '0.2';
		console.log("Minting domain", domain, "with price", price);*/
	  try {
		const { ethereum } = window;
		if (ethereum) {
		  const provider = new ethers.providers.Web3Provider(ethereum);
		  const signer = provider.getSigner();
		  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer);
		  let amount = ethers.utils.parseUnits(value.toString(), "ether");
	
				console.log("Going to pop wallet now to pay gas...")


		  let tx = await contract.stake(amount);
		  // Wait for the transaction to be mined
				const receipt = await tx.wait();
	
				// Check if the transaction was successfully completed
				if (receipt.status === 1) {
					console.log("Domain minted! https://mumbai.polygonscan.com/tx/"+tx.hash);
					
					// Set the record for the domain
					tx = await contract.setDetails (domain, record);
					await tx.wait();
	
					console.log("Record set! https://mumbai.polygonscan.com/tx/"+tx.hash);
					// Call fetchMints after 2 seconds
				    setTimeout(() => {
					    fetchMints();
				    }, 5000);
					
					setRecord('');
					setDomain('');
				}
				else {
					alert("Transaction failed! Please try again");
				}
		}
	  }
	  catch(error){
		console.log(error);
	  }
	};

	const Stake1 = async () => {
		if (!record || !domain) { return }
		setLoading(true);
		console.log("Updating domain", domain, "with record", record);
		  try {
			const { ethereum } = window;
			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer);
	
				let tx = await contract.stake(value);
				await tx.wait();
	
				fetchMints();
				setRecord('');
				setDomain('');
			}
		  } catch(error) {
			console.log(error);
		  }
		setLoading(false);
	};

	
	const Unstake = async () => {
		  try {
			const { ethereum } = window;
			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer);
				let amount = ethers.utils.parseUnits(value.toString(), "ether");
	
				let tx = await contract.withdraw(amount);
				await tx.wait();
				console.log("Record set https://mumbai.polygonscan.com/tx/"+tx.hash);
	
				fetchMints();
				setRecord('');
				setDomain('');
			}
		  } catch(error) {
			console.log(error);
		  }
		setLoading(false);
	};

	
	const Approve = async () => {
		//if (!record || !domain) { return }
		//setLoading(true);
		console.log(currentAccount)
		  try {
			const { ethereum } = window;
			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();

					const contract = new ethers.Contract(CONTRACT_ADDRESS1, contractAbi1, signer);
	
					console.log("Going to pop wallet now to pay gas...")
					let amount = ethers.utils.parseUnits(default1.toString(), "ether");
			  //let tx = await contract.stake(value);
			  let tx = await contract.approve(CONTRACT_ADDRESS, amount);
			  // Wait for the transaction to be mined
					const receipt = await tx.wait();
					console.log(receipt)
				  //}
	
				//let tx = await contract.approve(CONTRACT_ADDRESS, amount);
				//await tx.wait();
				//console.log("Record set https://mumbai.polygonscan.com/tx/"+tx.hash);
	
				fetchMints();
				setRecord('');
				setDomain('');
			}
		  } catch(error) {
			console.log(error);
		  }
		setLoading(false);
	};

	const updateDomain = async () => {
		if (!record || !domain) { return }
		setLoading(true);
		console.log("Updating domain", domain, "with record", record);
		  try {
			const { ethereum } = window;
			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const contract = new ethers.Contract(CONTRACT_ADDRESS1, contractAbi1.abi, signer);
	
				let tx = await contract.approve(CONTRACT_ADDRESS, record);
				await tx.wait();
				console.log("Record set https://mumbai.polygonscan.com/tx/"+tx.hash);
	
				fetchMints();
				setRecord('');
				setDomain('');
			}
		  } catch(error) {
			console.log(error);
		  }
		setLoading(false);
	};

	const mintRecords = async () => {
		if (!record || !domain) { return }
		setLoading(true);
		console.log("Updating domain", domain, "with record", record);
		  try {
			const { ethereum } = window;
			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const contract = new ethers.Contract(CONTRACT_ADDRESS1, contractAbi1.abi, signer);
	
				let tx = await contract.approve(CONTRACT_ADDRESS, record);
				await tx.wait();
				console.log("Record set https://mumbai.polygonscan.com/tx/"+tx.hash);
	
				fetchMints();
				setRecord('');
				setDomain('');
			}
		  } catch(error) {
			console.log(error);
		  }
		setLoading(false);
	};

	const renderNotConnectedContainer = () => (
		<div classNameName="connect-wallet-container">
			<img src="https://media.giphy.com/media/3ohhwytHcusSCXXOUg/giphy.gif" alt="Ninja gif" />
			<button onClick={connectWallet} classNameName="cta-button connect-wallet-button">
				Connect Wallet
			</button>
		</div>
  	);

	// Form to enter domain name and data
	const renderInputForm = () =>{
		// If not on Polygon Mumbai Testnet, render "Please connect to Polygon Mumbai Testnet"
	    if (network !== 'Polygon Mumbai Testnet') {
		    return (
			    <div classNameName="connect-wallet-container">
					<h2>Please switch to Polygon Mumbai Testnet</h2>
				    {/* This button will call our switch network function */}
  <button classNameName='cta-button mint-button' onClick={switchNetwork}>Click here to switch</button>
			    </div>
		    );
	    }
		return (
			<div classNameName="form-container">
				<div classNameName="first-row">
				{editing ? (<input
						type="text"
						value={domain}
						placeholder='name'
						disabled={true}
						onChange={e => setDomain(e.target.value)}
					/>):(
						<input
						type="text"
						value={domain}
						placeholder='name'
						onChange={e => setDomain(e.target.value)}
						/>
					)}
					<p classNameName='tld'> {tld} </p>
				</div>

				<input
					type="text"
					value={record}
					placeholder='Set your details'
					onChange={e => setRecord(e.target.value)}
				/>

                {editing ? (
						<div classNameName="button-container">
							<button classNameName='cta-button mint-button' disabled={loading} onClick={updateDomain}>
								Set record
							</button>  
							<button classNameName='cta-button mint-button' onClick={() => {setEditing(false); setDomain('');}}>
								Cancel
							</button>  
						</div>
					) : (
						// If editing is not true, the mint button will be returned instead
						<button classNameName='cta-button mint-button' disabled={loading} onClick={mintDomain}>
							Mint
						</button>  
				)}


				<div classNameName='rules'>
                    <p>Prices & Limit</p>
	                3 letters cost 0.3 MATIC, 
	                5 letters cost 0.5 MATIC, 
	                others cost 0.2 MATIC, 
	                Limit is 10 letters
                </div>

			</div>
	   );
	};

	const fetchMints = async () => {
		try {
			const { ethereum } = window;
			if (ethereum) {
				// You know all this
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
					
				// Get all the domain names from our contract
				const names = await contract.getAllNames();
					
				// For each name, get the record and the address
				const mintRecords = await Promise.all(names.slice(0,4).map(async (name) => {
				const mintRecord = await contract.getDetails(name);
				const owner = await contract.getAddress(name);
				return {
					id: names.indexOf(name),
					name: name,
					record: mintRecord,
					owner: owner,
				};
			}));
	
			console.log("MINTS FETCHED ", mintRecords);
			setMints(mintRecords);
			}
		} catch(error){
			console.log(error);
		}
	}

	const fetchBurned = async () => {
		try {
			const { ethereum } = window;
			if (ethereum) {
				// You know all this
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const contract = new ethers.Contract(CONTRACT_ADDRESS1, contractAbi1, signer);
			
			const address1 = 0x0000000000000000000000000000000000000000;

			let tx = await contract.balanceOf(address1);
			console.log(tx)
			let newvalue = tx.toString();
			//console.log(newvalue)
			const ethvalue = ethers.utils.formatEther(newvalue)
			const ethvalue1 = Math.round(ethvalue * 1e4) / 1e4;
			console.log(ethvalue)
			//console.log("Record set https://mumbai.polygonscan.com/tx/"+tx.hash);
			setEarned(ethvalue1)
			}
		} catch(error){
			console.log(error);
		}
	}

	const fetchEarned = async () => {
		try {
			const { ethereum } = window;
			if (ethereum) {
				// You know all this
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer);
				
				const address1 = currentAccount;
	
				let tx = await contract.earned(address1, CONTRACT_ADDRESS1);
				console.log(tx)
				let newvalue = tx.toString();
				//console.log(newvalue)
				const ethvalue = ethers.utils.formatEther(newvalue)
				const ethvalue1 = Math.round(ethvalue * 1e4) / 1e4;
				console.log(ethvalue)
				//console.log("Record set https://mumbai.polygonscan.com/tx/"+tx.hash);
				setEarned(ethvalue1)
	
			//console.log("MINTS FETCHED ", mintRecords);
			//setMints(mintRecords);
			}
		} catch(error){
			console.log(error);
		}
	}
	//const url = `https://api.dexscreener.io/latest/dex/tokens/${tkn}`
	const fetchPrice = async () => {
		fetchprice(CONTRACT_ADDRESS1);
	}

	async function fetchprice(tkn){
		//const the = 'https://api.gopluslabs.io/api/v1/token_security/1?contract_addresses='
		const url = `https://api.dexscreener.io/latest/dex/tokens/${tkn}`
		//console.log(url)
		const response = await fetch(url)
		const data1 = await response.json();
		if(data1.pairs == null){
		  return null;
	  }else {
		console.log(data1.pairs[0].priceUsd)
		//const free = data1.pairs;
		//console.log(free)
		let noagg;
		//let obj = free[1];
		noagg = data1.pairs[0].priceUsd;
		/*for(let i = 0; i < free.length; i++) {
		  let obj = free[1];
		  noagg = obj.priceUsd;
		  console.log('we',obj)
		  console.log(noagg)
		  //Get price aggregate from all pools
		}*/
		let price = noagg;
		console.log('Token price present',price)
		setPrice(price);
	  }
	}

	const renderMints = () => {
		if (currentAccount && mints.length > 0) {
			return (
				<div classNameName="mint-container">
					<p classNameName="subtitle"> Recently minted domains!</p>
					<div classNameName="mint-list">
						{ mints.map((mint, index) => {
							return (
								<div classNameName="mint-item" key={index}>
									<div classNameName='mint-row'>
										<a classNameName="link" href={`https://testnets.opensea.io/assets/mumbai/${CONTRACT_ADDRESS}/${mint.id}`} target="_blank" rel="noopener noreferrer">
											<p classNameName="underlined">{' '}{mint.name}{tld}{' '}</p>
										</a>
										{/* If mint.owner is currentAccount, add an "edit" button*/}
										{ mint.owner.toLowerCase() === currentAccount.toLowerCase() ?
											<button classNameName="edit-button" onClick={() => editRecord(mint.name)}>
												<img classNameName="edit-icon" src="https://img.icons8.com/metro/26/000000/pencil.png" alt="Edit button" />
											</button>
											:
											null
										}
									</div>
						<p> {mint.record} </p>
					</div>)
					})}
				</div>
			</div>);
		}
	};
	
	// This will take us into edit mode and show us the edit buttons!
	const editRecord = (name) => {
		console.log("Editing record for", name);
		setEditing(true);
		setDomain(name);
	}

	useEffect(() => {
		checkIfWalletIsConnected();
	}, [])

	useEffect(() => {
		fetchMints();
		fetchBurned();
		fetchEarned();
		fetchPrice();
	}, [currentAccount]);

  return (
    <div className="sc-bebbde74-0 bduKqz min-safe App">
    <header id="header" className="sc-fce8f277-0 ldGPQw">
        <div className="sc-fce8f277-2 cpCyPJ">
            <img src={veinlogo} alt="Veinfi-logo" className='img1' srcset="" />
            <div className="newt">
                <a className="meme" href="#">Dashboard</a>
                <a className="meme" href="#">Docs</a>
                <a className="meme" href="#">Buy Veinfi</a>
                <a className="meme" href="#">Borrow Eth</a>
            </div>
            <div className="sc-fce8f277-4 gZAzLn">
                <div data-testid="route-container" className="sc-fce8f277-3 cNKBXc">
                </div>
            </div>
            <div className="sc-bfb53de4-0 jOhTpb">
                <button data-testid="connect-button" type="button" className="sc-ipEyDJ dyuZCv" onClick={connectWallet}>
                    <div className="sc-csuSiG dDbrev">{ currentAccount ? <p> Wallet: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)} </p> : <p> Connect </p> }</div>
                    <div className="sc-eDWCr gFNLiS">
                        <div className="sc-bqWxrE jyomvB">
                        </div>
                    </div>
                </button>
            </div>
        </div>
    </header>
    <div className="sc-bebbde74-1 etoHR main">
        <div className="sc-8df28c1f-0 sc-dc3986ff-6 jCkOVI djVTGZ ">
            <div className="thirdclass">
                <div className="logoplace">
                    <img src={veinlogo} alt="" srcset="" className="tut" />
                    <span className="text2">Interest Bearing Concentrated Liquidity</span>
                </div>
                <div className="logodescription">
                    <span className="textheader">Veinfi</span>
                    <p className="ppp"> Veinfi is a protocol with floor eth backing for each token, forked from battle tested fllor token from Trader Joe. 
                    With a new iterating algorithm on bins, Investing of idle pool Eth on GMX with weth rewards distributed to stakers, ETH lending and Self payable sVein loan.</p>
                    <div className="footbtn">
                        <a href="https://twitter.com/VeinFi">
                            <img src="https://www.v2.jimbosprotocol.xyz/svg/socials/twitter.svg" alt="" srcset="" />
                        </a>
                        <a href='https://discord.gg/yqEhxzxpjh'>
                            <img src="https://www.v2.jimbosprotocol.xyz/svg/socials/discord.svg" alt="" srcset="" />
                        </a>
                        <a href='https://arbiscan.io/token/0xC4A70668DeC1Da9862d9d20bf67d1eF4eE182450'>
                            <img src="https://www.v2.jimbosprotocol.xyz/svg/socials/etherscan.svg" alt="" srcset="" />
                        </a>
                        <a href='https://veinfi.gitbook.io/veinfis-docs'>
                            <span className="docs">Docs</span>
                        </a>
                    </div>
                </div>
                <div className="buyjoe">
                    <div className="banner">
                        <span className="bannerhead">WETH Borrow and Vein Staking</span>
                        <span className="bannertext">VEIN GMX Rewards and ETH Borrows would go live once we have enough Liquidity to sustain price floor, sVein staking live.</span>
                    </div>
                    <div className="buy">
                        <a className="" href='https://traderjoexyz.com/arbitrum/trade?inputCurrency=0xc4a70668dec1da9862d9d20bf67d1ef4ee182450&outputCurrency=ETH'>Buy on Trader Joe</a>
                        <span className="buytext">If Trader Joe doesn't let allow you to
                            swap, adjust your V2 slippage
                            (to at least 5%) and try again.</span>
                    </div>
                </div>
            </div>
            <div className="firstset">
                <div className="card">
                    <div className="cardinner">
                        <div className="cardtext">VEIN STATS</div>
                        <div className="cardbody">
                            <div className="stats">
                                <span className="ethtxt">VEIN floorprice</span>:
                                <span className="ethval">{Price} USD</span>
                            </div>
                            <div className="stats">
                                <span className="ethtxt">VEIN Burned</span>:
                                <span className="ethval">{Burned} 42631 VEIN</span>
                            </div>
							<div className="stats">
                                <span className="ethtxt">Burned USD Value</span>:
                                <span className="ethval">{Burned} {42919 * Price} VEIN</span>
                            </div>
                            <div className="stats">
                                <span className="ethtxt">WETH Earned</span>:
                                <span className="ethval">0 ETH</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="cardinner">
                        <div className="cardtext">Stake Vein</div>
                        <div className="cardbody">
                            <div className="displayquantities">
                                <div className="ethpoolbalance">
                                    <span className="pooltext">Vein token Earned</span>
                                    <span className="pooltext2">{Earned} VEIN</span>
                                </div>
                                <div className="userlimit">
                                    <span className="pooltext">Weth Earned</span>
                                    <span className="pooltext2">0 ETH</span>
                                </div>
                            </div>
                        </div>
						<div className='input1'>
						<input type='text' value={value} placeholder='enter amount ...' onChange={e => setValue(e.target.value)}/>
						</div>
                        <div className="cardfooter">
                            <a className="borrowbtn" onClick={Stake}>Stake</a>
                            <button  className="borrowbtn" onClick={Unstake}>Unstake</button>
							<button className="borrowbtn" onClick={Approve}>Approve</button>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="cardinner">
                        <div className="cardtext">Borrow ETH</div>
                        <div className="cardbody">
                            <div className="displayquantities">
                                <div className="ethpoolbalance">
                                    <span className="pooltext">Pool Eth balance</span>
                                    <span className="pooltext2">0 ETH</span>
                                </div>
                                <div className="userlimit">
                                    <span className="pooltext">Available to borrow</span>
                                    <span className="pooltext2">0 ETH</span>
                                </div>
                            </div>
                        </div>
                        <div className="cardfooter">
                            <button type="submit" className="borrowbtn">Borrow Eth</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="secondset">
                <div className="card">
                    <div className="cardinner">
                        <div className="cardtext">Payback ETH Loan</div>
                        <div className="cardbody">
                            <div className="displayquantities">
                                <div className="ethpoolbalance">
                                    <span className="pooltext">sVein Locked</span>
                                    <span className="pooltext2">0 sVEIN</span>
                                </div>
                                <div className="userlimit">
                                    <span className="pooltext">Eth to repay</span>
                                    <span className="pooltext2">0 ETH</span>
                                </div>
                            </div>
                        </div>
                        <div className="cardfooter">
                            <button type="submit" className="borrowbtn">Payback ETH</button>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="cardinner">
                        <div className="cardtext">Self Payable sVein Loan</div>
                        <div className="cardbody">
                            <div className="displayquantities">
                                <div className="ethpoolbalance">
                                    <span className="pooltext">Balance in Pool</span>
                                    <span className="pooltext2">0 VEIN</span>
                                </div>
                                <div className="userlimit">
                                    <span className="pooltext">sVein earned on loan</span>
                                    <span className="pooltext2">0 sVEIN</span>
                                </div>
                            </div>
                        </div>
                        <div className="cardfooter">
                            <button type="submit" className="borrowbtn">Borrow sVein</button>
                            <button type="submit" className="borrowbtn">Pay loan</button>
                        </div>
                    </div>
                </div>
                <div className="card-disclaimer">
                    <div className="cardinner">
                        <div className="cardtext">Legal Disclaimer</div>
                        <div className="paid">
                            <p className="disclaimer-text">
                                      $Veinfi was released in a fair way via Trader Joe outside of this website. The purchase of $VEIN tokens does not constitute an investment contract or any form of investment advice. We make no guarantees or promises about the future value or performance of the token, and the value of the token may fluctuate significantly. We are simply a humble yield generating protocol.

Also note that it might be illegal for you to own $VEIN tokens depending on your jurisdiction, check with your local laws.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="tabbar" className="sc-7b1da3fe-2 iLrfPR">
        <div className="sc-7b1da3fe-3 iaTQPR">
            <div className="sc-bfb53de4-0 bvVWBw">
                <button data-testid="tabbar-connect-button" type="button" className="sc-ipEyDJ jDbSZF" onClick={connectWallet}>
                    <div className="sc-csuSiG dDbrev">{ currentAccount ? <p> Wallet: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)} </p> : <p> Connect </p> }</div>
                    <div className="sc-eDWCr gFNLiS">
                        <div className="sc-bqWxrE jyomvB">
                        </div>
                    </div>
                </button>
            </div>
        </div>
    </div>
    <div className="sc-bebbde74-2 kiSQTD">
    </div>
</div>
	);
}

export default App;
