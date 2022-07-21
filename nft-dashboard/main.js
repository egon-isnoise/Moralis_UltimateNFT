
const serverUrl = "https://d9psj6hqww8u.usemoralis.com:2053/server";
const appId = "qZvyR5EQfDCBEUmXCEPy6Zs9P8GlyjZXb7oF6CBy";

const nftContractAddress = "0x6331265613358390adc2883a8c66dbc4c6fc188d";

Moralis.start({ serverUrl, appId });
let currentUser = Moralis.User.current();

function fetchNFTMetadata(NFTs){
    let promises = [];
    for (let i = 0; i < NFTs.length; i++) {
        let nft = NFTs[i];
        let id = nft.token_id;
        // Moralis.Web3API.token.reSyncMetadata({address: nftContractAddress, token_id: id});
        // Call Moralis cloud function -> Static JSON file
        promises.push(fetch("https://d9psj6hqww8u.usemoralis.com:2053/server/functions/getNFT?_ApplicationId=qZvyR5EQfDCBEUmXCEPy6Zs9P8GlyjZXb7oF6CBy&nftId=" +id)
        .then(res => res.json())
        .then(res => JSON.parse(res.result))
        .then(res => {nft.metadata = res})
        .then(res => {
            const options = { address: nftContractAddress, token_id: id, chain: "rinkeby"};
            return Moralis.Web3API.token.getTokenIdOwners(options);
        })
        .then((res) => {
            // console.log(res)
            nft.owners = [];
            res.result.forEach(element => {
                nft.owners.push(element.owner_of);
            });
            return nft;
        }));
    }
    return Promise.all(promises);
}

function renderInventory(NFTs, ownerData){
    const parent = document.getElementById('app');

    for (let i = 0; i < NFTs.length; i++) {
        const nft = NFTs[i];
        let htmlString = `
        <div class="card">
        <img class="card-img-top" src="${nft.metadata.image}" alt="Card image cap">
        <div class="card-body">
            <h5 class="card-title">${nft.metadata.name}</h5>
            <p class="card-text">${nft.metadata.description}</p>
            <p class="card-text">Circulating amount: ${nft.amount}</p>
            <p class="card-text">Owners: ${nft.owners.length}</p>
            <p class="card-text">You own: ${ownerData[nft.token_id]}</p>
            <a href="/nft-dashboard/mint.html?nftId=${nft.token_id}" class="btn btn-primary">Mint</a>
            <a href="/nft-dashboard/transfer.html?nftId=${nft.token_id}" class="btn btn-secundary">Transfer</a>
        </div>
        </div>`

        let col = document.createElement("div");
        col.className = "col col-md-3"
        col.innerHTML = htmlString;
        parent.appendChild(col);
    }
}

async function login(){
    console.log("login clicked");
    var user = await Moralis.Web3.authenticate();
    if(user){
        console.log(user);
    }
}

async function getOwnerData(){
    userAddress = currentUser.get('ethAddress')
    const options = { chain: "rinkeby", address: userAddress, token_address: nftContractAddress };
    return Moralis.Web3API.account.getNFTsForContract(options).then((data) => {
        let result = data.result.reduce((object, currentElement) => {
            object[currentElement.token_id] = currentElement.amount;
            return object;
        }, {})
        return result;
    });

}

async function initializeApp(){
    // let currentUser = Moralis.User.current();
    // if(!currentUser){
    //     currentUser = await Moralis.Web3.authenticate();
    // }
    
    
    const options = { address: nftContractAddress, chain: "rinkeby" }
    let NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
    let NFTWithMetadata = await fetchNFTMetadata(NFTs.result);
    let ownerData = await getOwnerData();
    // console.log(NFTWithMetadata);
    renderInventory(NFTWithMetadata, ownerData);
}

initializeApp();