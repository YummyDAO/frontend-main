import React, { useEffect, useState } from 'react';
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import {ethers} from "ethers";
import contractAbi from './utils/contractABI.json';
import polygonLogo from './assets/polygonlogo.png';
import ethLogo from './assets/ethlogo.png';
import veinlogo from './assets/Veinfi-header.png'
import { networks } from './utils/networks';

// Constants
const TWITTER_HANDLE = 'blackluv10';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const tld = '.learnweb3dao';
const CONTRACT_ADDRESS = '0x4F12bD0a1A1C63f2C60d84BD95DAc0E06F814AC4';

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

	const updateDomain = async () => {
		if (!record || !domain) { return }
		setLoading(true);
		console.log("Updating domain", domain, "with record", record);
		  try {
			const { ethereum } = window;
			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
	
				let tx = await contract.setDetails(domain, record);
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
		if (network === 'Polygon Mumbai Testnet') {
			fetchMints();
		}
	}, [currentAccount, network]);

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
                        <a href=''>
                            <img src="https://www.v2.jimbosprotocol.xyz/svg/socials/etherscan.svg" alt="" srcset="" />
                        </a>
                        <a href='https://veinfi.gitbook.io/veinfis-docs'>
                            <span className="docs">Docs</span>
                        </a>
                    </div>
                </div>
                <div className="buyjoe">
                    <div className="banner">
                        <span className="bannerhead">VeinFi launch</span>
                        <span className="bannertext">All buttons are disabled until VeinFi is fully launched. ETH borrowing would commence immediately.</span>
                    </div>
                    <div className="buy">
                        <button className="">Buy on Trader Joe</button>
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
                                <span className="ethval">0.0000 ETH</span>
                            </div>
                            <div className="stats">
                                <span className="ethtxt">VEIN Burned</span>:
                                <span className="ethval">0 VEIN</span>
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
                                    <span className="pooltext2">0 VEIN</span>
                                </div>
                                <div className="userlimit">
                                    <span className="pooltext">Weth Earned</span>
                                    <span className="pooltext2">0 ETH</span>
                                </div>
                            </div>
                        </div>
                        <div className="cardfooter">
                            <button type="submit" className="borrowbtn">Stake</button>
                            <button type="submit" className="borrowbtn">Unstake</button>
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
