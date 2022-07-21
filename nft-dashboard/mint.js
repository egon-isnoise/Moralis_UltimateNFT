
const serverUrl = "https://d9psj6hqww8u.usemoralis.com:2053/server";
const appId = "qZvyR5EQfDCBEUmXCEPy6Zs9P8GlyjZXb7oF6CBy";
Moralis.start({ serverUrl, appId });

const nftContractAddress = "0x6331265613358390adc2883a8c66dbc4c6fc188d";
let web3;

async function init(){
    let currentUser = Moralis.User.current();
    if(!currentUser){
        window.location.pathname = "/nft-dashboard/index.html";
    }

    web3 = await Moralis.enableWeb3();
    userAddress = currentUser.get('ethAddress')
    
    console.log(userAddress)

    const urlParams = new URLSearchParams(window.location.search);
    const nftId = urlParams.get("nftId");
    document.getElementById("token_id_input").value = nftId;
    document.getElementById("address_input").value = userAddress;
}


async function mint(){

    let tokenId = parseInt(document.getElementById("token_id_input").value);
    let address = document.getElementById("address_input").value;
    let amount = parseInt(document.getElementById("amount_input").value);

    const options = {
        contractAddress: nftContractAddress,
        functionName: "mint",
        abi: contractAbi,
        params: { account: address, id: tokenId, amount: amount }
    }

    // const contract = new web3.eth.Contract(contractAbi, nftContractAddress)
    // contract.methods.mint(address, tokenId, amount).send({from: currentUser, value: 0})

    const transaction = await Moralis.executeFunction(options);
    console.log(transaction.hash);
}

document.getElementById("submit_mint").onclick = mint;

init();