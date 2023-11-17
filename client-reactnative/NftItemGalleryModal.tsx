import { FlatList } from "react-native"
import React from "react"
import { NftListItem } from "./src/components/Transactions/NftListItem"
import Modal from "react-native-modal"
import { HStack } from "native-base"

export const NftItemGalleryModal = ({
  nftItems,
  onItemPress,
  isModalVisible,
  closeModal,
}) => {
  return (
    <Modal onBackdropPress={closeModal} isVisible={isModalVisible}>
      <HStack
        w={"100%"}
        height={"70%"}
        bgColor={"white"}
        padding={"1"}
        borderRadius={10}
      >
        <FlatList
          data={nftItems}
          renderItem={(e, index) => (
            <NftListItem
              assetUrl={e.item.imagePreview || e.item.nftFileUrl}
              name={e.item.tokenName}
              assetsYouHave={e.item.balance}
              totalAssets={e.item.total}
              onClick={() => onItemPress(e.item)}
              itemSelected={false}
              nftId={e.item.nftId}
              mimetype={e.item.nftMimetype}
              item={e.item}
              index={index}
            />
          )}
          nestedScrollEnabled={true}
          keyExtractor={(item, index) => index.toString()}
        />
      </HStack>
    </Modal>
  )
}
