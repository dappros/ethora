export const getRandomNFT = (itemsList) => {
    if (itemsList.success && itemsList.balance.length > 0) {
        const filteredItems = itemsList.balance.filter(item => item.tokenType === 'NFT' && item.balance > 0);
        if (filteredItems.length <= 0) {
            return [];
        }
        const randomIndex = Math.floor(Math.random() * filteredItems.length);
        return [filteredItems[randomIndex]];
    } else {
        return [];
    }
}