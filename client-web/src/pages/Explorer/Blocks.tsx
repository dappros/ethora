import React, { useEffect, useState } from "react"
import { BlocksTable } from "../../components/BlocksTable"
import { FullPageSpinner } from "../../components/FullPageSpinner"
import { getExplorerBlocks } from "../../http"
import { ExplorerRespose, IBlock } from "../Profile/types"

export interface IBlocksProperties {}

const Blocks = (properties: IBlocksProperties) => {
  const [blocks, setBlocks] = useState<ExplorerRespose<IBlock[]>>({
    total: 0,
    limit: 0,
    items: [],
    offset: 0,
  })
  const [loading, setLoading] = useState(true)
  const getData = async () => {
    setLoading(true)
    try {
      const { data } = await getExplorerBlocks()
      setBlocks(data)
      console.log(data)
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }
  useEffect(() => {
    getData()
  }, [])
  if (loading) return <FullPageSpinner />
  return <BlocksTable blocks={blocks.items} />
}
export default Blocks
