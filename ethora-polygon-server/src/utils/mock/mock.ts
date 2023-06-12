import Nfmt from '../../db/models/nfmt'
import nfmtContractsMock from './nfmtContract'

const main = async () => {
  for (const [index, item] of nfmtContractsMock.entries()) {
    let nfmt = await Nfmt.findOne({contractAddress: item.contractAddress})

    if (!nfmt) {
      const res = await Nfmt.create({
        ...item
      })

      console.log(res._id)
    }
  }
}

export default main