import React from "react"
import { StyleSheet, Dimensions, View } from "react-native"
import Pdf from "react-native-pdf"
import { heightPercentageToDP } from "react-native-responsive-screen"

interface PdfViewerProps {
  uri: string
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ uri }) => {
  return (
    <View style={styles.container}>
      <Pdf
        trustAllCerts={false}
        source={{ uri, cache: true }}
        style={styles.pdf}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: "80%",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 25,
  },
  pdf: {
    // flex: 1,
    width: Dimensions.get("window").width,
    height: heightPercentageToDP("80%"),
  },
})
